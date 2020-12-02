/**
 * Created by Fersher_LOCAL on 7/20/2020.
 */


var Mortar = DefenceBuilding.extend({
    ctor: function(obj){
        this._super(obj);
    },

    getAnimatedPathList: function() {
        return res.MapUI.buildings.type.Mortar.animated;
    },

    getMaxResLevel: function() {
        return 8;
    },

    getAttackLen: function() {
        return res.MapUI.buildings.type.Mortar.attackLen;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.Mortar.name;
    },

    getInfo: function() {
        return "Khẩu pháo này có sát thương cực lớn và tầm bắn xa, tuy nhiên nó lại không hoạt động ở gần, vì vậy hãy đặt nó ở sâu trong cứ địa của bạn";
    },

    getNameString: function() {
        return "Pháo cao xạ";
    },

    getIdleList: function() {
        return {};
    },

    getDefenceType: function() {
        return res.BattleUI.defenceType.mortar;
    }

});
