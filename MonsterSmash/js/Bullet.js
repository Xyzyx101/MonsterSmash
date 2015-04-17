ms.Bullet = function (ctx, initialPosition, initialVelocity) {
    "use strict";

    var frameSize = { width: 32, height: 32 }
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
    ;

    var renderComp = ms.RenderComponent.call(this, ctx, "sprites/ProjectileSprite.png", ms.spriteData.projectile, 40, frameSize);
    renderComp.addAnim(new ms.Anim(
        "Idle"
        , ["Bullet.0000.png"
        , "Bullet.0001.png"
        , "Bullet.0002.png"
        , "Bullet.0003.png"
        , "Bullet.0004.png"
        , "Bullet.0005.png"]
        , [0, 1, 2, 3, 4, 5]
    ));

    renderComp.changeAnim("Idle");

    function update(dt) {
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
           , { type: "bullet", obj: this });
    }

    function destroy() {
        this.kill = true;
        ms.screens.gameScreen.markEntitiesDirty();
        ms.gameManager.addPower(-25);
    }

    return {
        update: update
        , render: render
        , isLoaded: this.isLoaded
        , getCollider: getCollider
        , destroy: destroy
    };

};