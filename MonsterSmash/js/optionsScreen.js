ms.screens.optionsScreen = (function () {
    "use strict";

    function run() {
        ms.dom.bind("#optionsScreen .return", "click", function (e) {
            ms.showScreen("mainMenu");
        });

    }

    return {
        run: run
    };
})();