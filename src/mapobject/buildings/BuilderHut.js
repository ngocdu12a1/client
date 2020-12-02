/**
 * Created by Fersher_LOCAL on 6/22/2020.
 */


var BuilderHut = Building.extend({
    targetId: null,

    ctor: function(obj) {
        this.targetId = -1;
        this._super(obj);
    },

    updateBuildingAttribute: function(obj) {
        if (obj.hasOwnProperty("targetID"))
            this.targetId = obj["targetID"];
    },

    getMaxResLevel: function() {
        return 1;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.BuilderHut.name;
    },

    startBuildingAction: function() {
        this.level = 1;
        //do nothing
    },

    getResPath: function() {
        return this.getAcronym();
    },

    canBeUpgrade: function () {
        return false;
    },

    getInfo: function() {
        return "Nhà ở của thợ xây";
    },

    getNameString: function() {
        return "Nhà thợ xây";
    },

    assignToBuilding: function(id) {
        return this.targetId = id;
    },

    isAssigned: function() {
        return this.targetId != -1;
    },

    getTargetId: function() {
        return this.targetId;
    },

    releaseBuilder: function() {
        this.targetId = -1;
    },

    getBuildingActionResource: function() {
        let newConfig = gv.dataWrapper.getBuildingConfig(this.getAcronym(), Math.min(5, gv.resourceManager.getBuildingQuantity(res.MapUI.buildings.type.BuilderHut.name) + 1));
        let resourceType = res.ResourceType;
        let result = {};
        for(let key in resourceType) {
            if (resourceType.hasOwnProperty(key) && newConfig.hasOwnProperty(resourceType[key]) && newConfig[resourceType[key]] != 0) {
                result[resourceType[key]] = newConfig[resourceType[key]];
            }
        }
        return result;
    }
});
