/**
 * Created by Fersher_LOCAL on 7/7/2020.
 */


var Barrack = Building.extend({
    ctor: function(obj) {
        this._super(obj);
    },

    getMaxResLevel: function() {
        return 12;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.Barrack.name;
    },

    getAnimatedPathList: function() {
        if (this.level < 4 || this.level > 8)
            return [];
        else
            return res.MapUI.buildings.type.Barrack.animated;
    },

    getAction: function() {
        let result = this._super();
        if (!this.isInBuildingAction) {
            result.push(res.MapUI.action.type.train_troop.name);
        }
        return result;
    },

    finishBuildingAction: function() {
        this._super();
        gv.trainManager.addBarrack(this.getId(), this.getLevel());
    },

    getInfo: function() {
        return "Nhà này tuyển quân đánh nhau";
    },

    getNameString: function() {
        return "Nhà lính";
    }

});
