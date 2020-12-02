/**
 * Created by Fersher_LOCAL on 6/22/2020.
 */


var MineBuilding = Building.extend({
    quantity: null,

    ctor: function(obj) {
        this.quantity = 0;
        this._super(obj);
    },

    updateBuildingAttribute: function(obj) {
        this._super(obj);
        if (obj.hasOwnProperty("quantity"))
            this.setQuantity(obj.quantity);
        else
            this.setQuantity(0);
    },

    setQuantity: function(quantity) {
        this.quantity = quantity;
    },

    harvest: function() {

    },

    getCapacity: function() {
        return this.getConfig()["capacity"];
    },

    getResourceType: function() {},

    getProductionRate: function() {
        let config = this.getConfig();
        return config["productivity"];
    }
    
});
