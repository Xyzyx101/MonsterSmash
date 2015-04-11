/* In game monster entity */
ms.Monster = function (ctx, initialPosition) {
    "use strict";

    var getHeld = ms.input.getHeld
        , getPressed = ms.input.getPressed
        , ACTION = ms.input.ACTION
        , groundLevel = ms.screens.gameScreen.getGroundLevel()
        , gravity = ms.screens.gameScreen.getGravity()
        , frameSize = { width: 160, height: 140 }
        , position = initialPosition
        , bbSize = { width: 74, height: 90 }  // Bounding box is centered in x and at the bottom in y
        , bbOffset = {
            x: Math.floor((frameSize.width - bbSize.width) * 0.5)
            , y: frameSize.height - bbSize.height
        }
        , flip = true
        , isStanding = false
        ,  vel = {x: 0, y: 0}
        , walkSpeed = 5
    ;
    
    var renderComp = ms.RenderComponent.call(this, ctx, "sprites/monsterSprite.png", ms.spriteData.monsterSprite, 40, frameSize);
    var frames =
    renderComp.addAnim(new ms.Anim(
        "Idle"
        , ["MonsterAnim_Idle.0000.png"
            , "MonsterAnim_Idle.0001.png"
            , "MonsterAnim_Idle.0002.png"
            , "MonsterAnim_Idle.0003.png"
            , "MonsterAnim_Idle.0004.png"]
        , [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1]
    ));
    renderComp.addAnim(new ms.Anim(
        "Walk"
        , ["MonsterAnim_Walk.0024.png"
            , "MonsterAnim_Walk.0025.png"
            , "MonsterAnim_Walk.0026.png"
            , "MonsterAnim_Walk.0027.png"
            , "MonsterAnim_Walk.0028.png"
            , "MonsterAnim_Walk.0029.png"
            , "MonsterAnim_Walk.0030.png"
            , "MonsterAnim_Walk.0031.png"
            , "MonsterAnim_Walk.0032.png"
            , "MonsterAnim_Walk.0033.png"
            , "MonsterAnim_Walk.0034.png"
            , "MonsterAnim_Walk.0035.png"
            , "MonsterAnim_Walk.0036.png"
            , "MonsterAnim_Walk.0037.png"
            , "MonsterAnim_Walk.0038.png"
            , "MonsterAnim_Walk.0039.png"
            , "MonsterAnim_Walk.0040.png"
            , "MonsterAnim_Walk.0041.png"
            , "MonsterAnim_Walk.0042.png"
            , "MonsterAnim_Walk.0043.png"
            , "MonsterAnim_Walk.0044.png"
            , "MonsterAnim_Walk.0045.png"
            , "MonsterAnim_Walk.0046.png"
            , "MonsterAnim_Walk.0047.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
    ));


    var FSM = ms.FSMComponent.call(this);
    FSM.addState("Idle",
        {
            before: function () {
                renderComp.changeAnim("Idle");
                vel.x = 0;
            }
            , state: function (dt) {
                if (getHeld(ACTION.RIGHT)) {
                    vel.x = walkSpeed;
                    FSM.changeState("Walk");
                } else if (getHeld(ACTION.LEFT)) {
                    vel.x = -walkSpeed;
                    FSM.changeState("Walk");
                }
                fall();
            }
            , after: function () {
                if (vel.x < 0) {
                    flip = true;
                } else {
                    flip = false;
                }
            }
        });
    FSM.addState("Walk",
        {
            before: function () {
                renderComp.changeAnim("Walk");
            }
            , state: function (dt) {
                if (getHeld(ACTION.RIGHT)) {
                    vel.x = walkSpeed;
                } else if (getHeld(ACTION.LEFT)) {
                    vel.x = -walkSpeed;
                } else {
                    FSM.changeState("Idle");
                }
                fall();
            }
            , after: function () {

            }
        });
    FSM.changeState("Idle");

    function update(dt) {
        FSM.update(dt);
        position.x += vel.x;
        position.y += vel.y;
        renderComp.animate(dt);
    }
    function render() {
        if (flip) {
            ctx.save();
            ctx.scale(-1, 1);
            renderComp.displayAnim(-(position.x + frameSize.width), position.y);
            ctx.restore();
        } else {
            renderComp.displayAnim(position.x, position.y);
        }
        
        debugDraw();
    }

    function debugDraw() {
        ctx.save();
        ctx.strokeStyle = "rgb(255,255,0)";
        ctx.strokeRect(position.x, position.y, frameSize.width, frameSize.height);
        ctx.fillStyle = "rgba(0, 255, 255, 0.4)";
        ctx.fillRect(position.x + bbOffset.x, position.y + bbOffset.y, bbSize.width, bbSize.height);
        ctx.restore();
    }

    function fall() {
        if (isStanding) {
            vel.y = 0;
        } else {
            vel.y += gravity;
            if (position.y + frameSize.height > groundLevel) {
                vel.y = 0;
                isStanding = true;
                position.y = groundLevel - frameSize.height;
            }
        }
    }

    function getFrameSize() {
        return frameSize;
    }


    function getPosition() {
        return position;
    }

    return {
        update: update
        , render: render
        , isLoaded: this.isLoaded
    };
};