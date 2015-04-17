/* In game monster entity */
ms.Monster = function (ctx, initialPosition, levelSize) {
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
        , flip = false
        , isStanding = false
        , vel = { x: 0, y: 0 }
        , walkSpeed = 5
        , isTouchingBuilding = false
        , isTouchingEdge = false
        , isTouchingRoof = false
        , jumpTimer
        , jumpTime = 200
        , climbSpeed = 4
        , lastClimbDirection
        , attackHit
        , attackCollider
        , attackColliderSize = { width: 64, height: 64 }
    ;
    initAttackCollider();
    var renderComp = ms.RenderComponent.call(this, ctx, "sprites/monsterSprite.png", ms.spriteData.monsterSprite, 40, frameSize);
    renderComp.addAnim(new ms.Anim(
        "Idle"
        , ["MonsterAnim_Idle.0000.png"
            , "MonsterAnim_Idle.0001.png"
            , "MonsterAnim_Idle.0002.png"
            , "MonsterAnim_Idle.0003.png"
            , "MonsterAnim_Idle.0004.png"
            , "MonsterAnim_Idle.0005.png"
            , "MonsterAnim_Idle.0006.png"
            , "MonsterAnim_Idle.0007.png"
            , "MonsterAnim_Idle.0008.png"
            , "MonsterAnim_Idle.0009.png"
            , "MonsterAnim_Idle.0010.png"
            , "MonsterAnim_Idle.0011.png"
            , "MonsterAnim_Idle.0012.png"
            , "MonsterAnim_Idle.0013.png"
            , "MonsterAnim_Idle.0014.png"
            , "MonsterAnim_Idle.0015.png"
            , "MonsterAnim_Idle.0016.png"
            , "MonsterAnim_Idle.0017.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
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
    renderComp.addAnim(new ms.Anim(
        "Eat"
        , ["MonsterAnim_Eat.0057.png"
            , "MonsterAnim_Eat.0058.png"
            , "MonsterAnim_Eat.0059.png"
            , "MonsterAnim_Eat.0060.png"
            , "MonsterAnim_Eat.0061.png"
            , "MonsterAnim_Eat.0062.png"
            , "MonsterAnim_Eat.0063.png"
            , "MonsterAnim_Eat.0064.png"
            , "MonsterAnim_Eat.0065.png"
            , "MonsterAnim_Eat.0066.png"
            , "MonsterAnim_Eat.0067.png"
            , "MonsterAnim_Eat.0068.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    ));
    renderComp.addAnim(new ms.Anim(
        "VertAttack"
        , ["MonsterAnimVert_Attack.0036.png"
            , "MonsterAnimVert_Attack.0037.png"
            , "MonsterAnimVert_Attack.0038.png"
            , "MonsterAnimVert_Attack.0039.png"
            , "MonsterAnimVert_Attack.0040.png"
            , "MonsterAnimVert_Attack.0041.png"
            , "MonsterAnimVert_Attack.0042.png"
            , "MonsterAnimVert_Attack.0043.png"
            , "MonsterAnimVert_Attack.0044.png"
            , "MonsterAnimVert_Attack.0045.png"
            , "MonsterAnimVert_Attack.0046.png"
            , "MonsterAnimVert_Attack.0047.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    ));
    renderComp.addAnim(new ms.Anim(
        "VertAttackSideways"
        , ["MonsterAnimVert_AttackSideways.0078.png"
            , "MonsterAnimVert_AttackSideways.0078.png"
            , "MonsterAnimVert_AttackSideways.0079.png"
            , "MonsterAnimVert_AttackSideways.0080.png"
            , "MonsterAnimVert_AttackSideways.0081.png"
            , "MonsterAnimVert_AttackSideways.0082.png"
            , "MonsterAnimVert_AttackSideways.0083.png"
            , "MonsterAnimVert_AttackSideways.0084.png"
            , "MonsterAnimVert_AttackSideways.0085.png"
            , "MonsterAnimVert_AttackSideways.0086.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ));
    renderComp.addAnim(new ms.Anim(
       "VertAttackUp"
        , ["MonsterAnimVert_AttackUp.0058.png"
            , "MonsterAnimVert_AttackUp.0059.png"
            , "MonsterAnimVert_AttackUp.0060.png"
            , "MonsterAnimVert_AttackUp.0061.png"
            , "MonsterAnimVert_AttackUp.0062.png"
            , "MonsterAnimVert_AttackUp.0063.png"
            , "MonsterAnimVert_AttackUp.0064.png"
            , "MonsterAnimVert_AttackUp.0065.png"
            , "MonsterAnimVert_AttackUp.0066.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8]
    ));
    renderComp.addAnim(new ms.Anim(
       "VertClimb"
        , ["MonsterAnimVert_Climb.0000.png"
            , "MonsterAnimVert_Climb.0001.png"
            , "MonsterAnimVert_Climb.0002.png"
            , "MonsterAnimVert_Climb.0003.png"
            , "MonsterAnimVert_Climb.0004.png"
            , "MonsterAnimVert_Climb.0005.png"
            , "MonsterAnimVert_Climb.0006.png"
            , "MonsterAnimVert_Climb.0007.png"
            , "MonsterAnimVert_Climb.0008.png"
            , "MonsterAnimVert_Climb.0009.png"
            , "MonsterAnimVert_Climb.0010.png"
            , "MonsterAnimVert_Climb.0011.png"
            , "MonsterAnimVert_Climb.0012.png"
            , "MonsterAnimVert_Climb.0013.png"
            , "MonsterAnimVert_Climb.0014.png"
            , "MonsterAnimVert_Climb.0015.png"
            , "MonsterAnimVert_Climb.0016.png"
            , "MonsterAnimVert_Climb.0017.png"
            , "MonsterAnimVert_Climb.0018.png"
            , "MonsterAnimVert_Climb.0019.png"
            , "MonsterAnimVert_Climb.0020.png"
            , "MonsterAnimVert_Climb.0021.png"
            , "MonsterAnimVert_Climb.0022.png"
            , "MonsterAnimVert_Climb.0023.png"]
         , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    ));
    renderComp.addAnim(new ms.Anim(
      "VertClimbSideways"
       , ["MonsterAnimVert_ClimbSideways.0096.png"
           , "MonsterAnimVert_ClimbSideways.0097.png"
           , "MonsterAnimVert_ClimbSideways.0098.png"
           , "MonsterAnimVert_ClimbSideways.0099.png"
           , "MonsterAnimVert_ClimbSideways.0100.png"
           , "MonsterAnimVert_ClimbSideways.0101.png"
           , "MonsterAnimVert_ClimbSideways.0102.png"
           , "MonsterAnimVert_ClimbSideways.0103.png"
           , "MonsterAnimVert_ClimbSideways.0104.png"
           , "MonsterAnimVert_ClimbSideways.0105.png"
           , "MonsterAnimVert_ClimbSideways.0106.png"
           , "MonsterAnimVert_ClimbSideways.0107.png"
           , "MonsterAnimVert_ClimbSideways.0108.png"
           , "MonsterAnimVert_ClimbSideways.0109.png"
           , "MonsterAnimVert_ClimbSideways.0110.png"
           , "MonsterAnimVert_ClimbSideways.0111.png"
           , "MonsterAnimVert_ClimbSideways.0112.png"
           , "MonsterAnimVert_ClimbSideways.0113.png"
           , "MonsterAnimVert_ClimbSideways.0114.png"
           , "MonsterAnimVert_ClimbSideways.0115.png"
           , "MonsterAnimVert_ClimbSideways.0116.png"
           , "MonsterAnimVert_ClimbSideways.0117.png"
           , "MonsterAnimVert_ClimbSideways.0118.png"
           , "MonsterAnimVert_ClimbSideways.0119.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    ));
    renderComp.addAnim(new ms.Anim(
      "AirPunch"
        , ["MonsterAnim_AirPunch.0131.png"
            , "MonsterAnim_AirPunch.0132.png"
            , "MonsterAnim_AirPunch.0133.png"
            , "MonsterAnim_AirPunch.0134.png"
            , "MonsterAnim_AirPunch.0135.png"]
         , [0, 1, 2, 3, 4]
    ));
    renderComp.addAnim(new ms.Anim(
      "AirPunchUp"
        , ["MonsterAnim_AirPunchUp.0137.png"
            , "MonsterAnim_AirPunchUp.0138.png"
            , "MonsterAnim_AirPunchUp.0139.png"
            , "MonsterAnim_AirPunchUp.0140.png"
            , "MonsterAnim_AirPunchUp.0141.png"]
         , [0, 1, 2, 3, 4]
    ));
    renderComp.addAnim(new ms.Anim(
     "Fall"
       , ["MonsterAnim_Fall.0120.png"
            , "MonsterAnim_Fall.0121.png"
            , "MonsterAnim_Fall.0122.png"
            , "MonsterAnim_Fall.0123.png"]
        , [0, 0, 1, 1, 2, 2, 3, 3, 3, 2, 2, 1, 1, 0]
    ));
    renderComp.addAnim(new ms.Anim(
     "Jump"
       , ["MonsterAnim_Jump.0108.png"
            , "MonsterAnim_Jump.0109.png"
            , "MonsterAnim_Jump.0110.png"
            , "MonsterAnim_Jump.0111.png"
            , "MonsterAnim_Jump.0112.png"
            , "MonsterAnim_Jump.0113.png"
            , "MonsterAnim_Jump.0114.png"]
        , [0, 1, 2, 3, 4, 4, 5, 5, 6, 6]
    ));
    renderComp.addAnim(new ms.Anim(
    "Punch"
    , ["MonsterAnim_Punch.0078.png"
        , "MonsterAnim_Punch.0079.png"
        , "MonsterAnim_Punch.0080.png"
        , "MonsterAnim_Punch.0081.png"
        , "MonsterAnim_Punch.0082.png"
        , "MonsterAnim_Punch.0083.png"
        , "MonsterAnim_Punch.0084.png"
        , "MonsterAnim_Punch.0085.png"
        , "MonsterAnim_Punch.0086.png"]
    , [0, 1, 2, 3, 4, 5, 6, 7, 8]
   ));
    renderComp.addAnim(new ms.Anim(
        "PunchUp"
        , ["MonsterAnim_PunchUp.0093.png"
         , "MonsterAnim_PunchUp.0094.png"
         , "MonsterAnim_PunchUp.0095.png"
         , "MonsterAnim_PunchUp.0096.png"
         , "MonsterAnim_PunchUp.0097.png"
         , "MonsterAnim_PunchUp.0098.png"
         , "MonsterAnim_PunchUp.0099.png"
         , "MonsterAnim_PunchUp.0100.png"
         , "MonsterAnim_PunchUp.0101.png"]
        , [0, 1, 2, 3, 4, 5, 6, 7, 8]
    ));
    renderComp.addAnim(new ms.Anim(
        "WallIdle"
        , ["MonsterAnim_WallIdle.0148.png"
         , "MonsterAnim_WallIdle.0149.png"
         , "MonsterAnim_WallIdle.0150.png"
         , "MonsterAnim_WallIdle.0151.png"
         , "MonsterAnim_WallIdle.0152.png"]
        , [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1]
    ));
    renderComp.addAnim(new ms.Anim(
        "WallPunch"
        , ["MonsterAnim_WallPunch.0157.png"
         , "MonsterAnim_WallPunch.0158.png"
         , "MonsterAnim_WallPunch.0159.png"
         , "MonsterAnim_WallPunch.0160.png"]
        , [0, 1, 2, 3]
    ));
    renderComp.addAnim(new ms.Anim(
        "WallPunchBack"
        , ["MonsterAnim_WallPunchBack.0199.png"
         , "MonsterAnim_WallPunchBack.0200.png"
         , "MonsterAnim_WallPunchBack.0201.png"
         , "MonsterAnim_WallPunchBack.0202.png"
         , "MonsterAnim_WallPunchBack.0203.png"
         , "MonsterAnim_WallPunchBack.0204.png"]
        , [0, 1, 2, 3, 4, 5]
    ));
    renderComp.addAnim(new ms.Anim(
     "WallPunchUp"
     , ["MonsterAnim_WallPunchUp.0169.png"
        , "MonsterAnim_WallPunchUp.0170.png"
        , "MonsterAnim_WallPunchUp.0171.png"
        , "MonsterAnim_WallPunchUp.0172.png"]
     , [0, 1, 2, 3]
    ));
    renderComp.addAnim(new ms.Anim(
     "WallWalk"
     , ["MonsterAnim_WallWalk.0180.png"
        , "MonsterAnim_WallWalk.0181.png"
        , "MonsterAnim_WallWalk.0182.png"
        , "MonsterAnim_WallWalk.0183.png"
        , "MonsterAnim_WallWalk.0184.png"
        , "MonsterAnim_WallWalk.0185.png"
        , "MonsterAnim_WallWalk.0186.png"
        , "MonsterAnim_WallWalk.0187.png"
        , "MonsterAnim_WallWalk.0188.png"
        , "MonsterAnim_WallWalk.0189.png"
        , "MonsterAnim_WallWalk.0190.png"
        , "MonsterAnim_WallWalk.0191.png"]
     , [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    ));
    renderComp.addAnim(new ms.Anim(
    "VertIdle"
    , ["MonsterAnimVert_Idle.0132.png"
        , "MonsterAnimVert_Idle.0133.png"
        , "MonsterAnimVert_Idle.0134.png"
        , "MonsterAnimVert_Idle.0135.png"
        , "MonsterAnimVert_Idle.0136.png"]
     , [0, 1, 2, 3, 4, 4, 3, 2, 1, 0]
    ));

    var FSM = ms.FSMComponent.call(this);
    FSM.addState("Idle",
        {
            before: function () {
                renderComp.changeAnim("Idle");
                vel.x = 0;
            }
            , state: function (dt) {
                if (isTouchingBuilding
                    && getHeld(ACTION.ATTACK)
                    && (getHeld(ACTION.UP) || getHeld(ACTION.DOWN))) {
                    position.y -= 10;
                    FSM.changeState("VertIdle");
                }
                if (getPressed(ACTION.JUMP)) {
                    FSM.changeState("Jump");
                }
                if (getHeld(ACTION.RIGHT)) {
                    vel.x = walkSpeed;
                    FSM.changeState("Walk");
                } else if (getHeld(ACTION.LEFT)) {
                    vel.x = -walkSpeed;
                    FSM.changeState("Walk");
                }
                if (getPressed(ACTION.ATTACK)) {
                    FSM.changeState("Attack");
                }
                if (getHeld(ACTION.UP)) {
                    if (isTouchingBuilding) {
                        position.y -= 10;
                        FSM.changeState("VertIdle");
                    } else if (isTouchingEdge) {
                        position.y -= 10;
                        FSM.changeState("WallIdle");
                    }
                }
                fall();
            }
            , after: function () {
                if (vel.x < 0) {
                    flip = true;
                } else if (vel.x > 0) {
                    flip = false;
                }
            }
        });
    FSM.addState("RoofIdle",
        {
            before: function () {
                renderComp.changeAnim("Idle");
                vel = { x: 0, y: 0 };
                if (isTouchingRoof) {
                    position.y = isTouchingRoof.roofPosition - frameSize.height;
                }
            }
            , state: function (dt) {
                if (getHeld(ACTION.DOWN)) {
                    position.y += 20;
                    FSM.changeState("VertIdle");
                }
                if (getPressed(ACTION.JUMP)) {
                    FSM.changeState("Jump");
                }
                if (getHeld(ACTION.RIGHT)) {
                    vel.x = walkSpeed;
                    FSM.changeState("RoofWalk");
                } else if (getHeld(ACTION.LEFT)) {
                    vel.x = -walkSpeed;
                    FSM.changeState("RoofWalk");
                }
                if (!isTouchingRoof) {
                    FSM.changeState("Fall");
                }
                if (getPressed(ACTION.ATTACK)) {
                    FSM.changeState("RoofAttack");
                }
            }
            , after: function () {
                if (vel.x < 0) {
                    flip = true;
                } else if (vel.x > 0) {
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
                if (isTouchingBuilding && (getHeld(ACTION.UP) || getHeld(ACTION.DOWN))) {
                    position.y -= 10;
                    FSM.changeState("VertIdle");
                }
                if (getPressed(ACTION.JUMP)) {
                    FSM.changeState("Jump");
                }
                if (getHeld(ACTION.RIGHT)) {
                    vel.x = walkSpeed;
                } else if (getHeld(ACTION.LEFT)) {
                    vel.x = -walkSpeed;
                } else {
                    FSM.changeState("Idle");
                }
                if (getPressed(ACTION.ATTACK)) {
                    FSM.changeState("Attack");
                }
                if (getHeld(ACTION.UP)) {
                    if (isTouchingBuilding) {
                        position.y -= 10;
                        FSM.changeState("VertIdle");
                    } else if (isTouchingEdge) {
                        position.y -= 10;
                        FSM.changeState("WallIdle");
                    }
                }
                if (vel.x > 0) {
                    flip = false;
                } else if (vel.x < 0) {
                    flip = true;
                }
                fall();
            }
            , after: function () {

            }
        });
    FSM.addState("RoofWalk",
        {
            before: function () {
                renderComp.changeAnim("Walk");
            }
            , state: function (dt) {
                if (getPressed(ACTION.JUMP)) {
                    FSM.changeState("Jump");
                }
                if (getHeld(ACTION.RIGHT)) {
                    vel.x = walkSpeed;
                } else if (getHeld(ACTION.LEFT)) {
                    vel.x = -walkSpeed;
                } else {
                    FSM.changeState("RoofIdle");
                }
                if (vel.x > 0) {
                    flip = false;
                } else if (vel.x < 0) {
                    flip = true;
                }
                if (!isTouchingRoof) {
                    FSM.changeState("Fall");
                }
                if (getPressed(ACTION.ATTACK)) {
                    FSM.changeState("RoofAttack");
                }
            }
            , after: function () {

            }
        });
    FSM.addState("Jump",
        {
            before: function () {
                jumpTimer = jumpTime;
                renderComp.changeAnim("Jump", function () {
                    FSM.changeState("Fall");
                });
                isStanding = false;
                vel.y = 0;
            }
            , state: function (dt) {
                if (isTouchingBuilding && (getHeld(ACTION.UP) || getHeld(ACTION.DOWN))) {
                    position.y -= 10;
                    FSM.changeState("VertIdle");
                }
                jumpTimer -= dt;
                if (jumpTimer < 0) {
                    if (flip) {
                        vel = { x: -5, y: -10 };
                    } else {
                        vel = { x: 5, y: -10 };
                    }
                }
                if (getHeld(ACTION.ATTACK)) {
                    FSM.changeState("JumpAttack");
                }
            }
            , after: function () {
                jumpTimer = null;
            }
        });
    FSM.addState("Fall",
        {
            before: function () {
                renderComp.changeAnim("Fall");
            }
            , state: function (dt) {
                if (isTouchingBuilding && (getHeld(ACTION.UP) || getHeld(ACTION.DOWN))) {
                    position.y -= 10;
                    FSM.changeState("VertIdle");
                } else if (isTouchingEdge && (getHeld(ACTION.UP) || getHeld(ACTION.DOWN))) {
                    position.y -= 10;
                    FSM.changeState("WallIdle");
                }
                if (isStanding) {
                    FSM.changeState("Idle");
                }
                if (getHeld(ACTION.ATTACK)) {
                    FSM.changeState("JumpAttack");
                }
                fall();
            }
            , after: function () {

            }
        });
    FSM.addState("VertIdle",
        {
            before: function () {
                isStanding = false;
                vel = { x: 0, y: 0 };
                renderComp.changeAnim("VertIdle");
            }
            , state: function (dt) {
                if (getHeld(ACTION.LEFT)
                    || (getHeld(ACTION.RIGHT))
                    || (getHeld(ACTION.UP))
                    || (getHeld(ACTION.DOWN))) {
                    FSM.changeState("VertClimb");
                }
                if (getPressed(ACTION.ATTACK)) {
                    FSM.changeState("VertAttack");
                }
                if (isStanding) {
                    FSM.changeState("Idle");
                }
                if (!isTouchingBuilding) {
                    FSM.changeState("Fall");
                }
                if (getPressed(ACTION.JUMP)) {
                    FSM.changeState("Jump");
                }
            }
            , after: function () {

            }
        });
    FSM.addState("VertClimb",
        {
            before: function () {
                isStanding = false;
                lastClimbDirection = null;
            }
            , state: function (dt) {
                if (getPressed(ACTION.JUMP)) {
                    FSM.changeState("Jump");
                }
                if (getPressed(ACTION.ATTACK)) {
                    FSM.changeState("VertAttack");
                }
                if (getHeld(ACTION.LEFT)) {
                    vel = { x: -climbSpeed, y: 0 };
                    if (lastClimbDirection !== ACTION.LEFT) {
                        renderComp.changeAnim("VertClimbSideways");
                    }
                    lastClimbDirection = ACTION.LEFT;
                    flip = true;
                } else if (getHeld(ACTION.RIGHT)) {
                    vel = { x: climbSpeed, y: 0 };
                    if (lastClimbDirection !== ACTION.RIGHT) {
                        renderComp.changeAnim("VertClimbSideways");
                    }
                    lastClimbDirection = ACTION.RIGHT;
                    flip = false;
                } else if (getHeld(ACTION.UP)) {
                    vel = { x: 0, y: -climbSpeed };
                    if (lastClimbDirection !== ACTION.UP) {
                        renderComp.changeAnim("VertClimb");
                    }
                    lastClimbDirection = ACTION.UP;
                } else if (getHeld(ACTION.DOWN)) {
                    vel = { x: 0, y: climbSpeed };
                    if (lastClimbDirection !== ACTION.DOWN) {
                        renderComp.changeAnim("VertClimb");
                    }
                    lastClimbDirection = ACTION.DOWN;
                    flip = true;
                } else {
                    FSM.changeState("VertIdle");
                }
                if (isStanding) {
                    FSM.changeState("Idle");
                }
                if (!isTouchingBuilding) {
                    if (isTouchingRoof) {
                        FSM.changeState("RoofIdle");
                    } else if (isTouchingEdge) {
                        FSM.changeState("WallWalk");
                    } else {
                        FSM.changeState("Fall");
                    }
                }
                checkGround();
            }
            , after: function () {

            }
        });
    FSM.addState("WallIdle",
       {
           before: function () {
               isStanding = false;
               vel = { x: 0, y: 0 };
               renderComp.changeAnim("WallIdle");
           }
           , state: function (dt) {
               if ((getHeld(ACTION.UP))
                   || (getHeld(ACTION.DOWN))) {
                   FSM.changeState("WallWalk");
               }
               if (getPressed(ACTION.ATTACK)) {
                   FSM.changeState("WallAttack");
               }
               if (getPressed(ACTION.JUMP)) {
                   FSM.changeState("Jump");
               }
               if (isStanding) {
                   FSM.changeState("Idle");
               } else if (isTouchingBuilding) {
                   FSM.changeState("VertIdle");
               } else if  (isTouchingEdge) {
                   if (isTouchingEdge.type === "rightEdge") {
                       flip = true;
                       position.x = isTouchingEdge.wallPosition - bbOffset.x;

                       if (getPressed(ACTION.LEFT)) {
                           position.x -= 20;
                           FSM.changeState("VertIdle");
                       }
                   } else {
                       flip = false;
                       position.x = isTouchingEdge.wallPosition - frameSize.width + bbOffset.x;

                       if (getPressed(ACTION.RIGHT)) {
                           position.x += 20;
                           FSM.changeState("VertIdle");
                       }
                   }
               } else {
                   FSM.changeState("Fall");
               }
           }
           , after: function () {

           }
       });
    FSM.addState("WallWalk",
       {
           before: function () {
               isStanding = false;
               renderComp.changeAnim("WallWalk");
           }
           , state: function (dt) {
               if (getHeld(ACTION.UP)) {
                   vel.y = -climbSpeed;
               } else if (getHeld(ACTION.DOWN)) {
                   vel.y = climbSpeed;
               } else {
                   FSM.changeState("WallIdle");
               }
               if (getPressed(ACTION.ATTACK)) {
                   FSM.changeState("WallAttack");
               }
               if (getPressed(ACTION.JUMP)) {
                   FSM.changeState("Jump");
               }
               if (isStanding) {
                   FSM.changeState("Idle");
               } else if (isTouchingEdge) {
                   if (isTouchingEdge.type === "rightEdge") {
                       flip = true;
                       position.x = isTouchingEdge.wallPosition - bbOffset.x;
                   } else {
                       flip = false;
                       position.x = isTouchingEdge.wallPosition - frameSize.width + bbOffset.x;
                   }
               } else {
                   FSM.changeState("Fall");
               }
               checkGround();
           }
           , after: function () {

           }
       });
    FSM.addState("Attack",
        {
            before: function () {
                attackHit = null;
                attackCollider.active = true;
                if (getHeld(ACTION.UP)) {
                    attackCollider.offset(Math.floor((frameSize.width - attackColliderSize.width) * 0.5), -attackColliderSize.height + bbOffset.y);
                    renderComp.changeAnim("PunchUp", standingAttackComplete);
                } else {
                    if (flip) {
                        attackCollider.offset(bbOffset.x - attackColliderSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                    } else {
                        attackCollider.offset(bbOffset.x + bbSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                    }

                    renderComp.changeAnim("Punch", standingAttackComplete);
                }
                vel = { x: 0, y: 0 };
            }
            , state: function (dt) {
                if (attackCollider.active) {
                    if (attackHit && attackHit.parentObject.type === "Policeman") {
                        renderComp.changeAnim("Eat", standingAttackComplete);
                    }
                }
                attackCollider.active = false;
            }
            , after: function () {

            }
        });
    FSM.addState("JumpAttack",
        {
            before: function () {
                attackHit = null;
                attackCollider.active = true;
                if (getHeld(ACTION.UP)) {
                    attackCollider.offset(Math.floor((frameSize.width - attackColliderSize.width) * 0.5), -attackColliderSize.height + bbOffset.y);
                    renderComp.changeAnim("AirPunchUp", standingAttackComplete);
                } else {
                    if (flip) {
                        attackCollider.offset(bbOffset.x - attackColliderSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                    } else {
                        attackCollider.offset(bbOffset.x + bbSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                    }

                    renderComp.changeAnim("AirPunch", standingAttackComplete);
                }
                vel = { x: 0, y: 0 };
            }
            , state: function (dt) {
                attackCollider.active = false;
                fall();
            }
            , after: function () {

            }
        });
    FSM.addState("VertAttack",
       {
           before: function () {
               attackHit = null;
               attackCollider.active = true;
               if (getHeld(ACTION.UP)) {
                   attackCollider.offset(Math.floor((frameSize.width - attackColliderSize.width) * 0.5), -attackColliderSize.height + bbOffset.y);
                   renderComp.changeAnim("VertAttackUp", vertAttackComplete);
               } else if (getHeld(ACTION.RIGHT)) {
                   attackCollider.offset(bbOffset.x + bbSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                   renderComp.changeAnim("VertAttackSideways", vertAttackComplete);
               } else if (getHeld(ACTION.LEFT)) {
                   attackCollider.offset(bbOffset.x - attackColliderSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                   renderComp.changeAnim("VertAttackSideways", vertAttackComplete);
               } else {
                   attackCollider.offset(bbOffset.x + Math.floor((bbSize.width - attackColliderSize.width) * 0.5), bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                   renderComp.changeAnim("VertAttack", vertAttackComplete);
               }
               vel = { x: 0, y: 0 };
           }
           , state: function (dt) {
               attackCollider.active = false;
           }
           , after: function () {

           }
       });
    FSM.addState("WallAttack",
       {
           before: function () {
               attackHit = null;
               attackCollider.active = true;
               if (isTouchingEdge.type === "leftEdge") {
                   if (getHeld(ACTION.UP)) {
                       attackCollider.offset(Math.floor((frameSize.width - attackColliderSize.width) * 0.5), -attackColliderSize.height + bbOffset.y);
                       renderComp.changeAnim("WallPunchUp", wallAttackComplete);
                   } else if (getHeld(ACTION.LEFT)) {
                       attackCollider.offset(bbOffset.x - attackColliderSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                       renderComp.changeAnim("WallPunchBack", wallAttackComplete);
                   } else {
                       attackCollider.offset(bbOffset.x + bbSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                       renderComp.changeAnim("WallPunch", wallAttackComplete);
                   }
               } else {
                   if (getHeld(ACTION.UP)) {
                       attackCollider.offset(Math.floor((frameSize.width - attackColliderSize.width) * 0.5), -attackColliderSize.height + bbOffset.y);
                       renderComp.changeAnim("WallPunchUp", wallAttackComplete);
                   } else if (getHeld(ACTION.RIGHT)) {
                       attackCollider.offset(bbOffset.x + bbSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                       renderComp.changeAnim("WallPunchBack", wallAttackComplete);
                   } else {
                       attackCollider.offset(bbOffset.x - attackColliderSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                       renderComp.changeAnim("WallPunch", wallAttackComplete);
                   }
               }
               vel = { x: 0, y: 0 };
           }
           , state: function (dt) {
               attackCollider.active = false;
           }
           , after: function () {

           }
       });
    FSM.addState("RoofAttack",
        {
            before: function () {
                attackHit = null;
                attackCollider.active = true;
                if (getHeld(ACTION.UP)) {
                    attackCollider.offset(Math.floor((frameSize.width - attackColliderSize.width) * 0.5), -attackColliderSize.height + bbOffset.y);
                    renderComp.changeAnim("PunchUp", roofAttackComplete);
                } else {
                    if (flip) {
                        attackCollider.offset(bbOffset.x - attackColliderSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                    } else {
                        attackCollider.offset(bbOffset.x + bbSize.width, bbOffset.y + Math.floor((bbSize.height - attackColliderSize.height) * 0.5));
                    }

                    renderComp.changeAnim("Punch", roofAttackComplete);
                }
            }
            , state: function (dt) {
                if (attackCollider.active) {
                    if (attackHit && attackHit.parentObject.type === "Policeman") {
                        renderComp.changeAnim("Eat", roofAttackComplete);
                    }
                }
                attackCollider.active = false;
            }
            , after: function () {

            }
        });
    FSM.addState("Eat",
        {
            before: function () {
                renderComp.changeAnim("Eat", function () { FSM.changeState("Idle"); });
                ms.sound.play("eat");
            }
            , state: function (dt) {
               
            }
            , after: function () {

            }
        });
    FSM.changeState("Idle");

    function update(dt) {
        FSM.update(dt);
        position.x += vel.x * dt * 0.05;
        position.y += vel.y * dt * 0.05;
        checkLevelBounds();
        renderComp.animate(dt);
        //FSM.debug("Monster");
    }

    function render() {
        renderComp.displayAnim(position.x, position.y, flip);
        //debugDraw();
    }

    function debugDraw() {
        var cameraOffset = ms.screens.gameScreen.getCameraOffset();
        ctx.save();
        ctx.strokeStyle = "rgb(255,255,0)";
        ctx.strokeRect(position.x - cameraOffset.x, position.y - cameraOffset.y, frameSize.width, frameSize.height);
        ctx.fillStyle = "rgba(0, 255, 255, 0.4)";
        ctx.fillRect(position.x + bbOffset.x - cameraOffset.x, position.y + bbOffset.y - cameraOffset.y, bbSize.width, bbSize.height);
        ctx.restore();
    }

    function fall() {
        if (isStanding) {
            vel.y = 0;
        } else {
            vel.y += gravity;
            checkGround();
        }
    }

    function checkGround() {
        if (position.y + frameSize.height > groundLevel) {
            vel.y = 0;
            isStanding = true;
            position.y = groundLevel - frameSize.height;
        }
    }

    function checkLevelBounds() {
        position.x = Math.max(position.x, -bbOffset.x);
        position.x = Math.min(position.x, levelSize.width - frameSize.width + bbOffset.x);
    }

    function initAttackCollider() {
        attackCollider = new ms.Collider(0, 0, attackColliderSize.width, attackColliderSize.height, { type: "MonsterAttack", obj: this });
        attackCollider.active = false;
        attackCollider.offset = function (x, y) {
            this.x = position.x + x;
            this.y = position.y + y;
        };
    }

    function getCollider() {
        return new ms.Collider(
            position.x + bbOffset.x
            , position.y + bbOffset.y
            , bbSize.width
            , bbSize.height
            , { type: "monster", obj: this });
    }

    function getAttackCollider() {
        return attackCollider;
    }

    function isAttacking() {
        return attackCollider.active;
    }

    function collideBuildings(hits) {
        isTouchingBuilding = isTouchingEdge = isTouchingRoof = false;
        if (hits.length === 0) {
            return;
        }
        var bbTop = position.y + bbOffset.y
            , bbBot = position.y + frameSize.height
            , bbLeft = position.x + bbOffset.x
            , bbRight = position.x + bbOffset.x + bbSize.width
            , hitIndex = -1
            , hitsLen = hits.length
        ;
        while (++hitIndex < hitsLen) {
            var hit = hits[hitIndex];
            if (hit.x > bbRight) {
                continue;
            }
            if (hit.x + hit.width < bbLeft) {
                continue;
            }
            if (hit.y > bbBot) {
                continue;
            }
            if (hit.y + hit.height < bbTop) {
                continue;
            }
            if (hit.parentObj.type === "building") {
                isTouchingBuilding = true;
            } else if (hit.parentObj.type === "leftEdge" || hit.parentObj.type === "rightEdge") {
                isTouchingEdge = hit.parentObj;
            } else if (hit.parentObj.type === "roof") {
                isTouchingRoof = hit.parentObj;
            }
        }
    }

    function collideEntities(hits) {
        if (hits.length === 0) {
            return;
        }
        var bbTop = position.y + bbOffset.y
            , bbBot = position.y + frameSize.height
            , bbLeft = position.x + bbOffset.x
            , bbRight = position.x + bbOffset.x + bbSize.width
            , hitIndex = -1
            , hitsLen = hits.length
            , buildingHit
        ;
        while (++hitIndex < hitsLen) {
            var hit = hits[hitIndex];
            if (hit.parentObj.type === "monster"
                || hit.parentObj.type === "projectile"
                || hit.parentObj.type === "policeCar") {
                // Ignore these types
                continue;
            }
            if (hit.x > bbRight) {
                continue;
            }
            if (hit.x + hit.width < bbLeft) {
                continue;
            }
            if (hit.y > bbBot) {
                continue;
            }
            if (hit.y + hit.height < bbTop) {
                continue;
            }
            // Hit
            if (hit.parentObj.type === "meteor") {
                FSM.changeState("Eat");
                hit.parentObj.obj.kill = true;
                ms.screens.gameScreen.markEntitiesDirty();
                ms.gameManager.addPower(200);
                ms.gameManager.addScore(500);
                continue;
            }
            if (hit.parentObj.type === "bullet") {
                hit.parentObj.obj.destroy();
                continue;
            }
        }
    }

        function attackEntities(hits) {
            if (hits.length === 0) {
                return;
            }
            var bbTop = attackCollider.y
                , bbBot = attackCollider.y + attackCollider.height
                , bbLeft = attackCollider.x
                , bbRight = attackCollider.x + attackCollider.width
                , hitIndex = -1
                , hitsLen = hits.length
                , buildingHit
            ;
            while (++hitIndex < hitsLen) {
                var hit = hits[hitIndex];
                if (hit.parentObj.type === "monster"
                    || hit.parentObj.type === "projectile") {
                    // Ignore these types
                    continue;
                }
                if (hit.x > bbRight) {
                    continue;
                }
                if (hit.x + hit.width < bbLeft) {
                    continue;
                }
                if (hit.y > bbBot) {
                    continue;
                }
                if (hit.y + hit.height < bbTop) {
                    continue;
                }
                // Hit
                if (hit.parentObj.type === "building") {
                    if (!hit.parentObj.obj.isTileDestroyed(hit.parentObj.tile.row, hit.parentObj.tile.col)) {
                        buildingHit = hit.parentObj;
                    }
                    continue;
                }
                if (hit.parentObj.type === "policeCar") {
                    hit.parentObj.obj.destroy();
                    buildingHit = null; //can only hit building if there are no enemies
                    break;
                }
                if (hit.parentObj.type === "policeman") {
                    FSM.changeState("Eat");
                    hit.parentObj.obj.destroy();
                    buildingHit = null; //can only hit building if there are no enemies
                    break;
                }
            }
            if (buildingHit) {
                ms.sound.play("punch");
                buildingHit.obj.damage(buildingHit.tile);
            }
        }

        function standingAttackComplete() {
            FSM.changeState("Fall");
        }

        function roofAttackComplete() {
            FSM.changeState("RoofIdle");
        }

        function wallAttackComplete() {
            FSM.changeState("WallIdle");
        }

        function vertAttackComplete() {
            FSM.changeState("VertIdle");
        }

        function getFrameSize() {
            return frameSize;
        }

        function getPosition() {
            return position;
        }

        function getCenter() {
            return {
                x: position.x + Math.floor(frameSize.width * 0.5)
                , y: position.y + Math.floor(frameSize.height * 0.5)
            };
        }

        return {
            update: update
            , render: render
            , isLoaded: this.isLoaded
            , getCollider: getCollider
            , getFrameSize: getFrameSize
            , getPosition: getPosition
            , getCenter: getCenter
            , collideBuildings: collideBuildings
            , collideEntities: collideEntities
            , getAttackCollider: getAttackCollider
            , isAttacking: isAttacking
            , attackEntities: attackEntities
        };
    };