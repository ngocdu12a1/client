/**
 * Created by Fersher_LOCAL on 7/13/2020.
 */

var StorageBuilding = Building.extend({
    ctor: function(obj) {

        this._super(obj);
        //this.setQuantity(1500);
    },

    updateBuildingAttribute: function(obj) {
        if (obj.hasOwnProperty("quantity"))
            this.setQuantity(obj["quantity"]);
        else
            this.setQuantity(0);
    },

    setQuantity: function(quantity) {

        this.quantity = quantity;
        for(let id in this.spriteList) {
            if (this.spriteList.hasOwnProperty(id)) {
                this.spriteList[id].setLocalZOrder(res.MapUI.zPosition.invisible);
            }
        }
    },

    getResourceQuantity: function() {
        return this.quantity;
    },

    getCapacity: function() {
        let config = this.getConfig();
        return config["capacity"];
    },

    getIdleSprite: function() {
        let rate = this.quantity / this.getCapacity();
        switch (true) {
            case (rate >= 0 && rate < 0.25):
                return this.spriteList["1"];
            case (rate >= 0.25 && rate < 0.5):
                return this.spriteList["2"];
            case (rate >= 0.5 && rate < 0.75):
                return this.spriteList["3"];
            case (rate >= 0.75):
                return this.spriteList["4"];
        }

    },

    getIdleList: function() {
        return {
            "1" : "image0000.png",
            "2" : "image0001.png",
            "3" : "image0002.png",
            "4" : "image0003.png"
        }
    }
});