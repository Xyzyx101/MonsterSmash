monsterSmash.screens.test3 = (function () {
    "use strict";
    var ctx
        , height
        , width
        , pos = []
        , testCount = 5000
        , frameCount = 0
        , totalFrames = 100
        , firstFrame
        , renderWorker;
        
    function run() {
        var $ = monsterSmash.dom.$
            , gameAreaElement = $("#test3 .gameArea")[0]
            , canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        monsterSmash.dom.addClass(canvas, "playLayer");
        var rect = gameAreaElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
        gameAreaElement.appendChild(canvas);
        initWorker();
        firstFrame = performance.now();
        cycle();
    }

    function initWorker() {
        renderWorker = new Worker("js/test3_worker.js");
        renderWorker.onmessage = function (e) {
            ctx.putImageData(e.data, 0, 0);
        };
        renderWorker.postMessage({
            type: "init"
            , message: {
                height: height
                , width: width
            }
        });
    }

    function cycle() {
        calculatePos();
        renderWorker.postMessage({
            type: "render"
            , message : pos
        });

        ++frameCount;
        if (frameCount === totalFrames) {
            var fps = totalFrames / (performance.now() - firstFrame) * 1000;
            console.log("FPS " + fps);
            firstFrame = performance.now();
            frameCount = 0;
        }
        requestAnimationFrame(cycle);
    }

    function calculatePos() {
        pos.length = 0;

        for (var i = 0; i < testCount; ++i) {
            var newPos = {};
            newPos.x = Math.floor(Math.random() * width);
            newPos.y = Math.floor(Math.random() * height);
            newPos.radius = Math.random() * 50;
            newPos.color = "rgb("
                            + Math.floor(Math.random() * 255) +
                            ","
                            + Math.floor(Math.random() * 255) +
                            ","
                            + Math.floor(Math.random() * 255) +
                            ")";
            pos.push(newPos);
        }
    }

    return {
        run: run
    };
})();