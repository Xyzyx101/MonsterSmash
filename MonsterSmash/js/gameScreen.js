ms.screens.gameScreen = (function () {
    "use strict";
    var initialized
        , backgroundLayer = null
        , resources = []
        , currentLevel = null
        , baseSize = { width: 1024, height: 768 } // this is an arbitrary value for the art
        , levelSize = { width: 0, height: 0 }
        , gameScale = 0
        , frameRequestId
        , entities = []
        , buildings = []
        , canvas
        , ctx
        , bgCanvas
        , bgCtx
        , buildingQuadtree
        , scoreElement
        , powerMeterElement
        , displayScore
        , groundLevel = baseSize.height - 32
        , gravity = 1
        , monster
        , camera
    ;

    function run() {
        if (ms.gameManager.levelLoaded) {
            return;
        }

        if (!initialized) {
            initPauseOverlay();
            initUI();
            initialized = true;
        }

        var $ = ms.dom.$;
        var gameElement = $("#gameScreen")[0];
        var elementBounds = gameElement.getBoundingClientRect();
        gameScale = calculateScale(elementBounds);

        if (!$("#gameScreen .gameLayer")[0]) {
            canvas = document.createElement("canvas");
            ms.dom.addClass(canvas, "gameLayer");
            ctx = canvas.getContext("2d");
            canvas.width = baseSize.width * gameScale;
            canvas.height = baseSize.height * gameScale;
            ctx.scale(gameScale, gameScale);
            gameElement.appendChild(canvas);
        }

        if (!$("#gameScreen .backgroundLayer")[0]) {
            bgCanvas = document.createElement("canvas");
            ms.dom.addClass(bgCanvas, "backgroundLayer");
            bgCtx = bgCanvas.getContext("2d");
            bgCanvas.width = baseSize.width * gameScale;
            bgCanvas.height = baseSize.height * gameScale;
            bgCtx.scale(gameScale, gameScale);
            gameElement.appendChild(bgCanvas);
        }

        var gameHeader = $("#gameScreen header")[0];
        gameHeader.style.width = canvas.width + "px";
        loadLevel();
    }

    function calculateScale(clientSize) {
        var baseRatio = baseSize.width / baseSize.height;
        var clientRatio;
        if (clientSize.width >= clientSize.height) {
            clientRatio = clientSize.width / clientSize.height;
        } else {
            clientRatio = clientSize.height / clientSize.width;
        }
        var scale;
        if (clientRatio <= baseRatio) {
            scale = clientSize.width / baseSize.width;
        } else {
            scale = clientSize.height / baseSize.height;
        }
        return scale;
    }

    function loadLevel() {
        var $ = ms.dom.$;
        var progress = $("#gameScreen .loadOverlay progress")[0];
        displayLoadOverlay();
        var level = ms.gameManager.nextLevel();
        killTick();
        entities = [];
        resources = [];
        buildings = [];
        levelSize = level.levelSize;
        backgroundLayer = new ms.BackgroundLayer(bgCtx, level.background, levelSize);
        for (var building = 0, len = level.buildings.length; building < len; ++building) {
            var newBuilding = ms.buildingFactory.createBuilding(
                                    ctx
                                    , level.buildings[building].buildingStyle
                                    , level.buildings[building].xPos
                                    , level.buildings[building].size
                              );
            buildings.push(newBuilding);
        }
        var sprites = level.resources.sprites;
        for (var spriteIndex = 0, len = sprites.length; spriteIndex < len; ++spriteIndex) {
            ms.loadModule("sprites/" + sprites[spriteIndex] + ".js");
            var src = "sprites/" + sprites[spriteIndex] + ".png";
            if (!ms.imageManager.getImage(src)) {
                var resource = { isLoaded: false };
                var loadHandler = function () {
                    this.isLoaded = true;
                };
                var image = new Image();
                image.addEventListener("load", loadHandler.bind(resource), false);
                image.src = src;
                addResource(resource, image.src, image);
            }
        }

        buildingQuadtree = new ms.Quadtree(0, { x: 0, y: 0, width: levelSize.width, height: levelSize.height });

        function isLoaded(element) {
            return element.isLoaded === true;
        }
        /* setTimeout with delay 0 is used because I don't actually want a delay.
         * I do need to clear the call stack to allow the event loop to run my
         * onLoad events attached to each resource.  A regular loop would block.*/
        function verifyAllResourcesLoaded() {
            var loaded = resources.filter(isLoaded);
            if (loaded.length === resources.length && ms.resourcesLoaded() === 1) {
                startLevel(level);
                hideLoadOverlay();
                ms.gameManager.levelLoaded = true;
                frameRequestId = window.requestAnimationFrame(tick);
            } else {
                setTimeout(verifyAllResourcesLoaded, 0);
                progress.value = loaded.length / resources.length;
            }
        }
        setTimeout(verifyAllResourcesLoaded, 0);
    }

    function startLevel(level) {
        monster = registerEntity(new ms.Monster(ctx, level.playerSpawn, levelSize));
        camera = new ms.Camera(monster, levelSize, baseSize);
    }

    function addResource(resource, path, image) {
        ms.imageManager.storeImage(path, image);
        resources.push(resource);
    }

    function addSoundResource(newResource) {
        resources.push(newResource);
    }

    function registerEntity(entity) {
        entities.push(entity);
        return entity;
    }

    function destroy(entity) {
        var index = entities.indexOf(entity);
        entities.splice(index, 1);
    }

    var lastTick = 0;
    function tick(tickTime) {
        var dt = tickTime - lastTick;
        lastTick = tickTime;
        update(dt);
        render();
        if (frameRequestId) {
            frameRequestId = window.requestAnimationFrame(tick);
        }
    }

    var leftOverTime = 0;
    function update(dt) {
        var fixedUpdateTime = 20;
        var totalTime = dt + leftOverTime;
        while (totalTime > fixedUpdateTime) {
            var totalEntities = entities.length;
            var i, len;
            for (i = 0, len = entities.length; i < len; ++i) {
                entities[i].update(fixedUpdateTime);
            }
            buildingQuadtree.clear();
            for (i = 0, len = buildings.length; i < len; ++i) {
                buildings[i].addCollidersToQuadtree(buildingQuadtree);
            }
            totalTime -= fixedUpdateTime;
        }
        leftOverTime = totalTime;
        updateUI();
        camera.update();
    }

    function render() {
        backgroundLayer.render();
        var i = 0, len = 0;
        ctx.clearRect(0, 0, baseSize.width, baseSize.height);
        for (i = 0, len = buildings.length; i < len; ++i) {
            buildings[i].render();
        }
        for (i = 0, len = entities.length; i < len; ++i) {
            entities[i].render();
        }
        buildingQuadtree.debugDraw(ctx);
        
        //buildingQuadtree.debugRetrieve(ctx, new ms.Collider(275, 600, 50, 50, null));
        var hits = [];
        buildingQuadtree.retrieve(monster.getCollider(), hits, ctx);
    }

    function killTick() {
        if (frameRequestId) {
            window.cancelAnimationFrame(frameRequestId);
            frameRequestId = null;
        }
    }

    function displayLoadOverlay() {
        var $ = ms.dom.$;
        var overlay = $("#gameScreen .loadOverlay")[0];
        overlay.style.display = "block";
        if (canvas) {
            canvas.style.display = "none";
            bgCanvas.style.display = "none";
        }
    }

    function hideLoadOverlay() {
        var $ = ms.dom.$;
        var overlay = $("#gameScreen .loadOverlay")[0];
        overlay.style.display = "none";
        if (canvas) {
            canvas.style.display = "block";
            bgCanvas.style.display = "block";
        }
    }

    function initPauseOverlay() {
        ms.dom.bind("#gameScreen .pauseButton", "click", pause);
        ms.dom.bind("#gameScreen ul.menu", "click", function (e) {
            if (e.target.nodeName.toLowerCase() === "button") {
                var action = e.target.getAttribute("menuAction");
                menuAction(action);
            }
        });
        ms.dom.bind(".pauseOverlay", "click", unpause);
    }

    function menuAction(action) {
        switch (action) {
            case "resume":
                unpause();
                break;
            case "optionsScreen":
                ms.showScreen("optionsScreen");
                break;
            case "mainMenu":
                ms.gameManager.levelLoaded = false;
                var $ = ms.dom.$;
                var overlay = $("#gameScreen .pauseOverlay")[0];
                overlay.style.display = "none";
                ms.showScreen("mainMenu");
                break;
        }
    }

    function pause() {
        killTick();
        var $ = ms.dom.$;
        var overlay = $("#gameScreen .pauseOverlay")[0];
        overlay.style.display = "block";
    }

    function unpause() {
        var $ = ms.dom.$;
        var overlay = $("#gameScreen .pauseOverlay")[0];
        overlay.style.display = "none";
        window.requestAnimationFrame(function (tickTime) {
            lastTick = tickTime;
            frameRequestId = window.requestAnimationFrame(tick);
        });
    }

    function initUI() {
        scoreElement = ms.dom.$("#gameScreen .score")[0];
        powerMeterElement = ms.dom.$("#gameScreen .power")[0];
        displayScore = ms.gameManager.getScore();
        updateUI();
    }

    function updateUI() {
        var powerPercent = ms.gameManager.getPower() / ms.gameManager.MAX_POWER;
        var color1 = { r: 96, g: 168, b: 8 };
        var color2 = { r: 255, g: 6, b: 6 };
        var r = Math.floor(color1.r * powerPercent + color2.r * (1 - powerPercent))
            , g = Math.floor(color1.g * powerPercent + color2.g * (1 - powerPercent))
            , b = Math.floor(color1.b * powerPercent + color2.b * (1 - powerPercent))
        ;
        r = Math.max(0, Math.min(r, 255));
        g = Math.max(0, Math.min(g, 255));
        b = Math.max(0, Math.min(b, 255));
        powerMeterElement.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        powerMeterElement.style.width = Math.ceil(powerPercent * 100) + "%";
        var score = ms.gameManager.getScore();
        if (score > displayScore) {
            var newDisplayScore = Math.ceil((score - displayScore) * 0.1);
            displayScore = Math.min(displayScore + newDisplayScore, score);
            scoreElement.innerHTML = displayScore;
        }
    }

    function getGroundLevel() {
        return groundLevel;
    }

    function getGravity() {
        return gravity;
    }

    function getCameraOffset() {
        return camera.getOffset();
    }

    return {
        run: run
        , loadLevel: loadLevel
        , addResource: addResource
        , baseSize: baseSize
        , getGroundLevel: getGroundLevel
        , getGravity: getGravity
        , getCameraOffset: getCameraOffset
    };
})();