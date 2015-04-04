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
            case "test1":
                monsterSmash.showScreen("test1");
                break;
            case "test2":
                monsterSmash.showScreen("test2");
                break;
            case "test3":
                monsterSmash.showScreen("test3");
                break;
        }
    }

    return {
        run: run
    };
})();