ms.gameManager = (function () {
    var currentLevel
        , score
        , power
        , MAX_POWER = 1000
        , isDead = false
        , levels = {}
        , levelMap = []
        , levelLoaded = false
    ;

    function init() {
        levelMap[0] = levels.level00;
    }

    function startNewGame() {
        currentLevel = -1;
        score = 0;
        power = MAX_POWER;
        isDead = false;
        levelLoaded = false;
    }

    function nextLevel() {
        return levelMap[++currentLevel];
    }

    function endGame() {
        isDead = true;
        ms.showScreen("completeLevelScreen");
    }

    function completeLevel() {
        ms.showScreen("completeLevelScreen");
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

    return {
        init: init
        , startNewGame: startNewGame
        , nextLevel: nextLevel
        , endGame: endGame
        , completeLevel: completeLevel
        , isDead: isDead
        , levels: levels
        , getScore: getScore
        , setScore: setScore
        , addScore: addScore
        , getPower: getPower
        , setPower: setPower
        , MAX_POWER: MAX_POWER
    };
})();

