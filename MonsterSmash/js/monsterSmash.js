var ms = (function () {
    "use strict";

    var resourceQueue = []
        , screens = {}
        , musicQueued = false;

    function loadModule(src, callback) {
        var queueEntry = {
            src: src
            , callback: callback
            , loaded: false
        };
        resourceQueue.push(queueEntry);
        var first = document.getElementsByTagName("script")[0];
        var script = document.createElement("script");
        script.onload = function () {
            queueEntry.loaded = true;
            if (queueEntry.callback) {
                queueEntry.callback();
            }
        };
        script.src = src;
        first.parentNode.insertBefore(script, first);
    }

    function resourcesLoaded() {
        var loaded = 0;
        var total = 0;
        for (var i = 0; i < resourceQueue.length; ++i) {
            if (resourceQueue[i].loaded) {
                ++loaded;
            }
            ++total;
        }
        if (musicQueued) {
            return loaded / total;
        } else {
            return loaded / (total + 1); //queue cannot finish until after music init
        }
        
    }

    function setup() {
        //hide the address bar on android
        if (/Android/.test(navigator.userAgent)) {
            $("html")[0].style.height = "200%";
            setTimeout(function () {
                window.scrollTo(0, 1);
            }, 0);
        }

        // disable touchmove to prevent overscroll
        ms.dom.bind(document, "touchmove", function (event) {
            event.preventDefault();
        });

        init();

        showScreen("splashScreen");
    }

    function init() {
        if (!musicQueued && window.Howl && ms.sound) {
            initMusic();
        }
        if (ms.resourcesLoaded() < 1) {
            setTimeout(init, 0);
        } else {
            ms.gameManager.init();
            ms.input.init();
        }
    }

    function initMusic() {
        musicQueued = true;
        resourceQueue.push( ms.sound.loadMusic("SpazzmaticaPolka", {}) );
        resourceQueue.push( ms.sound.loadMusic("RunAmok", {}) );
    }

    function showScreen(screenId) {
        var dom = ms.dom
            , $ = dom.$
            , activeScreen = $("#game .screen.active")[0]
            , screen = $("#" + screenId)[0];
        if (!ms.screens[screenId]) {
            console.error("Module " + screenId + " not implimented.");
            return;
        }
        if (activeScreen) {
            dom.removeClass(activeScreen, "active");
        }
        dom.addClass(screen, "active");
        ms.screens[screenId].run();
    }

    function isTouchEnabled() {
        var msTouchEnabled = window.navigator.msMaxTouchPoints;
        var generalTouchEnabled = "ontouchstart" in document.createElement("div");
        if (msTouchEneabled || generalTouchEnabled) {
            return true;
        }
        return false;
    }

    return {
        loadModule: loadModule
        , setup: setup
        , resourcesLoaded: resourcesLoaded
        , screens: screens
        , showScreen: showScreen
    };
})();

ms.spriteData = {};
ms.levels = {};