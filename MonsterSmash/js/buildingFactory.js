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
            , damageOffset
            , tileBB = { width: 44, height: 44 }
            , maxDamage
            , buildingDamage = 0
            , destroyed = false
            , tilePosition = []
            , tileRotation = []
            , tileInitialPosition = []
            , tileFinalRotation = []
            , tileFinalPosition = []
            , collapseTime
            , collapseTimer
            , edgeColliderWidth = 10
        ;

        collapseTime = 200 * size.height;
        maxDamage = size.width * size.height * 3; // three is for the three damaged states

        damageOffset = tileSize.rightEdgeWidth + tileSize.centerWidth + tileSize.leftEdgeWidth;
        for (var col = 0; col < size.width; ++col) {
            var posX
                , posY;
            tileHP[col] = [];
            tileDamage[col] = [];
            tilePosition[col] = [];
            tileRotation[col] = [];
            tileInitialPosition[col] = [];
            tileRotation[col] = [];
            if (col === 0) {
                posX = location.x;
            } else {
                posX = location.x + tileSize.leftEdgeWidth + ((col - 1) * tileSize.centerWidth);
            }
            for (var row = 0; row < size.height; ++row) {
                tileHP[col][row] = newTileHP;
                tileDamage[col][row] = renderStyle.NEW;
                posY = location.y + (row * tileSize.floorHeight);
                tilePosition[col][row] = { x: posX, y: posY };
                tileInitialPosition[col][row] = { x: posX, y: posY };
                tileRotation[col][row] = 0;
            }
        }

        /* Update is special on a building.  When they are in the level they are static and update is not called. 
         * When the building is destroyed it is removed from the building array and added to entities so it can animate */
        function update(dt) {
            if (this.kill) {
                return;
            }
            if (collapseTimer < 0) {
                this.kill = true;
                ms.screens.gameScreen.markEntitiesDirty();
                return;
            }
            collapseTimer -= dt;
            var collapseRatio = 1 - (collapseTimer / collapseTime);
            for (var col = 0; col < size.width; ++col) {
                for (var row = 0; row < size.height; ++row) {
                    var posX, posY;
                    posX = tileInitialPosition[col][row].x + (tileFinalPosition[col][row].x - tileInitialPosition[col][row].x) * collapseRatio;
                    posY = tileInitialPosition[col][row].y + (tileFinalPosition[col][row].y - tileInitialPosition[col][row].y) * collapseRatio;
                    tilePosition[col][row] = { x: posX, y: posY };
                    tileRotation[col][row] = tileFinalRotation[col][row] * collapseRatio;
                }
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
                    var sourceX, sourceY;
                    if (col === 0) {
                        sourceX = tileDamage[col][row] * damageOffset;
                    } else if (col === size.width - 1) {
                        sourceX = tileSize.leftEdgeWidth + tileSize.centerWidth + (tileDamage[col][row] * damageOffset);
                    } else {
                        sourceX = tileSize.leftEdgeWidth + (tileDamage[col][row] * damageOffset);
                    }
                    sourceY = row === 0 ? 0 : tileSize.floorHeight; // first row gets the top image

                    var rot = tileRotation[col][row];
                    if (rot === 0) {
                        ctx.drawImage(
                            image
                            , sourceX
                            , sourceY
                            , tileWidth
                            , tileHeight
                            , tilePosition[col][row].x - cameraOffset.x
                            , tilePosition[col][row].y - cameraOffset.y
                            , tileWidth
                            , tileHeight
                        );

                    } else {
                        ctx.save();
                        ctx.translate(tilePosition[col][row].x - cameraOffset.x, tilePosition[col][row].y - cameraOffset.y);
                        ctx.rotate(rot);
                        ctx.drawImage(
                            image
                            , sourceX
                            , sourceY
                            , tileWidth
                            , tileHeight
                            , 0
                            , 0
                            , tileWidth
                            , tileHeight
                        );
                        ctx.restore();
                    }
                }
            }
        }

        function damage(tile) {
            if (destroyed) {
                return;
            }
            var thisTileDamage = tileDamage[tile.col][tile.row];
            if (thisTileDamage === renderStyle.DESTROYED) {
                return;
            } else if (thisTileDamage === renderStyle.HEAVYDAMAGE) {
                tileDamage[tile.col][tile.row] = renderStyle.DESTROYED;
                ++buildingDamage;
                checkDestroyed();
            } else if (thisTileDamage === renderStyle.DAMAGE) {
                tileDamage[tile.col][tile.row] = renderStyle.HEAVYDAMAGE;
                ++buildingDamage;
                checkDestroyed();
            } else if (thisTileDamage === renderStyle.NEW) {
                tileDamage[tile.col][tile.row] = renderStyle.DAMAGE;
                ++buildingDamage;
                checkDestroyed();
            }
        }

        function checkDestroyed() {
            if (buildingDamage / maxDamage > 0.4) {
                destroyBuilding();
                destroyed = true;
                ms.screens.gameScreen.markBuildingsDirty();
            }
        }

        function destroyBuilding() {
            tileFinalPosition = [];
            tileFinalRotation = [];
            for (var col = 0; col < size.width; ++col) {
                tileFinalPosition[col] = [];
                tileFinalRotation[col] = [];
                for (var row = 0; row < size.height; ++row) {
                    var finalX, finalY, finalRot;
                    finalX = tilePosition[col][row].x + Math.random() * tileSize.centerWidth * 2 - tileSize.centerWidth;
                    finalY = ms.screens.gameScreen.getGroundLevel() - tileSize.floorHeight * (Math.random() * 0.5 + 0.5);
                    tileFinalPosition[col][row] = { x: finalX, y: finalY };
                    tileFinalRotation[col][row] = Math.random() * 2 - 1;
                }
            }
            collapseTimer = collapseTime;
        }

        function addCollidersToQuadtree(quadtree) {
            for (var col = 0; col < size.width; ++col) {
                var tileXOffset
                    , colliderWidth;
                var tileYOffset = Math.floor((tileSize.floorHeight - tileBB.height) * 0.5);
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
                for (var row = 0; row < size.height; ++row) {
                    var parentObj = {
                        type: "building"
                        , obj: this
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

                    if (row === 0) {
                        addRoofCollider(col, quadtree, colliderX, colliderWidth);
                    }
                    if (col === 0) {
                        addLeftEdgeCollider(row, quadtree);
                    } else if (col === size.width - 1) {
                        addRightEdgeCollider(row, quadtree);
                    }
                }
            }
        }

        function addLeftEdgeCollider(row, quadtree) {
            var colliderX = location.x - edgeColliderWidth;
            var colliderY = location.y + row * tileSize.floorHeight + Math.floor((tileSize.floorHeight - tileBB.height) * 0.5);
            var parentObj = {
                type: "leftEdge"
                , obj: this
                , wallPosition: location.x
            };
            var collider = new ms.Collider(colliderX, colliderY, edgeColliderWidth, tileBB.height, parentObj);
            quadtree.insert(collider);
        }

        function addRightEdgeCollider(row, quadtree) {
            var colliderX = location.x + tileSize.leftEdgeWidth + (col - 2) * tileSize.centerWidth + tileSize.rightEdgeWidth;
            var colliderY = location.y + row * tileSize.floorHeight + Math.floor((tileSize.floorHeight - tileBB.height) * 0.5);
            var parentObj = {
                type: "rightEdge"
                , obj: this
                , wallPosition: colliderX
            };
            var collider = new ms.Collider(colliderX, colliderY, edgeColliderWidth, tileBB.height, parentObj);
            quadtree.insert(collider);
        }

        function addRoofCollider(col, quadtree, colliderX, colliderWidth) {
            var colliderY = location.y - edgeColliderWidth;
            var parentObj = {
                type: "roof"
                , obj: this
                , roofPosition : location.y
            };
            var collider = new ms.Collider(colliderX, colliderY, colliderWidth, edgeColliderWidth, parentObj);
            quadtree.insert(collider);
        }

        function isTileDestroyed(row, col) {
            return tileDamage[col][row] === renderStyle.DESTROYED;
        }

        // is whole building destroyed
        function isDestroyed() {
            return destroyed;
        }

        return {
            update: update
            , render: render
            , damage: damage
            , addCollidersToQuadtree: addCollidersToQuadtree
            , isTileDestroyed: isTileDestroyed
            , isDestroyed: isDestroyed
        };
    }

    return {
        createBuilding: createBuilding
    };
})();