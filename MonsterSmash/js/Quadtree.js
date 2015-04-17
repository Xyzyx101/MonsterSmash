/* Quadtree is used for broad phase collision detection 
 *  bounds = {x:0, y:0, width:0, height:0}
 */
(function () {
    "use strict";

    ms.Quadtree = function (newLevel, newBounds) {
        this.level = newLevel;
        this.colliders = [];
        this.nodes = [null, null, null, null];
        this.bounds = newBounds;
    };

    ms.Quadtree.prototype.MAX_COLLIDERS = 4;
    ms.Quadtree.prototype.MAX_LEVELS = 5;

    ms.Quadtree.prototype.clear = function () {
        this.colliders = [];
        if (this.nodes[0] === null) {
            return;
        }
        for (var i = 0, len = this.nodes.length; i < len; ++i) {
            this.nodes[i].clear();
            this.nodes[i] = null;
        }
    };

    ms.Quadtree.prototype.split = function () {
        var subWidth = Math.floor(this.bounds.width * 0.5);
        var subHeight = Math.floor(this.bounds.height * 0.5);
        var x = this.bounds.x;
        var y = this.bounds.y;
        this.nodes[0] = new ms.Quadtree(
            this.level + 1
            , { x: x + subWidth, y: y, width: subWidth, height: subHeight }
        );
        this.nodes[1] = new ms.Quadtree(
            this.level + 1
            , { x: x, y: y, width: subWidth, height: subHeight }
        );
        this.nodes[2] = new ms.Quadtree(
            this.level + 1
            , { x: x, y: y + subHeight, width: subWidth, height: subHeight }
        );
        this.nodes[3] = new ms.Quadtree(
            this.level + 1
            , { x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight }
        );
    };

    /* determine the node that the collider belongs to.
     * -1 means the collider hits the node boundry and is part of the parent node
     */
    ms.Quadtree.prototype.getIndex = function (collider) {
        var index = -1;
        var verticalMidpoint = this.bounds.x + this.bounds.width * 0.5;
        var horizontalMidpoint = this.bounds.y + this.bounds.height * 0.5;

        var topQuadrant = collider.y < horizontalMidpoint && collider.y + collider.height < horizontalMidpoint;
        var botQuadrant = collider.y > horizontalMidpoint;

        if (collider.x < verticalMidpoint && collider.x + collider.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (botQuadrant) {
                index = 2;
            }
        } else if (collider.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (botQuadrant) {
                index = 3;
            }
        }
        return index;
    };


    /* inserts a new collider */
    ms.Quadtree.prototype.insert = function (collider) {
        var index;
        if (this.nodes[0] !== null) {
            index = this.getIndex(collider);
            if (index !== -1) {
                this.nodes[index].insert(collider);
                return;
            }
        }
        this.colliders.push(collider);
        if (this.colliders.length > this.MAX_COLLIDERS && this.level < this.MAX_LEVELS) {
            if (this.nodes[0] === null) {
                this.split();
            }
            var newColliders = [];
            for (var i = 0, len = this.colliders.length; i < len; ++i) {
                index = this.getIndex(this.colliders[i]);
                if (index === -1) {
                    newColliders.push(this.colliders[i]);
                } else {
                    this.nodes[index].insert(this.colliders[i]);
                }
            }
            this.colliders = newColliders;
        }
    };

    ms.Quadtree.prototype.debugDraw = function (ctx) {
        if (this.nodes[0]) {
            for (var i = 0; i < 4; ++i) {
                this.nodes[i].debugDraw(ctx);
            }
        }
        var cameraOffset = ms.screens.gameScreen.getCameraOffset();
        ctx.save();
        ctx.strokeStyle = "rgba(255,0,255,0.7)";
        ctx.fillStyle = "rgba(255, 0, 255, 0.2)";
        ctx.strokeRect(
            this.bounds.x - cameraOffset.x
            , this.bounds.y - cameraOffset.y
            , this.bounds.width
            , this.bounds.height
        );
        for (var colliderIndex = 0, len = this.colliders.length; colliderIndex < len; ++colliderIndex) {
            ctx.fillRect(
                this.colliders[colliderIndex].x - cameraOffset.x
                , this.colliders[colliderIndex].y - cameraOffset.y
                , this.colliders[colliderIndex].width
                , this.colliders[colliderIndex].height
            );
        }
        ctx.restore();
    };

    /* this will calculate debug info if you pass in a context */
    ms.Quadtree.prototype.retrieve = function (collider, hits, ctx) {
        hits = hits || [];
        var index = this.getIndex(collider);
        if (this.nodes[0] !== null) {
            if (index === -1) {
                /* Need to check overlap with all quadrants
                 * Could overlap with all 4 */
                if (collider.x <= this.nodes[0].bounds.x) {
                    if (collider.y <= this.nodes[2].bounds.y) {
                        hits = hits.concat(this.nodes[1].retrieve(collider, hits, ctx));
                    }
                    if (collider.y + collider.height >= this.nodes[2].bounds.y) {
                        hits = hits.concat(this.nodes[2].retrieve(collider, hits, ctx));
                    }
                }
                if (collider.x + collider.width >= this.nodes[0].bounds.x) {
                    if (collider.y <= this.nodes[3].bounds.y) {
                        hits = hits.concat(this.nodes[0].retrieve(collider, hits, ctx));
                    }
                    if (collider.y + collider.height >= this.nodes[3].bounds.y) {
                        hits = hits.concat(this.nodes[3].retrieve(collider, hits, ctx));
                    }
                }
            } else {
                hits = hits.concat(this.nodes[index].retrieve(collider, hits, ctx));
            }
        }
        if (ctx) {
            var cameraOffset = ms.screens.gameScreen.getCameraOffset();
            ctx.save();
            ctx.strokeStyle = "rgba(0, 255, 255, 0.85)";
            ctx.strokeRect(
                collider.x - cameraOffset.x
                , collider.y - cameraOffset.y
                , collider.width
                , collider.height
            );
            ctx.strokeStyle = "rgba(255, 255, 0, 0.7)";
            ctx.fillStyle = "rgba(255, 255, 0, 0.2)";
            ctx.strokeRect(
                this.bounds.x - cameraOffset.x
                , this.bounds.y - cameraOffset.y
                , this.bounds.width
                , this.bounds.height
            );
            for (var colliderIndex = 0, len = this.colliders.length; colliderIndex < len; ++colliderIndex) {
                ctx.fillRect(
                    this.colliders[colliderIndex].x - cameraOffset.x
                    , this.colliders[colliderIndex].y - cameraOffset.y
                    , this.colliders[colliderIndex].width
                    , this.colliders[colliderIndex].height
                );
            }
            ctx.restore();
        }
        return hits.concat(this.colliders);
    };


    ms.Collider = function (x, y, width, height, parentObj) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.parentObj = parentObj;
    };
})();