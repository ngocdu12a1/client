/**
 * Created by Fersher_LOCAL on 7/23/2020.
 */


var Wall = Building.extend({
    ctor: function(obj) {
        this._super(obj);
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.Wall.name;
    },

    getMaxResLevel: function() {
        return 7;
    },

    getNameString: function() {
        return "Tường thành";
    },

    getInfo: function() {
        return "Tường thành là một công cụ hữu hiệu giúp làm chậm kẻ địch, giá của chúng cũng rất rẻ";
    },

    getIdleList: function() {
        return {
            "0" : "image0000.png",
            "1" : "image0001.png",
            "2" : "image0002.png",
            "3" : "image0003.png"
        }
    },

    setPosition: function(p) {
        let posChanged = false;
        if (p.x != this.x || p.y != this.y) {
            posChanged = true;
        }
        if (posChanged && this.x != null) {
            this.updateSurroundingWall();
        }
        this._super(p);
        if (posChanged) {
            this.updateSurroundingWall();
        }
    },

    updateSurroundingWall: function() {
        let leftObj = gv.objectManager.getObjectByTilePos(cc.p(this.x - 1, this.y));
        let belowObj = gv.objectManager.getObjectByTilePos(cc.p(this.x, this.y - 1));
        if (leftObj != null && leftObj.getId() != this.getId() && leftObj.getAcronym() == res.MapUI.buildings.type.Wall.name)
            leftObj.setPosition(cc.p(leftObj.x, leftObj.y));
        if (belowObj != null && belowObj.getId() != this.getId() && belowObj.getAcronym() == res.MapUI.buildings.type.Wall.name)
            belowObj.setPosition(cc.p(belowObj.x, belowObj.y));
    },

    startBuildingAction: function(startActionTimestamp) {
        this.onFinishBuildingAction();
    },

    getIdleSprite: function() {
        let rightObj = gv.objectManager.getObjectByTilePos(cc.p(this.x + 1, this.y));
        let upperObj = gv.objectManager.getObjectByTilePos(cc.p(this.x, this.y + 1));
        let num = 0;
        if (rightObj != null && rightObj.getId() != this.getId() && rightObj.getAcronym() == res.MapUI.buildings.type.Wall.name) {
            num |= 1;
        }
        if (upperObj != null && upperObj.getId() != this.getId() && upperObj.getAcronym() == res.MapUI.buildings.type.Wall.name) {
            num |= 2;
        }
        this.spriteList[num.toString()].setLocalZOrder(gv.objectUtils.getObjectZOrder(cc.p(this.x + Math.ceil(this.width / 2) - 1, this.y + Math.ceil(this.height / 2) - 1)));
        for(let i = 0; i < 4; i++) if (i != num) {
            this.spriteList[i.toString()].setLocalZOrder(res.MapUI.zPosition.invisible);
        }

        return this.spriteList[num.toString()];
    },

    getJunkBuildingPath: function() {
        let result = [res.BattleUI.effect.junkWall0, res.BattleUI.effect.junkWall1, res.BattleUI.effect.junkWall2];
        return result[Math.floor(Math.random() * result.length)];
    },
    
    isWall: function() {
        return true;
    }
});