monsterSmash.screens.splashScreen = (function () {
    "use strict";
    var progressBar
        , message;

    function run() {
        var $ = monsterSmash.dom.$;
        progressBar = $("#splashScreen progress")[0];
        progressBar.style.display = "block";
        message = $("#splashScreen .continue")[0];
        message.style.display = "none";
        checkProgress();
    }

    function checkProgress() {
        var progress = monsterSmash.resourcesLoaded();
        if (progress === 1) {
            progressBar.style.display = "none";
            message.style.display = "block";
            monsterSmash.dom.bind("#splashScreen", "click", function () {
                monsterSmash.showScreen("mainMenu");
            });
        } else {
            progressBar.value = progress;
            setTimeout(checkProgress, 0);
        }
    }

    return {
        run: run
    };
})();