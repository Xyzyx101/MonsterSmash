ms.input = (function () {
    "use strict";
    var KEY = {
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        CTRL: 17,
        ALT: 18,
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        N: 78,
        M: 77,
        COMMA: 188,
        PERIOD: 190,
        OPEN_BRACKET: 219,
        CLOSE_BRACKET: 221
    };

    var ACTION = {
        UP: 0
        , LEFT: 1
        , RIGHT: 2
        , DOWN: 3
        , ATTACK: 4
        , JUMP: 5
    };

    var keyPress = {};
    var keyHeld = {};
    var bindings = {};
    var pressable = {};

    function init() {
        bindKey(KEY.W, ACTION.UP);
        bindKey(KEY.A, ACTION.LEFT);
        bindKey(KEY.S, ACTION.DOWN);
        bindKey(KEY.D, ACTION.RIGHT);
        bindKey(KEY.PERIOD, ACTION.ATTACK);
        bindKey(KEY.COMMA, ACTION.JUMP);
        bindKey(KEY.UP_ARROW, ACTION.UP);
        bindKey(KEY.LEFT_ARROW, ACTION.LEFT);
        bindKey(KEY.DOWN_ARROW, ACTION.DOWN);
        bindKey(KEY.RIGHT_ARROW, ACTION.RIGHT);

        if (ms.isTouchEnabled()) {
            bindTouchControls();
        }
    }

    function getPressed(action) {
        if (keyPress[action]) {
            keyPress[action] = false;
            return true;
        }
        return false;
    }

    function getHeld(action) {
        if (keyHeld[action]) {
            return true;
        }
        return false;
    }

    function bindKey(key, action) {
        bindings[key] = action;
        pressable[action] = true;
    }

    function keyDown(event) {
        var action = bindings[event.keyCode];
        if (action || action === 0) {
            if (pressable[action]) {
                keyPress[action] = true;
                keyHeld[action] = true;
                pressable[action] = false;
            }
        }
        event.stopPropagation();
        event.preventDefault();
    }

    function keyUp(event) {
        var action = bindings[event.keyCode];
        if (action || action === 0) {
            keyPress[action] = false;
            keyHeld[action] = false;
            pressable[action] = true;
        }
        event.stopPropagation();
        event.preventDefault();
    }

    window.addEventListener('keydown', keyDown.bind(this), false);
    window.addEventListener('keyup', keyUp.bind(this), false);

    /* Touchscreen */
    var attackButton
        , jumpButton
        , dPad
    ;

    function bindTouchControls() {
        ms.dom.bind("#gameScreen  #touchControls #attackButton", "touchstart", attackStart);
        ms.dom.bind("#gameScreen  #touchControls #attackButton", "touchend", attackEnd);
        ms.dom.bind("#gameScreen  #touchControls #jumpButton", "touchstart", jumpStart);
        ms.dom.bind("#gameScreen  #touchControls #jumpButton", "touchend", jumpEnd);
        ms.dom.bind("#gameScreen  #touchControls #dPad", "touchmove", updateDPad);
        ms.dom.bind("#gameScreen  #touchControls #dPad", "touchend", clearDPad);
        attackButton = ms.dom.$("#gameScreen  #touchControls #attackButton")[0];
        jumpButton = ms.dom.$("#gameScreen  #touchControls #jumpButton")[0];
        dPad = ms.dom.$("#gameScreen  #touchControls #dPad")[0];
    }

    function attackStart() {
        if (pressable[ACTION.ATTACK]) {
            keyPress[ACTION.ATTACK] = true;
            keyHeld[ACTION.ATTACK] = true;
            pressable[ACTION.ATTACK] = false;
        }
        attackButton.style.backgroundPosition = "150px 0px";
    }

    function attackEnd() {
        keyPress[ACTION.ATTACK] = false;
        keyHeld[ACTION.ATTACK] = false;
        pressable[ACTION.ATTACK] = true;
        attackButton.style.backgroundPosition = "0px 0px";
    }

    function jumpStart() {
        if (pressable[ACTION.JUMP]) {
            keyPress[ACTION.JUMP] = true;
            keyHeld[ACTION.JUMP] = true;
            pressable[ACTION.JUMP] = false;
        }
        jumpButton.style.backgroundPosition = "150px 0px";
    }

    function jumpEnd() {
        keyPress[ACTION.JUMP] = false;
        keyHeld[ACTION.JUMP] = false;
        pressable[ACTION.JUMP] = true;
        jumpButton.style.backgroundPosition = "0px 0px";
    }

    var dPadCenterPoint = null;
    function updateDPad(e) {
        if (!dPadCenterPoint) {
            var dPadRect = ms.dom.$("#gameScreen  #touchControls #dPad")[0].getBoundingClientRect();
            dPadCenterPoint = {};
            dPadCenterPoint.x = Math.floor(dPadRect.left + dPadRect.width * 0.5);
            dPadCenterPoint.y = Math.floor(dPadRect.top + dPadRect.height * 0.5);
        }
        var xComp = e.touches[0].clientX - dPadCenterPoint.x;
        var yComp = e.touches[0].clientY - dPadCenterPoint.y;
        //console.log("x:" + xComp + " y:" + yComp);
        //console.log(Math.atan2(yComp, xComp));
        clearDPad();
        var dir = Math.atan2(yComp, xComp);
        if (dir > -0.7 && dir < 0.7) {
            console.log("right");
            keyPress[ACTION.RIGHT] = true;
            keyHeld[ACTION.RIGHT] = true;
            pressable[ACTION.RIGHT] = false;
            dPad.style.backgroundPosition = "-600px 0px";
        } else if (dir < -0.7 && dir > -2.12) {
            console.log("up");
            keyPress[ACTION.UP] = true;
            keyHeld[ACTION.UP] = true;
            pressable[ACTION.UP] = false;
            dPad.style.backgroundPosition = "-150px 0px";
        } else if (dir < -2.12 || dir > 2.12) {
            console.log("left");
            keyPress[ACTION.LEFT] = true;
            keyHeld[ACTION.LEFT] = true;
            pressable[ACTION.LEFT] = false;
            dPad.style.backgroundPosition = "-450px 0px";
        } else if (dir < 2.12 && dir > 0.7) {
            console.log("down");
            keyPress[ACTION.DOWN] = true;
            keyHeld[ACTION.DOWN] = true;
            pressable[ACTION.DOWN] = false;
            dPad.style.backgroundPosition = "-300px 0px";
        }
    }

    function clearDPad() {
        var directions = [ACTION.UP, ACTION.DOWN, ACTION.LEFT, ACTION.RIGHT];
        for (var dir = 0; dir < 4; ++dir) {
            keyPress[directions[dir]] = false;
            keyHeld[directions[dir]] = false;
            pressable[directions[dir]] = true;
            dPad.style.backgroundPosition = "0px 0px";
        }
    }

    return {
        getHeld: getHeld
        , getPressed: getPressed
        , init: init
        , KEY: KEY
        , ACTION: ACTION
    };
})();