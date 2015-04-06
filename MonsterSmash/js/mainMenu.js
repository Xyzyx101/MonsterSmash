monsterSmash.screens.mainMenu = (function () {
    "use strict";

    function run() {
        monsterSmash.dom.bind("#mainMenu ul.menu", "click", function (e) {
            if (e.target.nodeName.toLowerCase() === "button") {
                var action = e.target.getAttribute("menuAction");
                menuAction(action);
            }
        });

    }

    function menuAction(action) {
        switch (action) {
            case "gameScreen":
                monsterSmash.gameManager.startNewGame();
                monsterSmash.showScreen("gameScreen");
                break;
            case "highScoreScreen":
                monsterSmash.showScreen("highScoreScreen");
                break;
            case "optionsScreen":
                monsterSmash.showScreen("optionsScreen");
                break;
            case "aboutScreen":
                monsterSmash.showScreen("aboutScreen");
                break;
        }
    }

    return {
        run: run
    };
})();