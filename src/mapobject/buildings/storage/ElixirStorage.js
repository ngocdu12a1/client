/**
 * Created by Fersher_LOCAL on 7/13/2020.
 */


var ElixirStorage = StorageBuilding.extend({
    ctor: function(obj) {
        this._super(obj);
    },

    getMaxResLevel: function() {
        return 11;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.ElixirStorage.name;
    },

    getAttributeList: function() {
        let result = this._super();
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
        return "Nhà chứa dầu, nơi lưu trữ lượng dầu bạn đã sản xuất được, nếu bạn không có dầu thì nhà này không để làm gì";
    },

    getNameString: function() {
        return "Kho dầu";
    }
});
