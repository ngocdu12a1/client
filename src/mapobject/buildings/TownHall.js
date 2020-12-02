/**
 * Created by Fersher_LOCAL on 6/22/2020.
 */


var TownHall = Building.extend({
    goldQuantity: 0,
    elixirQuantity: 0,
    darkElixirQuantity: 0,

    ctor: function(obj) {
        this._super(obj);
    },

    getMaxResLevel: function() {
        return 10;
    },

    updateBuildingAttribute: function(obj) {
        this._super(obj);
        if (obj.hasOwnProperty("gold"))
            this.setGoldQuantity(obj.gold);
        else
            this.setGoldQuantity(0);
        if (obj.hasOwnProperty("elixir"))
            this.setElixirQuantity(obj.elixir);
        else
            this.setElixirQuantity(0);
        if (obj.hasOwnProperty("darkElixir"))
            this.setDarkElixirQuantity(obj.darkElixir);
        else
            this.setDarkElixirQuantity(0);
    },

    setGoldQuantity: function(quantity) {
        this.goldQuantity = quantity;
    },

    setElixirQuantity: function(quantity) {
        this.elixirQuantity = quantity;
    },

    setDarkElixirQuantity: function(quantity) {
        this.darkElixirQuantity = quantity;
    },

    getElixirQuantity: function() {
        return this.elixirQuantity;
    },

    getDarkElixirQuantity: function() {
        return this.darkElixirQuantity;
    },

    getGoldQuantity: function() {
        return this.goldQuantity;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.TownHall.name;
    },

    getAction: function() {
        var result = this._super();
        result.push(res.MapUI.action.type.share.name);
        return result;
    },

    getAttributeList: function() {
        let result = this._super();
        result.goldCapacity = {
            quantity: this.goldQuantity,
            capacity: this.getGoldCapacity()
        };
        result.elixirCapacity = {
            quantity: this.elixirQuantity,
            capacity: this.getElixirCapacity()
        };
        return result;
    },

    getInfo: function() {
        return "Đây là nhà chính, không có nhà chính thì không có gì hết";
    },

    getNameString: function() {
        return "Nhà chính";
    },

    getJunkBuildingPath: function() {
        return res.BattleUI.effect.junkTownHall;
    }
});
