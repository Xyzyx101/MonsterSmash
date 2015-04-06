﻿monsterSmash.screens.gameScreen = (function () {
    "use strict";
    var backgroundLayer = null
        , resources = []
        , currentLevel = null
        , baseSize = { width: 1024, height: 768 } // this is an arbitrary value for the art
        , levelSize = { width: 0, height: 0 }
        , gameScale = 0
        , frameRequestId
        , entities = []
        , canvas
        , ctx
        , bgCanvas
        , bgCtx
    ;

    function run() {
        var $ = monsterSmash.dom.$;
        var gameElement = $("#gameScreen")[0];
        var elementBounds = gameElement.getBoundingClientRect();
        gameScale = calculateScale(elementBounds);

        canvas = document.createElement("canvas");
        monsterSmash.dom.addClass(canvas, "gameLayer");
        ctx = canvas.getContext("2d");
        canvas.width = baseSize.width * gameScale;
        canvas.height = baseSize.height * gameScale;
        ctx.scale(gameScale, gameScale);
        gameElement.appendChild(canvas);

        bgCanvas = document.createElement("canvas");
        monsterSmash.dom.addClass(bgCanvas, "backgroundLayer");
        bgCtx = bgCanvas.getContext("2d");
        bgCanvas.width = baseSize.width * gameScale;
        bgCanvas.height = baseSize.height * gameScale;
        bgCtx.scale(gameScale, gameScale);
        gameElement.appendChild(bgCanvas);

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
        var $ = monsterSmash.dom.$;
        var progress = $("#gameScreen .loadOverlay progress")[0];
        displayLoadOverlay();
        var level = monsterSmash.gameManager.nextLevel();
        killTick();
        entities = [];
        resources = [];
        levelSize = level.levelSize;
        backgroundLayer = new monsterSmash.BackgroundLayer(bgCtx, level.background);
        function isLoaded(element) {
            return element.isLoaded === true;
        }
        /* setTimeout with delay 0 is used because I don't actually want a delay.
         * I do need to clear the call stack to allow the event loop to run my
         * onLoad events attached to each resource.  A regular loop would block.*/
        function verifyAllResourcesLoaded() {
            var loaded = resources.filter(isLoaded);
            if (loaded.length === resources.length) {
                //killTick();
                hideLoadOverlay();
                frameRequestId = window.requestAnimationFrame(tick);
            } else {
                setTimeout(verifyAllResourcesLoaded, 0);
                progress.value = loaded.length / resources.length;
            }
        }
        setTimeout(verifyAllResourcesLoaded, 0);
        unpause();
    }

    function addResource(path, newResource) {
        monsterSmash.imageManager.storeImage(path, newResource.getImage());
        resources.push(newResource);
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
            for (var i = 0; i < totalEntities; ++i) {
                entities[i].update(fixedUpdateTime);
            }
            totalTime -= fixedUpdateTime;
        }
        leftOverTime = totalTime;
    }

    function render() {
        backgroundLayer.render();
        for (var i = 0, len = entities.len; i < len; ++i) {
            entities[i].render();
        }
    }

    function killTick() {
        if (frameRequestId) {
            window.cancelAnimationFrame(frameRequestId);
            frameRequestId = null;
        }
    }

    function displayLoadOverlay() {
        var $ = monsterSmash.dom.$;
        var overlay = $("#gameScreen .loadOverlay")[0];
        overlay.style.display = "block";
    }

    function hideLoadOverlay() {
        var $ = monsterSmash.dom.$;
        var overlay = $("#gameScreen .loadOverlay")[0];
        overlay.style.display = "none";
    }

    function pause() {
        var $ = monsterSmash.dom.$;
        var overlay = $("#gameScreen .pauseOverlay")[0];
        overlay.style.display = "block";
    }

    function unpause() {
        var $ = monsterSmash.dom.$;
        var overlay = $("#gameScreen .pauseOverlay")[0];
        overlay.style.display = "none";
    }

    return {
        run: run
        , loadLevel: loadLevel
        , addResource: addResource
    };
})();