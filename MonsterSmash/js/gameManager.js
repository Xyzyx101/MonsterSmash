ms.gameManager = (function () {
    var currentLevel
        , score
        , isDead = false
        , levels = {}
        , levelMap = []
    ;

    function init() {
        levelMap[0] = levels.level00;   
    }

    function startNewGame() {
        currentLevel = -1;
        score = 0;
        isDead = false;
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

    return {
        init: init
        , startNewGame: startNewGame
        , nextLevel: nextLevel
        , endGame: endGame
        , completeLevel: completeLevel
        , isDead: isDead
        , levels: levels
    };
})();