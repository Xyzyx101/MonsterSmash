monsterSmash.screens.test1 = (function () {
    "use strict";
    var ctx
        , height
        , width
        , pos = []
        , testCount = 5000
        , frameCount = 0
        , totalFrames = 100
        , firstFrame;

    function run() {
        var $ = monsterSmash.dom.$
            , gameAreaElement = $("#test1 .gameArea")[0]
            , canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        monsterSmash.dom.addClass(canvas, "playLayer");
        var rect = gameAreaElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
        gameAreaElement.appendChild(canvas);
        firstFrame = performance.now();
        cycle();
    }

    function cycle() {
        calculatePos();
        ctx.clearRect(0, 0, width, height);
        renderPos();
        

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
        for (var i = 0; i < pos.length; ++i) {
            ctx.beginPath();
            ctx.fillStyle = pos[i].color;
            ctx.moveTo(pos[i].x, pos[i].y);
            ctx.arc(pos[i].x, pos[i].y, pos[i].radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    return {
        run: run
    };
})();