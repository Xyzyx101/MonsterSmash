/* This draws the static background layer.  It can be an image or a static colour.  Parallax effects cound be added to the layer in the future */

monsterSmash.BackgroundLayer = function (ctx, background) {
    "use strict";
    var staticBackgroundColor = null
        , size = {
            width: ctx.canvas.width
            , height: ctx.canvas.height
        }
    ;

    if (background.image) {
        var image;
        this.getImage = function () {
            return image;
        };
        if (monsterSmash.imageManager.getImage(background.image)) {
            image = monsterSmash.imageManager.getImage(background.image);
            this.isLoaded = true;
        } else {
            this.isLoaded = false;
            var loadHandler = function () {
                this.isLoaded = true;
            };
            image = new Image();
            // loadHandler.bind(this) should make loadHandler run in the context
            // of this function rather than the context of image.
            image.addEventListener("load", loadHandler.bind(this), false);
            image.src = background.image;
            monsterSmash.screens.gameScreen.addResource(this, image.src, image);
        }
    } else {
        staticBackgroundColor = "rgb(" +
            background.color.r + "," +
            background.color.g + "," +
            background.color.b + ")";
    }

    function render() {
        if (background.image) {
            ctx.drawImage(image, 0, 0);
        } else {
            ctx.fillStyle = staticBackgroundColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
    }

    return {
        render: render
    };
};