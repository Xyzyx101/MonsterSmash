ms.screens.optionsScreen = (function () {
    "use strict";

    function run() {
        ms.dom.bind("#optionsScreen .return", "click", function (e) {
            if (ms.gameManager.levelLoaded) {
                ms.showScreen("gameScreen");
            } else {
                ms.showScreen("mainMenu");
            }
        });

    }

    return {
        run: run
    };
})();