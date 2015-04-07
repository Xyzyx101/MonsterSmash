ms.imageManager = (function () {
    "use strict";
    var images = {};

    function getImage(path) {
        if (images[path]) {
            return images[path];
        } else {
            return null;
        }
    }

    function storeImage(path, image) {
        images[path] = image;
    }

    function purgeImages() {
        images = {};
    }

    return {
        getImage: getImage
        , storeImage: storeImage
        , purgeImages: purgeImages
    };
})();