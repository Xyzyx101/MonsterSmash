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

        cameraPos.y = monsterPosition.y - monsterOffset.y;
        cameraPos.y = Math.max(cameraPos.y, 0);
        cameraPos.y = Math.min(cameraPos.y, levelSize.height - screenSize.height);

        return cameraPos;     
    }
    
    function getOffset() {
        return {
            x: cameraPos.x
            , y: cameraPos.y
        };
    }

    return {
        update: update
        , getOffset: getOffset
    };
};