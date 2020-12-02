/**
 * Created by Fersher_LOCAL on 7/7/2020.
 */


var ElixirCollector = MineBuilding.extend({

    ctor: function(obj) {
        this._super(obj);
    },

    getMaxResLevel: function() {
        return 11;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.ElixirCollector.name;
    },


    getAnimatedPathList: function() {
        return res.MapUI.buildings.type.ElixirCollector.animated;
    },

    getAttributeList: function() {
        let result = this._super();
        result.elixirProductionRate = this.getProductionRate();
        result.elixirCapacity = {
            quantity: this.quantity,
            capacity: this.getElixirCapacity()
        };
        return result;
    },

    getElixirCapacity: function() {
        return this.getCapacity();
    },

    getInfo: function() {
        return "Nhà đào dầu. có nhà này thì có nhiều dầu, làm nhiều thì nhiều dầu, làm ít thì ít dầu, không làm thì ...";
    },

    getNameString: function() {
        return "Mỏ dầu";
    },

    getJunkBuildingPath: function() {
        return res.BattleUI.effect.junkElixirDrill;
    }
});
