monsterSmash.screens.highScoreScreen = (function () {
    "use strict";

    function run() {
        monsterSmash.dom.bind("#highScoreScreen .return", "click", function (e) {
            monsterSmash.showScreen("mainMenu");
        });

    }

    return {
        run: run
    };
})();