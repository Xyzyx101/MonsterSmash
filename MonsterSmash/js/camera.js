ms.Camera = function (monster, levelSize, screenSize) {
    "use strict";
    var cameraPos = { x: 0, y: 0 }
        , monsterSize = monster.getFrameSize()
        , monsterOffset = {}
    ;
    monsterOffset.x = Math.floor((screenSize.width - monsterSize.width) * 0.5);
    monsterOffset.y = Math.floor((screenSize.height - monsterSize.height) * 0.5);

    function update() {
        var monsterPosition = monster.getPosition();
        cameraPos.x = monsterPosition.x - monsterOffset.x;
        cameraPos.x = Math.max(cameraPos.x, 0);
        cameraPos.x = Math.min(cameraPos.x, levelSize.width - screenSize.width);

        cameraPos.y = monsterPosition.y - monsterOffset.y
        cameraPos.y = Math.max(cameraPos.y, 0);
        cameraPos.y = Math.min(cameraPos.y, levelSize.height - screenSize.height);

        console.log(cameraPos);
        return cameraPos;     
    };
    
    function getScreenCollider() {
        /* The screen collider is used to optimize updating and rending only the entities on the screen
         * The screen collider actually includes a band 100px wide around the screen
         * This is so entities right at the edge will still update correctly and move onto the screen */
        return new ms.Collider(
            cameraPos.x - 100
            , cameraPos.y - 100
            , screenSize.width + 200
            , screenSize.height + 200
        );
    };

    function getOffset() {
        return {
            x: cameraPos.x
            , y: cameraPos.y
        };
    }

    return {
        update: update
        , getScreenCollider: getScreenCollider
        , getOffset: getOffset
    };
};