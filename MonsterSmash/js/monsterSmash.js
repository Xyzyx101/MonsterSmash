var monsterSmash = (function () {
    "use strict";

    var resourceQueue = []
        , screens = {};

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
            if(queueEntry.callback) {
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
        return loaded / total;
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
        monsterSmash.dom.bind(document, "touchmove", function (event) {
            event.preventDefault();
        });

        showScreen("splashScreen");
        
    }

    function showScreen(screenId) {
        var dom = monsterSmash.dom
            , $ = dom.$
            , activeScreen = $("#game .screen.active")[0]
            , screen = $("#" + screenId)[0];
        if (!monsterSmash.screens[screenId]) {
            console.error("Module " + screenId + " not implimented.");
            return;
        }
        if (activeScreen) {
            dom.removeClass(activeScreen, "active");
        }
        dom.addClass(screen, "active");
        monsterSmash.screens[screenId].run();
    }

    return {
        loadModule: loadModule
        , setup: setup
        , resourcesLoaded: resourcesLoaded
        , screens: screens
        , showScreen: showScreen
    };
})();