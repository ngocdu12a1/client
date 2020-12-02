/**
 * Created by Fersher_LOCAL on 7/16/2020.
 */

var Cannon = DefenceBuilding.extend({
    ctor: function(obj){
        this._super(obj);
    },

    getAnimatedPathList: function() {
        return res.MapUI.buildings.type.Cannon.animated;  
    },

    getAttackLen: function() {
        return res.MapUI.buildings.type.Cannon.attackLen;
    },

    getMaxResLevel: function() {
        return 10;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.Cannon.name;
    },

    getInfo: function() {
        return "Đây là khẩu pháo, bắn bùm bùm";
    },

    getNameString: function() {
        return "Khẩu pháo";
    },

    getDefenceType: function() {
        return res.BattleUI.defenceType.cannon;
    }

});
