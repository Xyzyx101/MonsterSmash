/* In game monster entity */
ms.Monster = function (ctx, initialPosition) {
    "use strict";
    var that = this;

    var frameSize = {
        width: 64
        , height: 140
    };
    function getFrameSize() {
        return frameSize;
    }

    var position = initialPosition;
    function getPosition() {
        return position;
    }

    /*
    // Bounding box is centered in x and at the bottom in y
    var bbSize = {width:46, height:56};
    var bbOffset = {x:9, y:8};
    var bb = new sm3.BoundingBox(position, frameSize, bbSize, bbOffset);
    this.getBoundingBox = function () {
        return bb;
    };*/

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
    var maxHoldJumpTime = 400;

    var renderComp = ms.RenderComponent.call(this, ctx, "./images/monster01.png", 100, frameSize);
    renderComp.addAnim(new ms.Anim(
        "TestAnim01"
        , [{ x: 0, y: 0 }, { x: frameSize.width, y: 0 }]
        , [0, 1, 1, 1]
        )
    );
    renderComp.addAnim(new ms.Anim(
        "TestAnim02"
        , [{ x: 0, y: 0 }, { x: frameSize.width, y: 0 }]
        , [0, 1, 0, 1]
        )
    );
    var FSM = ms.FSMComponent.call(this);
    FSM.addState("test01",
        {
            before: function () {
                //console.log("init test state");
                renderComp.changeAnim("TestAnim01");
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
                renderComp.changeAnim("TestAnim02");
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
    }

    return {
        update: update
        , render: render
        , isLoaded: this.isLoaded
    };
};