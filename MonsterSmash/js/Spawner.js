/* The Spawner module keeps track of al the nemies that should be spawned in a level */
ms.Spawner = (function () {
    var spawns = []
        , ctx
        , registerEntity
    ;

    function addSpawn (type, position, rate) {
        spawns.push(new spawn(type, position, rate));
    }

    function update(dt) {
        for (var spawnIndex = 0, spawnsLen = spawns.length; spawnIndex < spawnsLen; ++spawnIndex) {
            var thisSpawn = spawns[spawnIndex];
            thisSpawn.timer -= dt;
            if (thisSpawn.timer < 0) {
                spawnNewEntity(thisSpawn.type, thisSpawn.position);
                thisSpawn.timer = thisSpawn.rate;
            } 
        }
    }

    function initSpawner(newCtx, registerEntityFunc) {
        spawns = [];
        ctx = newCtx;
        registerEntity = registerEntityFunc;
    }

    function spawnNewEntity(type, position) {
        if (type === "PoliceCar") {
            registerEntity(new ms.PoliceCar(position));
        }
    }

    return {
        addSpawn: addSpawn
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