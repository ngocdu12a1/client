/**
 * Created by Fersher_LOCAL on 7/16/2020.
 */


var DarkElixirStorage = StorageBuilding.extend({

    ctor: function(obj) {
        this._super(obj);
    },

    getMaxResLevel: function() {
        return 6;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.DarkElixirStorage.name;
    },

    getAttributeList: function() {
        let result = this._super();
        result.darkElixirCapacity = {
            quantity: this.quantity,
            capacity: this.getDarkElixirCapacity()
        };
        return result;
    },

    getDarkElixirCapacity: function() {
        return this.getCapacity();
    },

    getInfo: function() {
        return "Kho lưu trữ dầu đen, nguyên liêu này quý hiếm đến nỗi rất nhiều người muốn cướp nó từ bạn, hãy đặt kho này ở một nơi an toàn";
    },

    getNameString: function() {
        return "Kho dầu đen";
    }
});
