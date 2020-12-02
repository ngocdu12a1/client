/**
 * Created by CPU60126_LOCAL on 2020-06-24.
 */

var constantData = {
    MAP_X: 44,
    MAP_Y: 44
};


var DataWrapper = cc.Class.extend({
    data: {},

    ctor: function() {
        this.loadJsonConfig();
    },

    loadJsonConfig: function() {
        this.data["defenceBase"] = {};
        this.data["troopBase"] = {};
        cc.loader.loadJson("res/config/Config.json", function(error, data){
            for (var i = 0; i < data["objects"].length; i++) {
                this.loadJsonData(data["objects"][i]);
            }
        }.bind(this));
    },

    loadJsonData: function(object) {
        cc.loader.loadJson("res/config/"+object+".json", function(error, data){
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if (object == "DefenceBase"){
                        this.data["defenceBase"][key] = data[key];
                    } else if (object == "TroopBase") {
                        this.data["troopBase"][key] = data[key];
                    } else {
                        this.data[key] = data[key];
                    }
                }
            }
        }.bind(this));
    },

    getBuildingConfig: function(type, level) {
        return this.data[type][level.toString()];
    },
    getTroopConfig: function(type, level){
        return this.data[type][level.toString()];
    },
    getTroopBaseConfig: function(type) {
        return this.data["troopBase"][type];
    },
    getObstacleConfig: function(type) {
        return this.data[type]["1"];
    },
    getBuildingMaxLevel: function(type) {
        let count = 0;
        for(let key in this.data[type]) {
            count += 1;
        }
        return count;
    },
    getDefenceBuildingConfig: function(type, level) {
        let res = {};
        for(let key in this.data[type][level.toString()]){
            if (this.data[type][level.toString()].hasOwnProperty(key)) {
                res[key] = this.data[type][level.toString()][key];
            }
        }
        for(let key in this.data["defenceBase"][type]) {
            if (this.data["defenceBase"][type].hasOwnProperty(key)) {
                res[key] = this.data["defenceBase"][type][key];
            }
        }
        return res;
    }
});
