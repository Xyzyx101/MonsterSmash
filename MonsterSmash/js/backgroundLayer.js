/* This draws the static background layer.  It can be an image or a static colour.  Parallax effects cound be added to the layer in the future */

ms.BackgroundLayer = function (ctx, background, levelSize) {
    "use strict";
    var staticBackgroundColor = null
        , canvasSize = { width: ctx.canvas.width, height: ctx.canvas.height }
        , imageScale = {x:0,y:0};
    ;

    

    if (background.image) {
        var image;
        this.getImage = function () {
            return image;
        };
        if (ms.imageManager.getImage(background.image)) {
            image = ms.imageManager.getImage(background.image);
            this.isLoaded = true;
        } else {
            this.isLoaded = false;
            var loadHandler = function () {
                imageScale = {
                    x: levelSize.width / image.width
                    , y: levelSize.height / image.height
                }
                this.isLoaded = true;
            };
            image = new Image();
            // loadHandler.bind(this) should make loadHandler run in the context
            // of this function rather than the context of image.
            image.addEventListener("load", loadHandler.bind(this), false);
            image.src = background.image;
            ms.screens.gameScreen.addResource(this, image.src, image);
        }
    } else {
        staticBackgroundColor = "rgb(" +
            background.color.r + "," +
            background.color.g + "," +
            background.color.b + ")";
    }

    function render() {
        if (background.image) {
            ctx.save();
            ctx.scale(imageScale.x, imageScale.y);
            ctx.drawImage(image, 0, 0);
            ctx.restore();
        } else {
            ctx.fillStyle = staticBackgroundColor;
            ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        }
    }

    return {
        render: render
    };
};