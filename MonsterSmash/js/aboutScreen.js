ms.screens.aboutScreen = (function () {
    "use strict";

    function run() {
        ms.dom.bind("#aboutScreen .return", "click", function (e) {
            ms.showScreen("mainMenu");
        });

    }

    return {
        run: run
    };
})();