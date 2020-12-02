/**
 *
 * Created by Fersher_LOCAL on 7/20/2020.
 */


var AirDefense = DefenceBuilding.extend({
    ctor: function(obj){
        this._super(obj);
    },

    getAnimatedPathList: function() {
        return res.MapUI.buildings.type.AirDefense.animated;
    },

    getAttackLen: function() {
        return res.MapUI.buildings.type.AirDefense.attackLen;
    },

    getMaxResLevel: function() {
        return 8;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.AirDefense.name;
    },

    getInfo: function() {
        return "Bom bay là nỗi khiếp sợ của mọi công trình phòng thủ, vì vậy nhà quân sư đại tài của chúng ta, Gia Cát Minh đã tạo ra thiết bị phòng thủ này để chống lại chúng";
    },

    getNameString: function() {
        return "Pháo phòng không";
    },

    getIdleList: function () {
        return {};
    },

    getDefenceType: function() {
        return res.BattleUI.defenceType.airDefence;
    }

});
