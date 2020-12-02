/**
 * Created by Fersher_LOCAL on 7/7/2020.
 */


var GoldStorage = StorageBuilding.extend({
    ctor: function(obj) {
        this._super(obj);
    },

    getMaxResLevel: function() {
        return 11;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.GoldStorage.name;
    },

    getAttributeList: function() {
        let result = this._super();
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
        return "Tất cả lượng vàng bạn đào ra được đều được cất ở đây, hãy cố tích lũy thật nhiều vàng để ngôi nhà này trở nên đầy ắp";
    },

    getNameString: function() {
        return "Kho vàng";
    }
});