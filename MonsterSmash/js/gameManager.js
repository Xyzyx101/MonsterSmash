ms.gameManager = (function () {
    "use strict";
    var currentLevel
        , score
        , power
        , MAX_POWER = 1000
        , dead = false
        , levelMap = []
        , levelLoaded = false
    ;

    function init() {
        levelMap[0] = ms.levels.level00;
    }

    function startNewGame() {
        currentLevel = -1;
        score = 0;
        power = MAX_POWER;
        dead = false;
        levelLoaded = false;
    }

    function nextLevel() {
        if (currentLevel === levelMap.length - 1) {
            currentLevel = -1;
        }
        return levelMap[++currentLevel];
    }

    function endGame() {
        dead = true;
        levelLoaded = false;
        ms.showScreen("levelCompleteScreen");
    }

    function completeLevel() {
        levelLoaded = false;
        ms.showScreen("levelCompleteScreen");
    }

    function getScore() {
        return score;
    }

    function setScore(newScore) {
        score = newScore;
    }

    function addScore(newScore) {
        score += newScore;
    }

    function getPower() {
        return power;
    }

    function setPower(newPower) {
        power = newPower;
    }

    function addPower(newPower) {
        power += newPower;
        if (power > MAX_POWER) {
            power = MAX_POWER;
        }
    }

    function isDead() {
        return dead;
    }

    function setLevelLoaded(value) {
        levelLoaded = value;
    }

    function isLevelLoaded() {
        return levelLoaded;
    }

    return {
        init: init
        , startNewGame: startNewGame
        , nextLevel: nextLevel
        , endGame: endGame
        , completeLevel: completeLevel
        , isDead: isDead
        , getScore: getScore
        , setScore: setScore
        , addScore: addScore
        , getPower: getPower
        , setPower: setPower
        , addPower: addPower
        , MAX_POWER: MAX_POWER
        , isLevelLoaded: isLevelLoaded
        , setLevelLoaded: setLevelLoaded
    };
})();

