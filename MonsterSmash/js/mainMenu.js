ms.screens.mainMenu = (function () {
    "use strict";
    var initialized = false;
    
    function run() {
        if (!initialized) {
            ms.dom.bind("#mainMenu ul.menu", "click", function (e) {
                if (e.target.nodeName.toLowerCase() === "button") {
                    var action = e.target.getAttribute("menuAction");
                    menuAction(action);
                }
            });
            // disable touchmove to prevent overscroll
            ms.dom.bind(document, "touchmove", function (event) {
                event.preventDefault();
            });
        }
        initialized = true;
        ms.sound.playMusic("RunAmok");
    }

    function menuAction(action) {
        switch (action) {
            case "gameScreen":
                ms.gameManager.startNewGame();
                ms.showScreen("gameScreen");
                break;
            case "highScoreScreen":
                ms.showScreen("highScoreScreen");
                break;
            case "optionsScreen":
                ms.showScreen("optionsScreen");
                break;
            case "aboutScreen":
                ms.showScreen("aboutScreen");
                break;
            case "levelComplete":
               // ms.showScreen("levelCompleteScreen");
                break;
        }
    }

    return {
        run: run
    };
})();