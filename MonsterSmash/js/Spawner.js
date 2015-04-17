/* The Spawner module keeps track of al the nemies that should be spawned in a level */
ms.Spawner = (function () {
    var spawns = []
        , registerEntity
        , baseWidth
    ;

    baseWidth = ms.screens.gameScreen.baseSize.width;

    function addSpawn (type, position, rate) {
        spawns.push(new spawn(type, position, rate));
    }

    function update(dt) {
        for (var spawnIndex = 0, spawnsLen = spawns.length; spawnIndex < spawnsLen; ++spawnIndex) {
            var thisSpawn = spawns[spawnIndex];
            thisSpawn.timer -= dt;
            if (thisSpawn.timer < 0) {
                var cameraOffset = ms.screens.gameScreen.getCameraOffset();
                /* Only spawns when not on screen */
                if (thisSpawn.position.x < cameraOffset.x - 100 || thisSpawn.position.x > cameraOffset.x + baseWidth + 100) {
                    spawnNewEntity(thisSpawn.type, thisSpawn.position);
                    thisSpawn.timer = thisSpawn.rate;
                }
            } 
        }
    }

    function init(newCtx, registerEntityFunc) {
        spawns = [];
        ctx = newCtx;
        registerEntity = registerEntityFunc;
    }

    function spawnNewEntity(type, position) {
        var ctx = ms.screens.gameScreen.getRenderContext();
        if (type === "PoliceCar") {
            registerEntity(new ms.PoliceCar(ctx, position));
        }
    }

    return {
        addSpawn: addSpawn
        , init: init
        , update: update
    };


    /* Spawn class */
    function spawn(type, position, rate) {
        this.type = type;
        this.position = position;
        this.rate = rate;
        this.timer = -1;
    }
})();