ms.buildingFactory = (function () {
    "use strict";

    var renderStyle = {
        NEW: 0
        , DAMAGE: 1
        , HEAVYDAMAGE: 2
        , DESTROYED: 3
    };

    function createBuilding(ctx, buildingStyle, xPos, size) {
        var buildingImagePath = ms.buildingStyles[buildingStyle].image
            , tileHP = ms.buildingStyles[buildingStyle].tileHP
            , tileSize = ms.buildingStyles[buildingStyle].tileSize
            , location = {}
        ;

        location.x = xPos;
        location.y = ms.screens.gameScreen.getGroundLevel() - (size.height * tileSize.floorHeight);
        var image = new Image();
        var newBuilding = new Building(ctx, image, location, size, tileHP, tileSize);
        if (ms.imageManager.getImage(buildingImagePath)) {
            image = ms.imageManager.getImage(buildingImagePath);
            newBuilding.isLoaded = true;
        } else {
            newBuilding.isLoaded = false;
            var loadHandler = function () {
                newBuilding.isLoaded = true;
            };
            image.addEventListener("load", loadHandler.bind(newBuilding), false);
            image.src = buildingImagePath;
            ms.screens.gameScreen.addResource(newBuilding, image.src, image);
        }
        return newBuilding;
    }

    function Building(newCtx, newImage, newLocation, newSize, newTileHP, newTileSize) {
        var image = newImage
            , ctx = newCtx
            , location = newLocation
            , size = newSize
            , tileSize = newTileSize
            , buildingHP
            , tileHP = []
            , tileDamage = []
            , tileColliders = []
            , damageOffset
            , tileBB = { width: 44, height: 44 };

        damageOffset = tileSize.rightEdgeWidth + tileSize.centerWidth + tileSize.leftEdgeWidth;
        for (var i = 0; i < size.width; ++i) {
            tileHP[i] = [];
            tileDamage[i] = [];
            for (var j = 0; j < size.height; ++j) {
                tileHP[i][j] = newTileHP;
                tileDamage[i][j] = renderStyle.NEW;
            }
        }

        function render() {
            var cameraOffset = ms.screens.gameScreen.getCameraOffset();
            for (var col = 0; col < size.width; ++col) {
                var tileWidth, tileHeight;
                if (col === 0) {
                    tileWidth = tileSize.leftEdgeWidth;
                } else if (col === size.width - 1) {
                    tileWidth = tileSize.rightEdgeWidth;
                } else {
                    tileWidth = tileSize.centerWidth;
                }
                tileHeight = tileSize.floorHeight;
                for (var row = 0; row < size.height; ++row) {
                    var sourceX, sourceY, destX, destY;
                    if (col === 0) {
                        sourceX = tileDamage[col][row] * damageOffset;
                    } else if (col === size.width - 1) {
                        sourceX = tileSize.leftEdgeWidth + tileSize.centerWidth + (tileDamage[col][row] * damageOffset);
                    } else {
                        sourceX = tileSize.leftEdgeWidth + (tileDamage[col][row] * damageOffset);
                    }
                    sourceY = row === 0 ? 0 : tileSize.floorHeight; // first row gets the top image 
                    if (col === 0) {
                        destX = location.x;
                    } else {
                        destX = location.x + tileSize.leftEdgeWidth + ((col - 1) * tileSize.centerWidth);
                    }
                    destY = location.y + (row * tileSize.floorHeight);
                    ctx.drawImage(
                        image
                        , sourceX
                        , sourceY
                        , tileWidth
                        , tileHeight
                        , destX - cameraOffset.x
                        , destY - cameraOffset.y
                        , tileWidth
                        , tileHeight
                    );
                }
            }
        }

        function damage() {

        }

        function addCollidersToQuadtree(quadtree) {
            for (var col = 0; col < size.width; ++col) {
                var tileXOffset
                    , colliderWidth;
                if (col === 0) {
                    tileXOffset = Math.floor((tileSize.leftEdgeWidth - tileBB.width) * 0.5);
                    colliderWidth = Math.floor(tileBB.width * (tileSize.leftEdgeWidth / tileSize.centerWidth));
                } else if (col === size.width - 1) {
                    tileXOffset = Math.floor((tileSize.rightEdgeWidth - tileBB.width) * 0.5);
                    colliderWidth = Math.floor(tileBB.width * (tileSize.rightEdgeWidth / tileSize.centerWidth));       
                } else {
                    tileXOffset = Math.floor((tileSize.centerWidth - tileBB.width) * 0.5);
                    colliderWidth = tileBB.width;
                }
                var tileYOffset = Math.floor((tileSize.floorHeight - tileBB.height) * 0.5);
                for (var row = 0; row < size.height; ++row) {
                    var parentObj = {
                        type: "building"
                        , building: this
                        , tile: { row: row, col: col }
                    };
                    var colliderX, colliderY;
                    if (col === 0) {
                        colliderX = location.x + tileXOffset;
                    } else {
                        colliderX = location.x + tileSize.leftEdgeWidth + (col - 1) * tileSize.centerWidth + tileXOffset;
                    }
                    colliderY = location.y + row * tileSize.floorHeight + tileYOffset;
                    var collider = new ms.Collider(colliderX, colliderY, colliderWidth, tileBB.height, parentObj);
                    quadtree.insert(collider);
                }
            }
        }

        return {
            render: render
            , damage: damage
            , addCollidersToQuadtree: addCollidersToQuadtree
        };
    }

    return {
        createBuilding: createBuilding

    };
})();