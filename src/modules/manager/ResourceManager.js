/**
 * Created by Fersher_LOCAL on 7/14/2020.
 */


var ResourceManager = cc.Class.extend({
    userCoin: null,

    setUserCoin: function(coin) {
        this.userCoin = coin;
        //cc.log(this.userCoin);
    },


    getUserCoin: function() {
        return this.userCoin;
    },

    getTotalBuildingListId: function() {
        return gv.objectManager.getBuildingIdList();
    },

    getBuildingQuantity: function(type) {
        let listObj = gv.objectManager.getListObjectByType(type);
        return listObj.length;
    },

    getTownHallLevel: function() {
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.TownHall.name);
        return listObj[0].getLevel();
    },

    getArmyCampListPosition: function() {
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.ArmyCamp.name);
        let result = [];
        for(let i = 0; i < listObj.length; i++) {
            result.push(cc.p(listObj[i].getIdleSprite().x, listObj[i].getIdleSprite().y));
        }
        return result;
    },

    getTotalTroopCapacity: function() {
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.ArmyCamp.name);
        let result = 0;
        for(let i = 0; i < listObj.length; i++) if (listObj[i].getLevel() > 0) {
            result += listObj[i].getTroopCapacity();
        }
        return result;

    },

    getArmyCampPositionById: function(id){
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.ArmyCamp.name);
        listObj = listObj.filter(function(obj){
            return obj.id == id;
        });
        return cc.p(listObj[i].getIdleSprite().x, listObj[i].getIdleSprite().y);
    },

    getBarrackListPosition: function() {
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.Barrack.name);
        let result = [];
        for(let i = 0; i < listObj.length; i++) {
            result.push(gv.isometricUtils.tilePosToIso(cc.p(listObj[i].x, listObj[i].y)));
        }
        return result;
    },

    getTotalResource: function(resType) {
        if (resType == res.ResourceType.coin) {
            return this.getUserCoin();
        }
        let storageName = gv.objectUtils.getStorageNameByResource(resType);
        let listObj = gv.objectManager.getListObjectByType(storageName);
        let townHall = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.TownHall.name)[0];
        let result = 0;
        if (townHall != null) {
            switch(resType) {
                case res.ResourceType.gold:
                    result += townHall.getGoldQuantity();
                    break;
                case res.ResourceType.elixir:
                    result += townHall.getElixirQuantity();
                    break;
                case res.ResourceType.darkElixir:
                    result += townHall.getDarkElixirQuantity();
                    break;
            }
        }
        for(let i = 0; i < listObj.length; i++) {
            result += listObj[i].getResourceQuantity();
        }
        return result;
    },

    getTotalCapacity: function(resType) {
        let storageName = gv.objectUtils.getStorageNameByResource(resType);
        let listObj = gv.objectManager.getListObjectByType(storageName);
        let townHall = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.TownHall.name)[0];
        let result = 0;
        if (townHall != null) {
            switch(resType) {
                case res.ResourceType.gold:
                    result += townHall.getGoldCapacity();
                    break;
                case res.ResourceType.elixir:
                    result += townHall.getElixirCapacity();
                    break;
                case res.ResourceType.darkElixir:
                    result += townHall.getDarkElixirCapacity();
                    break;
            }
        }
        for(let i = 0; i < listObj.length; i++) if (listObj[i].getLevel() > 0) {
            result += listObj[i].getCapacity();
        }
        return result;
    },

    getFreeBuilderHutId: function() {
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.BuilderHut.name);
        for(let i = 0; i < listObj.length; i++) {
            if (!listObj[i].isAssigned())
                return listObj[i].getId();
        }
        return null;
    },

    getFreeBuilderHutCount: function() {
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.BuilderHut.name);
        let result = 0;
        for(let i = 0; i < listObj.length; i++) {
            if (!listObj[i].isAssigned())
                result += 1;
        }
        return result;
    },

    releaseBuilder: function(id) {
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.BuilderHut.name);
        for(let i = 0; i < listObj.length; i++) {
            if (listObj[i].getTargetId() == id)
                listObj[i].releaseBuilder(id);
        }
    },

    updateResourceStorage: function() {
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.DarkElixirStorage.name);
        listObj = listObj.concat(gv.objectManager.getListObjectByType(res.MapUI.buildings.type.GoldStorage.name));
        listObj = listObj.concat(gv.objectManager.getListObjectByType(res.MapUI.buildings.type.ElixirStorage.name));
        listObj = listObj.concat(gv.objectManager.getListObjectByType(res.MapUI.buildings.type.TownHall.name));
        for(let i = 0; i < listObj.length; i++) {
            gv.requestManager.sendGetMapObjectInfoRequest(listObj[i].getId());
        }
    },

    getLeastRemainingTimeBuilderHut: function() {
        let listObj = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.BuilderHut.name);
        let result = null;
        for(let i = 0; i < listObj.length; i++) {
            if (listObj[i].isAssigned()) {
                if (result == null || result.remainingTime < gv.objectManager.getObjectBuildingActionRemainingTime(listObj[i].getTargetId())) {
                    result = {
                        targetId: listObj[i].getTargetId(),
                        remainingTime: gv.objectManager.getObjectBuildingActionRemainingTime(listObj[i].getTargetId()),
                        targetIsBuilding: gv.objectManager.getObjectById(listObj[i].getTargetId()).isBuilding()
                    }
                }
            }
        }
        return result;
    }
});
