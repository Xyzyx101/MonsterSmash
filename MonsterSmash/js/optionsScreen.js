monsterSmash.screens.optionsScreen = (function () {
    "use strict";

    function run() {
        monsterSmash.dom.bind("#optionsScreen .return", "click", function (e) {
            monsterSmash.showScreen("mainMenu");
        });

    }

    return {
        run: run
    };
})();