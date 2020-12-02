/**
 * Created by Fersher_LOCAL on 7/16/2020.
 */

var DarkElixirCollector = MineBuilding.extend({

    ctor: function(obj) {
        this._super(obj);
    },

    getMaxResLevel: function() {
        return 6;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.DarkElixirCollector.name;
    },

    getAttributeList: function() {
        let result = this._super();
        result.darkElixirProductionRate = this.getProductionRate();
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
        return "Nhà này cũng đào dầu, nhưng là dầu đen, loại nguyên liệu quý hiếm nhất trò chơi, một số tộc người cổ xưa còn lưu truyền dầu này có thể hồi sinh người chết";
    },

    getNameString: function() {
        return "Mỏ dầu đen";
    }
});