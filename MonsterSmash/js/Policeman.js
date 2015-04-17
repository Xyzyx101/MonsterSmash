ms.Policeman = function (ctx, initialPosition) {
    "use strict";

    var frameSize = { width: 27, height: 42 }
        , position
        , bbSize = { width: 27, height: 38 }  // Bounding box is centered in x and at the bottom in y
        , bbOffset = {
            x: Math.floor((frameSize.width - bbSize.width) * 0.5)
            , y: frameSize.height - bbSize.height
        }
        , flip = true
        , vel = { x: 0, y: 0 }
        , baseWalkSpeed = 0.5
        , monster
        , shootTime = 4000
        , shootTimer = -1
        , walkTime = 6500
        , walkTimer = -1
        , bulletSpeed = 5
    ;
    position = { x: initialPosition.x, y: ms.screens.gameScreen.getGroundLevel() - frameSize.height + bbOffset.y};
    monster = ms.screens.gameScreen.getMonster();

    var renderComp = ms.RenderComponent.call(this, ctx, "sprites/PolicemanSprite.png", ms.spriteData.PolicemanSprite, 40, frameSize);
    renderComp.addAnim(new ms.Anim(
        "Idle"
        , ["PoliceMan.png"]
        , [0]
    ));
    renderComp.addAnim(new ms.Anim(
        "Walk"
        , ["PoliceMan.png"]
        , [0]
    ));
    renderComp.addAnim(new ms.Anim(
        "Shoot"
        , ["PoliceMan.png"]
        , [0]
    ));
    
    var FSM = ms.FSMComponent.call(this);
    FSM.addState("Idle",
        {
            before: function () {
                renderComp.changeAnim("Idle");
                vel.x = 0;
            }
            , state: function (dt) {

            }
            , after: function () {

            }
        });
    FSM.addState("Walk",
        {
            before: function () {
                renderComp.changeAnim("Walk");
            }
            , state: function (dt) {
                walkTimer -= dt;
                if (walkTimer < 0) {
                    walkTimer = walkTime;
                    var walkSpeed;
                    var monsterCenter = monster.getCenter();
                    if (monsterCenter.x < position.x) {
                        flip = false;
                        walkSpeed = -baseWalkSpeed;
                    } else {
                        flip = true;
                        walkSpeed = baseWalkSpeed;
                    }
                    vel.x = walkSpeed;
                }
                shootTimer -= dt;
                if (shootTimer < 0) {
                    shootTimer = shootTime;
                    FSM.changeState("Shoot");
                }
                position.x += vel.x * dt * 0.05;
            }
            , after: function () {

            }
        });
    FSM.addState("Shoot",
       {
           before: function () {
               renderComp.changeAnim("Shoot", function () { FSM.changeState("Walk"); });
               vel.x = 0;
               shoot();
           }
           , state: function (dt) {
               vel.x *= 0.9;
           }
           , after: function () {
               
           }
       });
    FSM.changeState("Walk");

    function update(dt) {
        FSM.update(dt);
        position.x += vel.x;
        position.y += vel.y;
        renderComp.animate(dt);
    }

    function render() {
        renderComp.displayAnim(position.x, position.y, flip);
    }

    function shoot() {
        var myX = position.x + frameSize.width * 0.5;
        var myY = position.y + frameSize.height * 0.5;
        var monsterX = monster.getCenter().x;
        var monsterY = monster.getCenter().y;
        var xComp = monsterX - myX;
        var yComp = monsterY - myY;
        var mag = Math.sqrt(xComp * xComp + yComp * yComp);
        xComp = xComp / mag * bulletSpeed;
        yComp = yComp / mag * bulletSpeed;
        var bullet = new ms.Bullet(ctx, { x: myX, y: myY }, { x: xComp, y: yComp });
        ms.screens.gameScreen.registerEntity(bullet);
        ms.sound.play("gun");
    }

    function getCollider() {
        return new ms.Collider(
           position.x + bbOffset.x
           , position.y + bbOffset.y
           , bbSize.width
           , bbSize.height
           , { type: "policeman", obj: this });
    }

    function destroy() {
        this.kill = true;
        ms.screens.gameScreen.markEntitiesDirty();
        ms.sound.play("eat");
        ms.gameManager.addScore(350);
    }

    return {
        update: update
        , render: render
        , isLoaded: this.isLoaded
        , getCollider: getCollider
        , destroy: destroy
    };
};