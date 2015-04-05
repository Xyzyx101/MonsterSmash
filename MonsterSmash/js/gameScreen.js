monsterSmash.screens.gameScreen = (function () {
    "use strict";
    var gameState = null
        , backgroundLayer = null
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

    var calculateScale = function (clientSize) {
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
    };

    var loadLevel = function (level) {
        killTick();
        backgroundLayer = null;
        entities = [];
        resources = [];
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
    };

    var addResource = function (path, newResource) {
        monsterSmash.imageManager.storeImage(path, newResource.getImage());
        resources.push(newResource);
    };
    var addSoundResource = function (newResource) {
        resources.push(newResource);
    };
    var setBackgroundLayer = function (layer) {
        backgroundLayer = layer;
        levelSize.width = layer.width;
        levelSize.height = layer.height;
        return layer;
    };
    var registerEntity = function (entity) {
        entities.push(entity);
        return entity;
    };
    var destroy = function (entity) {
        var index = entities.indexOf(entity);
        entities.splice(index, 1);
    };

    var lastTick = 0;
    var tick = function (tickTime) {
        var dt = tickTime - lastTick;
        lastTick = tickTime;
        update(dt);
        render();
        if (frameRequestId) {
            frameRequestId = window.requestAnimationFrame(tick);
        }
    };

    var leftOverTime = 0;
    var update = function (dt) {
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
    };

    var render = function () {
        backgroundLayer.render();
        entities.forEach(function (element) {
            element.render();
        });
    };

    var killTick = function () {
        if (frameRequestId) {
            window.cancelAnimationFrame(frameRequestId);
            frameRequestId = null;
        }
    };

    return {
        run: run
        , loadLevel: loadLevel
    };
})();