monsterSmash.screens.gameScreen = (function () {
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
    ;

    function run() {
        var $ = monsterSmash.dom.$;
        var gameElement = $("#gameScreen")[0];
        canvas = document.createElement("canvas");
        monsterSmash.dom.addClass(canvas, "gameLayer");
        
        var elementBounds = gameElement.getBoundingClientRect();
        
        gameScale = calculateScale(elementBounds);
        ctx = canvas.getContext("2d");
        canvas.width = baseSize.width * gameScale;
        canvas.height = baseSize.height * gameScale;
        ctx.scale(gameScale, gameScale);
        gameElement.appendChild(canvas);

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
        var level = monsterSmash.gameManager.nextLevel();
        killTick();
        backgroundLayer = null;
        entities = [];
        resources = [];
        levelSize = level.levelSize;
        //currentLevel = new gameLevel();
        function notLoaded(element) {
            return element.isLoaded === false;
        }
        /* setTimeout with delay 0 is used because I don't actually want a delay.
         * I do need to clear the call stack to allow the event loop to run my
         * onLoad events attached to each resource.  A regular loop would block.*/
        function verifyAllResourcesLoaded() {
            if (resources.some(notLoaded)) {
                setTimeout(verifyAllResourcesLoaded, 0);
            } else {
                //killTick();
                frameRequestId = window.requestAnimationFrame(tick);
            }
        }
        setTimeout(verifyAllResourcesLoaded, 0);
    }

    function addResource(path, newResource) {
        monsterSmash.imageManager.storeImage(path, newResource.getImage());
        resources.push(newResource);
    }

    function addSoundResource(newResource) {
        resources.push(newResource);
    }

    function setBackgroundLayer(layer) {
        backgroundLayer = layer;
        levelSize.width = layer.width;
        levelSize.height = layer.height;
        return layer;
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

    return {
        run: run
        , loadLevel: loadLevel
    };
})();