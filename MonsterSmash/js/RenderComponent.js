/* RenderEntity is the rendering and animation system component of a game entity.
 * It is added to a game entity by chaining the contructors
 * 
 *      someGameObject = function () {
 *          monsterSmash.Entity.call(this, "./images/foo.png", 350, {width:64, height:32});
 *      }
 */
monsterSmash.RenderComponent = function (ctx, src, newFrameDelay, newFrameSize) {
    "use strict";
    var image;

    if (monsterSmash.imageManager.getImage(src)) {
        image = monsterSmash.imageManager.getImage(src);
        this.isLoaded = true;
    } else {
        this.isLoaded = false;
        var loadHandler = function () {
            this.isLoaded = true;
        };
        image = new Image();
        // loadHandler.bind(this) will make loadHandler run in the context
        // of this function rather than the context of image.
        image.addEventListener("load", loadHandler.bind(this), false);
        image.src = src;
        monsterSmash.screens.gameScreen.addResource(this, src, image);
    }

    var currentFrame = 0;
    var frameDelay = newFrameDelay; // frame delay in milliseconds. 0 will not animate
    var animations = []; // should contain anim objects
    var frameSize = newFrameSize;
    var animFrameChangeCount = 0;
    var currentAnim = {};

    function addAnim(anim) {
        animations.push(anim);
    }

    function animate(dt) {
        if (frameDelay === 0) { return; }
        animFrameChangeCount += dt;
        while (animFrameChangeCount > frameDelay) {
            animFrameChangeCount -= frameDelay;
            currentFrame++;
            if (currentFrame >= currentAnim.playOrder.length) {
                currentFrame = 0;
            }
        }
    }

    function changeAnim(newAnim) {
        currentFrame = 0;
        animFrameChangeCount = 0;
        var index = 0;

        var found = false;
        do {
            if (animations[index].name === newAnim) {
                found = true;
                break;
            }
            ++index;
        } while (index < animations.length);
        if (found === true) {
            currentAnim = animations[index];
        } else {
            console.log("Error " + newAnim + " not found!");
        }
    }

    function displayAnim(dx, dy) {
        var myFrame = currentAnim.playOrder[currentFrame];
        var sx = currentAnim.frames[myFrame].x;
        var sy = currentAnim.frames[myFrame].y;
        ctx.drawImage(
            image,
            sx,
            sy,
            frameSize.width,
            frameSize.height,
            dx,
            dy,
            frameSize.width,
            frameSize.height);
    }

    return {
        addAnim: addAnim
        , animate: animate
        , changeAnim: changeAnim
        , displayAnim: displayAnim
    };
};

/* A single animation.  Which animation is playing will change based on an entities state machine.
 @name - animation name
 @frames - [{x:0,y:0},{x:0,y:0},{x:0,y:0}] - array of position vectors from the source image
 @playOrder - [0,1,2,3,2,1,0] - animation frame sequence */
monsterSmash.Anim = function (name, frames, playOrder) {
    this.name = name;
    this.frames = frames;
    this.playOrder = playOrder;
};
