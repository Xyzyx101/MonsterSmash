monsterSmash.screens.aboutScreen = (function () {
    "use strict";

    function run() {
        monsterSmash.dom.bind("#aboutScreen .return", "click", function (e) {
            monsterSmash.showScreen("mainMenu");
        });

    }

    return {
        run: run
    };
})();