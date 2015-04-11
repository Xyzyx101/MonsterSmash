/* In game monster entity */
ms.Monster = function (ctx, initialPosition) {
    "use strict";
    var that = this;

    var frameSize = {
        width: 160
        , height: 140
    };
    function getFrameSize() {
        return frameSize;
    }

    var position = initialPosition;
    function getPosition() {
        return position;
    }

    // Bounding box is centered in x and at the bottom in y
    var bbSize = {width:74, height:90};
    var bbOffset = {
        x: Math.floor((frameSize.width - bbSize.width) * 0.5)
        , y: frameSize.height - bbSize.height
    };

    var flip = true;
    var isStanding = false;

    var maxVelocity = {
        walk: 325,
        run: 500,
        fly: 750,
        y: 800.0
    };
    var velocity = { x: 0, y: 0 };
    var acceleration = {
        walk: 0.5,
        run: 0.75,
        fly: 0.1
    }; // horizontal acceleration
    var gravity = 2.4; // vertical acceleration
    var initialJumpVelocity = 750;
    var holdJumpAcceleration = 200;

    var jumpTimer = 0;
    var maxHoldJumpTime = 10000;
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
        , [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]
    ));


    var FSM = ms.FSMComponent.call(this);
    FSM.addState("test01",
        {
            before: function () {
                //console.log("init test state");
                renderComp.changeAnim("Idle");
                jumpTimer = maxHoldJumpTime;
            }
            , state: function (dt) {
                //console.log("test state")
                jumpTimer -= dt;
                if (jumpTimer <= 0) {
                    FSM.changeState("test02");
                }
            }
            , after: function () {
                //console.log("cleanup test state");
            }
        });
    FSM.addState("test02",
        {
            before: function () {
                //console.log("init test02 state");
                renderComp.changeAnim("Walk");
                jumpTimer = maxHoldJumpTime;
            }
            , state: function (dt) {
                //console.log("test02 state")
                jumpTimer -= dt;
                if (jumpTimer <= 0) {
                    FSM.changeState("test01");
                }
            }
            , after: function () {
                //console.log("cleanup test02 state");
            }
        });
    FSM.changeState("test01");

    function update(dt) {
        FSM.update(dt);
        renderComp.animate(dt);
    }
    function render() {
        renderComp.displayAnim(position.x, position.y);
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

    return {
        update: update
        , render: render
        , isLoaded: this.isLoaded
    };
};