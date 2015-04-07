ms.screens.mainMenu = (function () {
    "use strict";

    function run() {
        ms.dom.bind("#mainMenu ul.menu", "click", function (e) {
            if (e.target.nodeName.toLowerCase() === "button") {
                var action = e.target.getAttribute("menuAction");
                menuAction(action);
            }
        });

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
        }
    }

    return {
        run: run
    };
})();