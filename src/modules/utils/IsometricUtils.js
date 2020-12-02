/**
 * Created by Fersher_LOCAL on 6/18/2020.
 */


var IsometricUtils = cc.Class.extend({
    tileWidth: res.MapUI.grassTileSize.width,
    tileHeight: res.MapUI.grassTileSize.height,
    rootPosition: res.MapUI.rootTilePosition,

    isoTo2D: function(p) {
        var temp = cc.p(0, 0);
        temp.y = (this.tileWidth * p.y - this.tileHeight * p.x) / 2;
        temp.x = (this.tileWidth * p.y + this.tileHeight * p.x) / 2;
        return temp;
    },

    twoDToIso: function(p) {
        var temp = cc.p(0, 0);
        temp.y = (p.x + p.y) / this.tileWidth;
        temp.x = (p.x - p.y) / this.tileHeight;
        return temp;
    },

    getTile2DSize: function() {
        var p = cc.p(this.tileWidth / 2, this.tileHeight / 2);
        var result = this.isoTo2D(p);
        return result.x;
    },

    /*
    Iso map root position is p(width / 2, 0)
     */
    isoToTilePos: function(pos) {
        var p = cc.p(pos.x, pos.y);
        //var p = pos;
        var twoDP = this.isoTo2D(p);
        var result = cc.p(0, 0);
        var tile2DSize = this.getTile2DSize();
        result.x = Math.floor(twoDP.x / tile2DSize);
        result.y = Math.floor(twoDP.y / tile2DSize);
        result.x -= this.rootPosition.x;
        result.y -= this.rootPosition.y;
        return result;
    },

    tilePosToIso: function(pos) {
        var p = cc.p(pos.x + this.rootPosition.x, pos.y + this.rootPosition.y);
        var tile2DSize = this.getTile2DSize();
        p.x *= tile2DSize;
        p.y *= tile2DSize;
        return this.twoDToIso(p);
    },


    // get center x3Tile of Tile postition
    tilePosToX3TilePos: function(pos) {
        return cc.p(pos.x * 3 + 1, pos.y * 3 + 1);
    },

    x3TilePosToTilePos: function(pos) {
        return cc.p(Math.floor(pos.x / 3), Math.floor(pos.y / 3));
    },

    x3TilePosToIso: function(pos) {
        var p = cc.p(pos.x + this.rootPosition.x * 3, pos.y + this.rootPosition.y * 3);
        var x3Tile2DSize = this.getTile2DSize() / 3;
        p.x *= x3Tile2DSize;
        p.y *= x3Tile2DSize;
        return this.twoDToIso(p);
    },

    isoToX3TilePos: function(pos) {
        var p = cc.p(pos.x, pos.y);
        //var p = pos;
        var twoDP = this.isoTo2D(p);
        var result = cc.p(0, 0);
        var tile2DSize = this.getTile2DSize() / 3;
        result.x = Math.floor(twoDP.x / tile2DSize);
        result.y = Math.floor(twoDP.y / tile2DSize);
        result.x -= this.rootPosition.x * 3;
        result.y -= this.rootPosition.y * 3;
        return result;
    },

    centerTilePosToIsoPos: function(pos) {
        let isoPos = this.tilePosToIso(cc.p(pos.x, pos.y));
        return cc.p(isoPos.x, isoPos.y + this.tileHeight / 2);
    },

    centerX3TilePosToIsoPos: function(pos) {
        let isoPos = this.x3TilePosToIso(cc.p(pos.x, pos.y));
        return cc.p(isoPos.x, isoPos.y + this.tileHeight / 6);
    }


});
