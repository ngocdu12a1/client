/**
 * Created by CPU60126_LOCAL on 6/4/2020.
 */

var MapGrid = cc.Class.extend({

    _grid: null,
    _x3Grid: null,
    // List defence Buildings that cover tile (i, j)
    _defenceBuildings: null,
    // number of building near tile (i, j)
    _prohibitedGrid: null,
    _draw: null,
    _armyList: null,

    ctor:function (isInBattle) {
        this._grid = [];
        this._x3Grid = [];
        this._defenceBuildings = [];
        this._prohibitedGrid = [];

        this.initGrid(isInBattle);
        this.initX3Grid(isInBattle);
        this.initProhibitedGrid(isInBattle);
    },

    initGrid: function(isInBattle) {
        for (let i = 0; i < constantData.MAP_X; i++ ) {
            this._grid.push([]);
            for ( let j = 0; j < constantData.MAP_Y; j++ ) {
                this._grid[i].push(res.MapUI.buildings.id.unavailable);
            }
        }
        if (!isInBattle) {
            for (let i = 1; i <= 40; i++) {
                for (let j = 1; j <= 40; j++) {
                    this._grid[i][j] = res.MapUI.buildings.id.grass;
                }
            }
        } else {
            for (let i = 2; i <= 41; i++) {
                for (let j = 2; j <= 41; j++) {
                    this._grid[i][j] = res.MapUI.buildings.id.grass;
                }
            }
        }
    },


    initX3Grid: function(isInBattle) {
        for (let i = 0; i < constantData.MAP_X * 3; i++ ) {
            this._x3Grid.push([]);
            this._defenceBuildings.push([]);
            for ( let j = 0; j < constantData.MAP_Y * 3; j++ ) {
                this._x3Grid[i].push(res.MapUI.buildings.id.grass);
                this._defenceBuildings[i].push([]);
            }
        }
    },

    initProhibitedGrid: function(isInBattle) {
        for (let i = 0; i < constantData.MAP_X; i++ ) {
            this._prohibitedGrid.push([]);
            for ( let j = 0; j < constantData.MAP_Y; j++ ) {
                this._prohibitedGrid[i].push(0);
            }
        }
    },

    objectRectToX3Rect: function(rect) {
        return cc.rect(rect.x * 3 + 1, rect.y * 3 + 1, rect.width * 3 - 2, rect.height * 3 - 2);
    },


    addDefRange: function(id, rect, minRange, maxRange) {
        let x3Rect = this.objectRectToX3Rect(rect);
        let x3CenterTile = cc.p(x3Rect.x + Math.ceil(x3Rect.width / 2) - 1, x3Rect.y + Math.ceil(x3Rect.height / 2) - 1);
        // cc.log(id.toString(), JSON.stringify(x3Rect), JSON.stringify(x3CenterTile));
        let mRange = minRange * 3;
        let range = maxRange * 3;
        for(let i = x3CenterTile.x - range; i <= x3CenterTile.x + range; i++) {
            let diffI = x3CenterTile.x - i;
            let maxDiffJ = Math.floor(Math.sqrt(range * range - diffI * diffI));
            for(let j = x3CenterTile.y - maxDiffJ ; j <= x3CenterTile.y + maxDiffJ; j++) {

                if (gv.mapUtils.getEuclideanDistance(cc.p(i, j), cc.p(x3CenterTile.x, x3CenterTile.y)) < mRange || this.getX3ObjectId(cc.p(i, j)) == res.MapUI.buildings.id.unavailable)
                    continue;

                //var dn = new cc.DrawNode();
                //gv.mapLayer.addChild(dn);
                //dn.drawDot(gv.isometricUtils.x3TilePosToIso(cc.p(i,j)), 2,  cc.color(255, 0, 0));
                this._defenceBuildings[i][j].push(id);
            }
        }
    },

    getAttackDirection: function(rect, x3P) {
        let x3Rect = this.objectRectToX3Rect(rect);
        let x3CenterTile = cc.p(x3Rect.x + Math.ceil(x3Rect.width / 2), x3Rect.y + Math.ceil(x3Rect.height / 2));
        return gv.mapUtils.getDirection(gv.isometricUtils.x3TilePosToIso(x3CenterTile), gv.isometricUtils.x3TilePosToIso(x3P));
    },

    fillGrid: function(id, rect) {
        for(let i = rect.x; i < Math.min(constantData.MAP_X - 1, rect.x + rect.width); i++)
            for(let j = rect.y; j < Math.min(constantData.MAP_Y - 1, rect.y + rect.height); j++) {
                this._grid[i][j] = id;
            }
        if (gv.objectManager.getObjectById(id) != null && gv.objectManager.getObjectById(id).getAcronym().substring(0, 3) == "WAL")
            this.fillX3Grid(id, cc.rect(rect.x * 3, rect.y * 3, rect.width * 3, rect.height * 3));
        else
            this.fillX3Grid(id, this.objectRectToX3Rect(rect));

        cc.log("id:", id);
        if (id != res.MapUI.buildings.id.grass && id != res.MapUI.buildings.id.unavailable) {
            if (gv.objectManager.getObjectById(id).isBuilding())
                this.fillProhibitedGrid(1, this.getProhibitedRect(rect));
        } else
            this.fillProhibitedGrid(-1, this.getProhibitedRect(rect));
    },

    // get prohibited area for building rect
    getProhibitedRect: function(rect) {
        return cc.rect(rect.x - 1, rect.y - 1, rect.width + 2, rect.height + 2);
    },

    fillProhibitedGrid: function(value, rect) {
        for(let i = Math.max(0, rect.x); i < Math.min(constantData.MAP_X, rect.x + rect.width); i++)
            for(let j = Math.max(0, rect.y); j < Math.min(constantData.MAP_Y, rect.y + rect.height); j++) {
                this._prohibitedGrid[i][j] += value;
                this._prohibitedGrid[i][j] = Math.max(this._prohibitedGrid[i][j], 0);
                cc.log(i.toString(), j.toString(), this._prohibitedGrid[i][j].toString());
            }
    },

    fillX3Grid: function(id, x3Rect) {
        for(let i = x3Rect.x; i < Math.min(constantData.MAP_X * 3, x3Rect.x + x3Rect.width); i++)
            for(let j = x3Rect.y; j < Math.min(constantData.MAP_Y * 3, x3Rect.y + x3Rect.height); j++) {
                this._x3Grid[i][j] = id;
            }
    },

    getDefenceBuildingList: function(x3P) {
        return this._defenceBuildings[x3P.x][x3P.y];
    },

    clearGrid: function(rect) {
        this.fillGrid(res.MapUI.buildings.id.grass, rect);
    },

    getObjectId: function(p) {
        if (p.x < 1 || p.x > constantData.MAP_X - 1 || p.y < 1 || p.y > constantData.MAP_Y - 1)
            return res.MapUI.buildings.id.unavailable;
        return this._grid[p.x][p.y];
    },

    getX3ObjectId: function(p) {
        if (p.x < 0 || p.x > constantData.MAP_X * 3 - 1 || p.y < 0 || p.y > constantData.MAP_Y * 3 - 1)
            return res.MapUI.buildings.id.unavailable;
        return this._x3Grid[p.x][p.y];
    },

    getProhibitedCount: function(p) {
        if (p.x < 1 || p.x > constantData.MAP_X - 1 || p.y < 1 || p.y > constantData.MAP_Y - 1)
            return 1;
        return this._prohibitedGrid[p.x][p.y];
    },

    canDropTroop: function(p) {
        return this.getProhibitedCount(p) == 0;
    },

    drawProhibitedLine: function() {
        if (this._draw != null)
            this._draw.removeFromParent();
        this._draw = new cc.DrawNode();
        this._draw.setLocalZOrder(res.MapUI.zPosition.arrow);
        gv.mapLayer.addChild(this._draw);
        for(let i = 0; i < constantData.MAP_X; i++)
            for(let j = 0; j < constantData.MAP_Y; j++) {
                if (i < constantData.MAP_X - 1 && this.canDropTroop(cc.p(i, j)) != this.canDropTroop(cc.p(i + 1, j))) {
                    this._draw.drawSegment(
                        gv.isometricUtils.tilePosToIso(cc.p(i + 1, j)),
                        gv.isometricUtils.tilePosToIso(cc.p(i + 1, j + 1)),
                        1,
                        cc.color(255, 255, 255)
                    );
                }

                if (j < constantData.MAP_Y - 1 && this.canDropTroop(cc.p(i, j)) != this.canDropTroop(cc.p(i, j + 1))) {
                    this._draw.drawSegment(
                        gv.isometricUtils.tilePosToIso(cc.p(i, j + 1)),
                        gv.isometricUtils.tilePosToIso(cc.p(i + 1, j + 1)),
                        1,
                        cc.color(255, 255, 255)
                    );
                }
            }
    },

    checkAvailable: function(rect, objId) {
        for(let i = rect.x; i < rect.x + rect.width; i++)
            for(let j = rect.y; j < rect.y + rect.height; j++) {
                let id = this.getObjectId(cc.p(i, j));
                if (id != res.MapUI.buildings.id.grass && id != objId)
                    return false;
            }
        return true;
    },

    getAvailablePositionForRect: function(rect) {
        let centerPos = cc.p(Math.floor(constantData.MAP_X / 2), Math.floor(constantData.MAP_Y / 2));
        let maxSum = Math.max(centerPos.x, constantData.MAP_X - 1 - centerPos.x) + Math.max(centerPos.y, constantData.MAP_Y - 1 - centerPos.y);
        for (let sum = 0; sum <= maxSum; sum++) {
            for (let i = -sum; i <= sum; i++) {
                let j = sum - Math.abs(i);
                if (this.checkAvailable(cc.rect(centerPos.x + i, centerPos.y + j, rect.width, rect.height))) {
                    return cc.p(centerPos.x + i, centerPos.y + j);
                }
                j = -j;
                if (this.checkAvailable(cc.rect(centerPos.x + i, centerPos.y + j, rect.width, rect.height))) {
                    return cc.p(centerPos.x + i, centerPos.y + j);
                }
            }
        }
        return null;

    },

    getX3Grid: function() {
        return JSON.parse(JSON.stringify(this._x3Grid));
    },

    getGrid: function() {
        return JSON.parse(JSON.stringify(this._grid));
    }
});