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
        bindKey(KEY.CTRL, ACTION.ATTACK);
        bindKey(KEY.ALT, ACTION.JUMP);
        bindKey(KEY.UP_ARROW, ACTION.UP);
        bindKey(KEY.LEFT_ARROW, ACTION.LEFT);
        bindKey(KEY.DOWN_ARROW, ACTION.DOWN);
        bindKey(KEY.RIGHT_ARROW, ACTION.RIGHT);
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

    return {
        getHeld: getHeld
        , getPressed: getPressed
        , init: init
        , KEY: KEY
        , ACTION: ACTION
    };
})();