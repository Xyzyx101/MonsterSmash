monsterSmash.screens.test2 = (function () {
    "use strict";
    var ctx
        , height
        , width
        , pos = []
        , testCount = 5000
        , frameCount = 0
        , totalFrames = 100
        , firstFrame
        , buffer
        , isRenderDone = true;

    function run() {
        var $ = monsterSmash.dom.$
            , gameAreaElement = $("#test2 .gameArea")[0]
            , canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        monsterSmash.dom.addClass(canvas, "playLayer");
        var rect = gameAreaElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
        gameAreaElement.appendChild(canvas);
        var bufferCanvas = document.createElement("canvas");
        bufferCanvas.width = width;
        bufferCanvas.height = height;
        buffer = bufferCanvas.getContext("2d");
        firstFrame = performance.now();
        cycle();
    }

    function cycle() {
        if (isRenderDone) {
            blit();
            isRenderDone = false;
            renderPos(pos);
        }
        calculatePos();
        
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

    function renderPos() {
        buffer.clearRect(0, 0, width, height);
        for (var i = 0; i < pos.length; ++i) {
            setTimeout((function () {
                var j = i;
                return function () {
                    buffer.beginPath();
                    buffer.fillStyle = pos[j].color;
                    buffer.moveTo(pos[j].x, pos[j].y);
                    buffer.arc(pos[j].x, pos[j].y, pos[j].radius, 0, 2 * Math.PI);
                    buffer.fill();
                };
            })(), 0);
        }
        isRenderDone = true;
    }

    function blit() { 
        var buffer_data = buffer.getImageData(0, 0, width, height);
        ctx.putImageData(buffer_data, 0, 0);
    }

    return {
        run: run
    };
})();