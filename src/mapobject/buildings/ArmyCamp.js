/**
 * Created by Fersher_LOCAL on 6/22/2020.
 */


var ArmyCamp = Building.extend({
    trainQueue: null,
    trainTimestamp: null,

    ctor: function(obj) {
        this.maxResLevel = 8;
        this._super(obj);

    },

    getTroopCapacity: function() {
        return this.getConfig()["capacity"];
    },

    getMaxResLevel: function() {
        return 8;
    },

    initSprite: function() {
        this._super();
    },

    getAnimatedSpriteScale: function() {
        if (this.level == 1) {
            return 1.3;
        } else if (this.level < 6) {
            return 1;
        } else {
            return 1.4;
        }
    },

    getAttributeList: function () {
        let result = this._super();
        result["troopCapacity"] = this.getTroopCapacity();
        return result;
    },

    getAnimatedPathList: function() {
        if (this.level >= 7) {
            return ["00.png", "01.png", "02.png", "03.png", "04.png", "05.png", "06.png", "07.png", "08.png", "09.png", "10.png", "11.png", "12.png", "13.png", "14.png"];
        }
        return res.MapUI.buildings.type.ArmyCamp.animated;
    },

    unlock: function() {},

    updateTimestamp: function() {},

    skip: function() {},

    getAcronym: function () {
        return res.MapUI.buildings.type.ArmyCamp.name;
    },

    getInfo: function() {
        return "Đây là trại lính, nơi quân lính nghỉ ngơi lấy lại sức sau mỗi trận đánh lớn. Với những chiến binh này, không gì vui hơn việc quây quần bên lửa trại cùng nhau";
    },

    getNameString: function() {
        return "Trại lính";
    }

});