﻿ms.screens.levelCompleteScreen = (function () {
    "use strict";

    var timeoutID
        , displayScore
        , displayPower
        , updateTime
        , scoreElement
        , powerMeterElement
    ;

    function run() {
        scoreElement = ms.dom.$("#levelCompleteScreen .score")[0];
        powerMeterElement = ms.dom.$("#levelCompleteScreen .power")[0];
        displayScore = ms.gameManager.getScore();
        displayPower = ms.gameManager.getPower();
        ms.dom.unbind("#levelCompleteScreen .nextButton", "click", toMain);
        ms.dom.unbind("#levelCompleteScreen .nextButton", "click", toNext);
        if (ms.gameManager.isDead()) {
            document.getElementById("levelCompleteMessage").textContent = "You Died";
            document.getElementById("levelCompleteButton").textContent = "Main Menu";          
            ms.dom.bind("#levelCompleteScreen .nextButton", "click",toMain);
        } else {
            document.getElementById("levelCompleteMessage").textContent = "Level Complete";
            document.getElementById("levelCompleteButton").textContent = "Next Level";
            ms.dom.bind("#levelCompleteScreen .nextButton", "click", toNext);
        }
        timeoutID = window.setTimeout(update, 50);
    }

    function toMain(e) {
        clearTimeout(timeoutID);
        ms.showScreen("mainMenu");
    }

    function toNext(e) {
        clearTimeout(timeoutID);
        ms.showScreen("gameScreen");
    }

    function update() {
        if (displayPower > 0) {
            displayPower -= 10;
            ms.gameManager.addScore(250);
        } else {
            ms.dom.$("#levelCompleteScreen .nextButton")[0].style.display = "block";
        }
        var score = ms.gameManager.getScore();
        if (score > displayScore) {
            var newDisplayScore = Math.ceil((score - displayScore) * 0.25);
            displayScore = Math.min(displayScore + newDisplayScore, score);
            scoreElement.innerHTML = displayScore;
        }
        var powerPercent = displayPower / ms.gameManager.MAX_POWER;
        powerMeterElement.style.width = Math.ceil(powerPercent * 100) + "%";
        timeoutID = window.setTimeout(update, 50);
    }

    return {
        run: run
    };
})();