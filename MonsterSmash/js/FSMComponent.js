/* Used to add a finite state machine to a game object
 * 
 * someGameObject = function () {
 *          var fsm = ms.FSMComponent.call(this);
 *          fsm.addState("jump", {  before: function () { // init state}
 *                                  , state: function () { // execute state}
 *                                  , after: function () { // clean up state}
 *                              });
 *  }
 */

ms.FSMComponent = function () {
    var states = {}
        , currentState
        , newState
    ;

    function addState(name, newState) {
        states[name] = newState;
    }

    function changeState(changeStateTo) {
        newState = changeStateTo;
    }

    function update(dt) {
        if (!!currentState) {
            states[currentState].state(dt);
            if (currentState !== newState) {
                if (states[currentState].after) {
                    states[currentState].after();
                }
                if (states[newState].before) {
                    states[newState].before();
                }
                currentState = newState;
            }
        } else {
            currentState = newState;
            if (states[currentState].before) {
                states[currentState].before();
            }
            states[currentState].state(dt);
        }
        
    }

    function debug(debugString) {
        console.log(debugString + ":" + currentState);
    }

    return {
        addState: addState
        , changeState: changeState
        , update: update
        , debug: debug
    };
};