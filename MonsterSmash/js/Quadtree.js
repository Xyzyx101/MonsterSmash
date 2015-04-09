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

    ms.Quadtree.prototype.retrieve = function (collider, hits) {
        hits = hits || [];
        var index = this.getIndex(collider);
        if (index != -1 && this.nodes[0] !== null) {
            this.nodes[index].retrieve(collider, hits);
        }
        hits.concat(this.colliders);
        return hits;
    };


    ms.Quadtree.prototype.debugDraw = function (ctx) {
        if (this.nodes[0]) {
            for (var i = 0; i < 4; ++i) {
                this.nodes[i].debugDraw(ctx);
            }
        }
        ctx.save();
        ctx.strokeStyle = "rgba(255,0,255,0.7)";
        ctx.fillStyle = "rgba(255, 0, 255, 0.2)";
        ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        for (var colliderIndex = 0, len = this.colliders.length; colliderIndex < len; ++colliderIndex) {   
            ctx.fillRect(
                this.colliders[colliderIndex].x
                , this.colliders[colliderIndex].y
                , this.colliders[colliderIndex].width
                , this.colliders[colliderIndex].height
            );
        }
        ctx.restore();
    };

    ms.Quadtree.prototype.debugRetrieve = function (ctx, collider, hits) {
        hits = hits || [];
        ctx.save();
        ctx.strokeStyle = "rgba(0, 255, 255, 0.7)";
        //ctx.fillStyle = "rgba(0, 255, 255, 0.2)";
        ctx.strokeRect(collider.x, collider.y, collider.width, collider.height);
        ctx.restore();
        var index = this.getIndex(collider);
        if (index != -1 && this.nodes[0] !== null) {
            this.nodes[index].debugRetrieve(ctx, collider, hits);
        }
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 0, 0.7)";
        ctx.fillStyle = "rgba(255, 255, 0, 0.2)";
        ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        for (var colliderIndex = 0, len = this.colliders.length; colliderIndex < len; ++colliderIndex) {
            ctx.fillRect(
                this.colliders[colliderIndex].x
                , this.colliders[colliderIndex].y
                , this.colliders[colliderIndex].width
                , this.colliders[colliderIndex].height
            );
        }
        ctx.restore();

        hits.concat(this.colliders);
        return hits;
    };


    ms.Collider = function (x, y, width, height, parentObj) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.parentObj = parentObj;
    };
})();