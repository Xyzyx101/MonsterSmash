ms.PoliceCar = function (ctx, initialPosition) {
    "use strict";

    var frameSize = { width: 220, height: 48 }
        , position
        , bbSize = { width: 70, height: 25 }  // Bounding box is centered in x and at the bottom in y
        , bbOffset = {
            x: Math.floor((frameSize.width - bbSize.width) * 0.5)
            , y: frameSize.height - bbSize.height
        }
        , flip = true
        , vel = { x: 0, y: 0 }
        , driveSpeed = 10
        , monster
    ;
    position = { x: initialPosition.x, y: ms.screens.gameScreen.getGroundLevel() - frameSize.height };
    monster = ms.screens.gameScreen.getMonster();

    var renderComp = ms.RenderComponent.call(this, ctx, "sprites/PoliceCarSprite.png", ms.spriteData.policeCarSprite, 40, frameSize);
    renderComp.addAnim(new ms.Anim(
        "Idle"
        , ["PoliceCarIdle.0000.png"
            , "PoliceCarIdle.0001.png"
            , "PoliceCarIdle.0002.png"
            , "PoliceCarIdle.0003.png"
            , "PoliceCarIdle.0004.png"
            , "PoliceCarIdle.0005.png"
            , "PoliceCarIdle.0006.png"
            , "PoliceCarIdle.0007.png"
            , "PoliceCarIdle.0008.png"
            , "PoliceCarIdle.0009.png"
            , "PoliceCarIdle.0010.png"
            , "PoliceCarIdle.0011.png"
            , "PoliceCarIdle.0012.png"
            , "PoliceCarIdle.0013.png"
            , "PoliceCarIdle.0014.png"
            , "PoliceCarIdle.0015.png"
            , "PoliceCarIdle.0016.png"
            , "PoliceCarIdle.0017.png"
            , "PoliceCarIdle.0018.png"
            , "PoliceCarIdle.0019.png"
            , "PoliceCarIdle.0020.png"
            , "PoliceCarIdle.0021.png"
            , "PoliceCarIdle.0022.png"
            , "PoliceCarIdle.0023.png"
            , "PoliceCarIdle.0024.png"
            , "PoliceCarIdle.0025.png"
            , "PoliceCarIdle.0026.png"
            , "PoliceCarIdle.0027.png"
            , "PoliceCarIdle.0028.png"
            , "PoliceCarIdle.0029.png"
            , "PoliceCarIdle.0030.png"
            , "PoliceCarIdle.0031.png"
            , "PoliceCarIdle.0032.png"
            , "PoliceCarIdle.0033.png"
            , "PoliceCarIdle.0034.png"
            , "PoliceCarIdle.0035.png"
            , "PoliceCarIdle.0036.png"
            , "PoliceCarIdle.0037.png"
            , "PoliceCarIdle.0038.png"
            , "PoliceCarIdle.0039.png"
            , "PoliceCarIdle.0040.png"
            , "PoliceCarIdle.0041.png"
            , "PoliceCarIdle.0042.png"
            , "PoliceCarIdle.0043.png"
            , "PoliceCarIdle.0044.png"
            , "PoliceCarIdle.0045.png"
            , "PoliceCarIdle.0046.png"
            , "PoliceCarIdle.0047.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
    ));
    renderComp.addAnim(new ms.Anim(
        "Drive"
        , ["PoliceCarDrive.0072.png"
           , "PoliceCarDrive.0073.png"
           , "PoliceCarDrive.0074.png"
           , "PoliceCarDrive.0075.png"
           , "PoliceCarDrive.0076.png"
           , "PoliceCarDrive.0077.png"
           , "PoliceCarDrive.0078.png"
           , "PoliceCarDrive.0079.png"
           , "PoliceCarDrive.0080.png"
           , "PoliceCarDrive.0081.png"
           , "PoliceCarDrive.0082.png"
           , "PoliceCarDrive.0083.png"
           , "PoliceCarDrive.0084.png"
           , "PoliceCarDrive.0085.png"
           , "PoliceCarDrive.0086.png"
           , "PoliceCarDrive.0087.png"
           , "PoliceCarDrive.0088.png"
           , "PoliceCarDrive.0089.png"
           , "PoliceCarDrive.0090.png"
           , "PoliceCarDrive.0091.png"
           , "PoliceCarDrive.0092.png"
           , "PoliceCarDrive.0093.png"
           , "PoliceCarDrive.0094.png"
           , "PoliceCarDrive.0095.png"
           , "PoliceCarDrive.0096.png"
           , "PoliceCarDrive.0097.png"
           , "PoliceCarDrive.0098.png"
           , "PoliceCarDrive.0099.png"
           , "PoliceCarDrive.0100.png"
           , "PoliceCarDrive.0101.png"
           , "PoliceCarDrive.0102.png"
           , "PoliceCarDrive.0103.png"
           , "PoliceCarDrive.0104.png"
           , "PoliceCarDrive.0105.png"
           , "PoliceCarDrive.0106.png"
           , "PoliceCarDrive.0107.png"
           , "PoliceCarDrive.0108.png"
           , "PoliceCarDrive.0109.png"
           , "PoliceCarDrive.0110.png"
           , "PoliceCarDrive.0111.png"
           , "PoliceCarDrive.0112.png"
           , "PoliceCarDrive.0113.png"
           , "PoliceCarDrive.0114.png"
           , "PoliceCarDrive.0115.png"
           , "PoliceCarDrive.0116.png"
           , "PoliceCarDrive.0117.png"
           , "PoliceCarDrive.0118.png"
           , "PoliceCarDrive.0119.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
    ));
    renderComp.addAnim(new ms.Anim(
        "OpenDoor"
        , ["PoliceCarOpenDoor.0144.png"
            , "PoliceCarOpenDoor.0145.png"
            , "PoliceCarOpenDoor.0146.png"
            , "PoliceCarOpenDoor.0147.png"
            , "PoliceCarOpenDoor.0148.png"
            , "PoliceCarOpenDoor.0149.png"
            , "PoliceCarOpenDoor.0150.png"
            , "PoliceCarOpenDoor.0151.png"
            , "PoliceCarOpenDoor.0152.png"
            , "PoliceCarOpenDoor.0153.png"
            , "PoliceCarOpenDoor.0154.png"
            , "PoliceCarOpenDoor.0155.png"
            , "PoliceCarOpenDoor.0156.png"
            , "PoliceCarOpenDoor.0157.png"
            , "PoliceCarOpenDoor.0158.png"
            , "PoliceCarOpenDoor.0159.png"
            , "PoliceCarOpenDoor.0160.png"
            , "PoliceCarOpenDoor.0161.png"
            , "PoliceCarOpenDoor.0162.png"
            , "PoliceCarOpenDoor.0163.png"
            , "PoliceCarOpenDoor.0164.png"
            , "PoliceCarOpenDoor.0165.png"
            , "PoliceCarOpenDoor.0166.png"
            , "PoliceCarOpenDoor.0167.png"
            , "PoliceCarOpenDoor.0168.png"
            , "PoliceCarOpenDoor.0169.png"
            , "PoliceCarOpenDoor.0170.png"
            , "PoliceCarOpenDoor.0171.png"
            , "PoliceCarOpenDoor.0172.png"
            , "PoliceCarOpenDoor.0173.png"
            , "PoliceCarOpenDoor.0174.png"
            , "PoliceCarOpenDoor.0175.png"
            , "PoliceCarOpenDoor.0176.png"
            , "PoliceCarOpenDoor.0177.png"
            , "PoliceCarOpenDoor.0178.png"
            , "PoliceCarOpenDoor.0179.png"
            , "PoliceCarOpenDoor.0180.png"
            , "PoliceCarOpenDoor.0181.png"
            , "PoliceCarOpenDoor.0182.png"
            , "PoliceCarOpenDoor.0183.png"
            , "PoliceCarOpenDoor.0184.png"
            , "PoliceCarOpenDoor.0185.png"
            , "PoliceCarOpenDoor.0186.png"
            , "PoliceCarOpenDoor.0187.png"
            , "PoliceCarOpenDoor.0188.png"
            , "PoliceCarOpenDoor.0189.png"
            , "PoliceCarOpenDoor.0190.png"
            , "PoliceCarOpenDoor.0191.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
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
    FSM.addState("Drive",
        {
            before: function () {
                renderComp.changeAnim("Drive");
            }
            , state: function (dt) {

            }
            , after: function () {

            }
        });
    FSM.addState("OpenDoor",
       {
           before: function () {
               renderComp.changeAnim("OpenDoor");
           }
           , state: function (dt) {

           }
           , after: function () {

           }
       });
    FSM.changeState("Drive");

    function update(dt) {
        FSM.update(dt);
        position.x += vel.x;
        position.y += vel.y;
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
           , { type: "policeCar", obj: this });
    }

    function destroy() {
        // TODO
        console.log("TODO Police car destroy");
    }

    return {
        update: update
        , render: render
        , isLoaded: this.isLoaded
        , getCollider: getCollider
        , destroy: destroy
    };
};