/**
 * Created by Fersher_LOCAL on 7/7/2020.
 */


var Obstacle = MapObject.extend({

    obsType: null,

    ctor: function(obj) {
        this.obsType = obj.type.substring(3, obj.type.length);
        this._super(obj);
    },

    getResPath: function() {
        return "OBS" + "/" +
                this.getAcronym();
    },

    finishBuildingAction: function() {
        this._super();
        gv.objectManager.removeObject(this);
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.Obstacle.name + this.obsType;
    },

    getConfig: function() {
        return gv.dataWrapper.getObstacleConfig(this.getAcronym());
    },

    getBuildingActionTime: function() {
        return this.getDeleteTime();
    },

    getBuildingActionResource: function() {
        return this.getDeleteResource();
    },

    getAction: function() {
        var result = [];
        if (!this.isInBuildingAction)
            result.push(res.MapUI.action.type.remove.name);
        else
            result.push(res.MapUI.action.type.quick_finish.name);
        return result;
    },

    getDeleteTime: function() {
        var newConfig = this.getConfig();
        return newConfig["buildTime"];
    },

    getDeleteResource: function() {
        let newConfig = this.getConfig();
        let resourceType = res.ResourceType;
        let result = {};
        for(let key in resourceType) {
            if (resourceType.hasOwnProperty(key) && newConfig.hasOwnProperty(resourceType[key]) && newConfig[resourceType[key]] != 0) {
                result[resourceType[key]] = newConfig[resourceType[key]];
            }
        }
        return result;
    },

    onFinishBuildingAction: function() {
        gv.requestManager.onFinishDeleteObstacle(this.getId());
    },

    getNameString: function() {
        return "Chướng ngại vật";
    }

});
