/**
 * Created by Fersher_LOCAL on 6/22/2020.
 */


var GoldMine = MineBuilding.extend({

    ctor: function(obj) {
        this._super(obj);
    },

    getMaxResLevel: function() {
        return 11;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.GoldMine.name;
    },

    getAnimatedPathList: function() {
        return res.MapUI.buildings.type.GoldMine.animated;
    },

    getAttributeList: function() {
        let result = this._super();
        result.goldProductionRate = this.getProductionRate();
        result.goldCapacity = {
            quantity: this.quantity,
            capacity: this.getGoldCapacity()
        };
        return result;
    },

    getGoldCapacity: function() {
        return this.getCapacity();
    },

    getInfo: function() {
        return "Nhà đào vàng. có nhà này thì có nhiều vàng, làm nhiều thì nhiều vàng, làm ít thì ít vàng, không làm thì ...";
    },

    getNameString: function() {
        return "Mỏ vàng";
    }
});