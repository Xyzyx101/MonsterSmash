(function () {
    var renderInProgress = false
        , bufferCtx
        , width
        , height;

    onmessage = function (e) {
        if (e.data.type === "init") {
            width = e.data.message.width;
            height = e.data.message.height;
            /*  This should work by the spec but CanvasRenderingContext2D consructor is not implemented in browsers yet */
            bufferCtx = new CanvasRenderingContext2D(width, height);
        } else if (e.data.type === "render") {
            if (!renderInProgress) {
                renderInProgress = true;
                render(e.data.message);
            }
        }  
    };

    function render(pos) {
        for (var i = 0; i < pos.length; ++i) {
            bufferCtx.beginPath();
            bufferCtx.fillStyle = pos[i].color;
            bufferCtx.moveTo(pos[i].x, pos[i].y);
            bufferCtx.arc(pos[i].x, pos[i].y, pos[i].radius, 0, 2 * Math.PI);
            bufferCtx.fill();
        }
        var bufferData = bufferCtx.getImageData(0, 0, width, height);
        renderInProgress = false;
        postMessage(bufferData);
        bufferCtx.clearRect(0, 0, width, height);
    }

    
})();