ms.MeteorChunk = function (ctx, initialPosition, initialVelocity) {
    "use strict";

    var frameSize = { width: 200, height: 200 }
        , position = initialPosition
        , bbSize = { width: 32, height: 32 }  // Bounding box is centered in x and at the bottom in y
        , bbOffset = {
            x: Math.floor((frameSize.width - bbSize.width) * 0.5)
            , y: Math.floor((frameSize.height - bbSize.height) * 0.5)
        }
        , flip = false
        , vel = initialVelocity
        , groundLevel = ms.screens.gameScreen.getGroundLevel()
        , gravity = ms.screens.gameScreen.getGravity()
        , isStanding = false
    ;

    var renderComp = ms.RenderComponent.call(this, ctx, "sprites/ProjectileSprite.png", ms.spriteData.projectile, 40, frameSize);
    renderComp.addAnim(new ms.Anim(
        "Idle"
        , ["Meteor.0000.png"
            , "Meteor.0001.png"
            , "Meteor.0002.png"
            , "Meteor.0003.png"
            , "Meteor.0004.png"
            , "Meteor.0005.png"
            , "Meteor.0006.png"
            , "Meteor.0007.png"
            , "Meteor.0008.png"
            , "Meteor.0009.png"
            , "Meteor.0010.png"
            , "Meteor.0011.png"
            , "Meteor.0012.png"
            , "Meteor.0013.png"
            , "Meteor.0014.png"
            , "Meteor.0015.png"
            , "Meteor.0016.png"
            , "Meteor.0017.png"
            , "Meteor.0018.png"
            , "Meteor.0019.png"
            , "Meteor.0020.png"
            , "Meteor.0021.png"
            , "Meteor.0022.png"
            , "Meteor.0023.png"
            , "Meteor.0024.png"
            , "Meteor.0025.png"
            , "Meteor.0026.png"
            , "Meteor.0027.png"
            , "Meteor.0028.png"
            , "Meteor.0029.png"
            , "Meteor.0030.png"
            , "Meteor.0031.png"
            , "Meteor.0032.png"
            , "Meteor.0033.png"
            , "Meteor.0034.png"
            , "Meteor.0035.png"
            , "Meteor.0036.png"
            , "Meteor.0037.png"
            , "Meteor.0038.png"
            , "Meteor.0039.png"
            , "Meteor.0040.png"
            , "Meteor.0041.png"
            , "Meteor.0042.png"
            , "Meteor.0043.png"
            , "Meteor.0044.png"
            , "Meteor.0045.png"
            , "Meteor.0046.png"
            , "Meteor.0047.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
    ));

    renderComp.changeAnim("Idle");

    function update(dt) {
        if (isStanding) {
            vel.x *= 0.9;
            vel.y = 0;
        } else {
            vel.y += gravity * 0.05;
            if (position.y + frameSize.height - bbOffset.y > groundLevel) {
                vel.y = 0;
                isStanding = true;
                position.y = groundLevel - frameSize.height + bbOffset.y;
            }
        }
        position.x += vel.x * dt * 0.05;
        position.y += vel.y * dt * 0.05;
        renderComp.animate(dt);
    }
    function render() {
        renderComp.displayAnim(position.x, position.y, flip);
    }

    function getCollider() {
        return new ms.Collider(
           position.x + bbOffset.x
           , position.y + bbOffset.y
           , bbSize.width
           , bbSize.height
           , { type: "meteor", obj: this });
    }

    function destroy() {
        ms.sound.play("powerUp");
        this.kill = true;
        ms.screens.gameScreen.markEntitiesDirty();
        ms.gameManager.addPower(200);
        ms.gameManager.addScore(500);
    }

    return {
        update: update
        , render: render
        , isLoaded: this.isLoaded
        , getCollider: getCollider
        , destroy: destroy
    };

};