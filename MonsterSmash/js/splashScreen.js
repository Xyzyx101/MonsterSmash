ms.screens.splashScreen = (function () {
    "use strict";
    var progressBar
        , message;

    function run() {
        var $ = ms.dom.$;
        progressBar = $("#splashScreen progress")[0];
        progressBar.style.display = "block";
        message = $("#splashScreen .continue")[0];
        message.style.display = "none";
        checkProgress();
    }

    function checkProgress() {
        var progress = ms.resourcesLoaded();
        if (progress === 1) {
            progressBar.style.display = "none";
            message.style.display = "block";
            ms.dom.bind("#splashScreen", "click", function () {
                ms.showScreen("mainMenu");
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