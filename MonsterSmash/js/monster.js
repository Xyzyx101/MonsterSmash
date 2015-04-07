/* In game monster entity */
monsterSmash.Monster = function (ctx, initialPosition) {
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

    var renderComp = monsterSmash.RenderComponent.call(this, ctx, "./images/monster01.png", 100, frameSize);
    renderComp.addAnim(new monsterSmash.Anim(
        "Test"
        , [{ x: 0, y: 0 }, { x: frameSize.width, y: 0 }]
        , [0, 1, 1, 1]
        )
    );
    renderComp.changeAnim("Test");
    function update(dt) {
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