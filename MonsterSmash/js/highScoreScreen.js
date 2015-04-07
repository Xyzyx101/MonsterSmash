ms.screens.highScoreScreen = (function () {
    "use strict";

    function run() {
        ms.dom.bind("#highScoreScreen .return", "click", function (e) {
            ms.showScreen("mainMenu");
        });

    }

    return {
        run: run
    };
})();