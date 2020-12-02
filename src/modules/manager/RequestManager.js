/**
 * Created by Fersher_LOCAL on 7/20/2020.
 */

var RequestManager = cc.Class.extend({

    sendUpdateResourceRequest: function(gold, elixir, darkElixir, coin) {
        testnetwork.connector.sendUpdateResource(gold, elixir, darkElixir, coin);
    },

    sendGetCampaignInfoRequest: function() {
        testnetwork.connector.sendGetCampaignInfo();
    },

    handleGetUserResourceResponse: function(packet) {
        gv.shopUI.getResource(packet);
        gv.game_lobby.getResource(packet);
        gv.resourceManager.setUserCoin(packet.coin);
        gv.resourceManager.updateResourceStorage();
        //gv.mapLayer.scheduleOnce(function() {
        //    gv.objectManager.closeLackOfPopup();
        //}, 0.3);
        gv.objectManager.closeLackOfPopup();
    },

    handleGetTimestampResponse: function(timestamp) {
        gv.timeUtils.updateTimeOffset(timestamp * 1000);
    },

    //MAP INFO

    handleGetMapObjectCountResponse: function (objIdList) {
        for (let i = 0; i < objIdList.length; i++) {
            this.sendGetMapObjectInfoRequest(objIdList[i]);
        }
    },

    sendGetMapInfoListRequest: function() {
        testnetwork.connector.sendGetMapInfoListRequest();
    },

    handleGetMapInfoListResponse: function(objList) {
        for(let i = 0; i < objList.length; i++) {
            gv.objectManager.parseObject(objList[i]);
            //gv.screen_login.setProgressBarPercent(66+(i+1)/objList.length*34);
        }
        //update_offline 
        testnetwork.connector.sendUpdateTrainOffline();
        testnetwork.connector.sendGetTroopRequest();
        testnetwork.connector.sendGetTrainInfoRequest();
        testnetwork.connector.sendResource();
    },

    sendGetMapObjectInfoRequest: function (id) {
        testnetwork.connector.sendGetMapObjectInfoRequest(id);
    },

    handleBuildBuildingRequest: function (type) {
        gv.objectManager.startBuildingNewBuilding(type);
    },

    sendBuildNewBuildingRequest: function (type, x, y) {
        if (!this.checkEnoughResAndBuilder(res.MapUI.actionWithObject.build, res.MapUI.buildings.id.newBuilding, type == res.MapUI.buildings.type.BuilderHut.name))
            return;
        testnetwork.connector.sendBuildBuildingRequest(type, x, y);
    },

    handleBuildNewBuildingResponse: function (success, id, type, x, y, startActionTimestamp) {
        gv.objectManager.confirmBuild(success, id, type, x, y, startActionTimestamp);
    },

    sendMoveBuildingRequest: function (id, xOld, yOld, xNew, yNew) {
        testnetwork.connector.sendMoveBuildingRequest(id, xOld, yOld, xNew, yNew);
    },

    handleMoveBuildingResponse: function (success, id, xOld, yOld, xNew, yNew) {
        gv.objectManager.confirmMove(success, id, xOld, yOld, xNew, yNew);
    },

    handleGetMapObjectInfoResponse: function (object) {
        gv.objectManager.parseObject(object);
    },

    handleUpgradeBuildingRequest: function (id) {
        this.sendUpgradeBuildingRequest(id);
        //this.handleUpgradeBuildingResponse(id, Date.now() / 1000);
    },

    handleDeleteObstacleRequest: function (id) {
        this.sendDeleteObstacleRequest(id);
    },

    sendUpgradeBuildingRequest: function (id) {
        if (!this.checkEnoughResAndBuilder(res.MapUI.actionWithObject.upgrade, id, false))
            return;
        testnetwork.connector.sendUpgradeBuildingRequest(id);
    },

    handleUpgradeBuildingResponse: function (id, startActionTimestamp) {
        gv.objectManager.startBuildingAction(id, startActionTimestamp);
    },

    sendDeleteObstacleRequest: function (id) {
        if (!this.checkEnoughResAndBuilder(res.MapUI.actionWithObject.remove, id, false))
            return;
        testnetwork.connector.sendDeleteObstacleRequest(id);
    },

    handleDeleteObstacleResponse: function (id, startActionTimestamp) {
        gv.objectManager.startBuildingAction(id, startActionTimestamp);
    },

    onFinishUpgradeBuilding: function (id) {
        this.sendFinishUpgradeBuildingRequest(id);
        //this.handleFinishUpgradeBuildingResponse(id);
    },

    onFinishDeleteObstacle: function (id) {
        this.sendFinishDeleteObstacleRequest(id);
        //this.handleFinishUpgradeBuildingResponse(id);
    },

    sendFinishUpgradeBuildingRequest: function (id) {
        testnetwork.connector.sendFinishUpgradeBuildingRequest(id);
    },

    handleFinishUpgradeBuildingResponse: function (id) {
        gv.resourceManager.releaseBuilder(id);
        gv.objectManager.finishBuildingAction(id);
    },

    sendFinishDeleteObstacleRequest: function (id) {
        testnetwork.connector.sendFinishDeleteObstacleRequest(id);
    },

    handleFinishDeleteObstacleResponse: function (id) {
        gv.resourceManager.releaseBuilder(id);
        gv.objectManager.finishBuildingAction(id);
    },

    handleQuickFinishRequest: function (id, isBuilding) {
        this.sendQuickFinishRequest(id, isBuilding, Math.round(gv.timeUtils.getCurrentTimeMillis() / 1000));
        //this.handleQuickFinishResponse(true, id, 0);
    },

    sendQuickFinishRequest: function (id, isBuilding, timestamp) {
        if (!isBuilding)
            testnetwork.connector.sendSkipDeleteObstacleRequest(id, timestamp);
        else
            testnetwork.connector.sendSkipUpgradeBuildingRequest(id, timestamp);
    },

    handleQuickFinishResponse: function (success, id, timestamp) {
        if (success) {
            gv.resourceManager.releaseBuilder(id);
            gv.objectManager.finishBuildingAction(id);
            gv.objectManager.closeLackOfPopup();
        }
    },

    checkEnoughResAndBuilder: function(actionType, id, isBuilderHut) {
        let resList = gv.objectManager.getObjectRequiredResourceList(id);
        let lackOfResList = {};
        let isLackOfRes = false;
        for(let resType in resList) {
            if (resList.hasOwnProperty(resType)) {
                let totalRes = gv.resourceManager.getTotalResource(resType);
                if (totalRes < resList[resType]) {
                    lackOfResList[resType] = resList[resType] - totalRes;
                    isLackOfRes = true;
                }
            }
        }
        if (isLackOfRes) {
            gv.objectManager.showLackOfResPopup(actionType, id, lackOfResList);
            cc.log("Lack of Resources");
            return false;
        }
        if (!isBuilderHut && gv.resourceManager.getFreeBuilderHutCount() <= 0) {
            gv.objectManager.showLackOfBuilderPopup(actionType, id);
            cc.log("no builder left");
            return false;
        }
        return true;
    },

    handleLackOfPopupResponse: function(actionType, id) {
        switch (actionType) {
            case res.MapUI.actionWithObject.build:
                gv.objectManager.acceptBuild();
                break;
            case res.MapUI.actionWithObject.upgrade:
                this.sendUpgradeBuildingRequest(id);
                break;
            case res.MapUI.actionWithObject.remove:
                this.sendDeleteObstacleRequest(id);
                break;
        }
    },

    handleCancelBuildBuildingResponse: function(id) {
        gv.resourceManager.releaseBuilder(id);
        gv.objectManager.cancelBuildingAction(id);
    },

    handleCancelUpgradeBuildingResponse: function(id) {
        gv.resourceManager.releaseBuilder(id);
        gv.objectManager.cancelBuildingAction(id);
    },

    sendCancelBuildBuildingRequest: function(id) {
        testnetwork.connector.sendCancelBuildBuildingRequest(id);
    },

    sendCancelUpgradeBuildingRequest: function(id) {
        testnetwork.connector.sendCancelUpgradeBuildingRequest(id);
    },

    // TROOP
    handleGetTroopResponse: function (packet) {
        gv.troopManager.handleGetTroopResponse(packet.troops);
    },
    handleGetTrainInfoResponse: function (packet) {
        gv.trainManager.handleGetTrainInfoResponse(packet.trainingTroops);
    },
    handleTrainTroopResponse: function (packet) {
        gv.trainManager.handleTrainResponse(packet.type, packet.id);
    },
    handleSkipTroopResponse: function (packet) {
        gv.trainManager.handleSkipTroopResponse(packet.barrackID, packet.armyCampID, packet.timestamp);
    },
    handleCancelTroopResponse: function (packet) {
        gv.trainManager.handleCancelTroopResponse(packet.type, packet.id);
    },
    handleTrainTroopFinishResponse: function (packet) {
        gv.trainManager.handleTrainTroopFinishResponse(packet.barrackID, packet.armyCampID, packet.timestamp);
    },
    handleUpdateTrainOffline: function (packet){
    },

    sendEnterCampaignRequest: function(level) {
        testnetwork.connector.sendEnterCampaign(level);
    },

    handleEnterCampaignResponse: function(level, listBuilding, listTroop) {
        gv.objectManager = new ObjectBattleManager(level);
        fr.viewMultiples([BattleMapUI, BattleMapActionLayer]);
        gv.objectManager.initMapObject(listBuilding);
        gv.mapActionLayer.initTroop(listTroop);

    },

    handleGetCampaignInfoResponse: function(listCampaign, currentCampaign) {
        gv.game_lobby.openBattlePopup(listCampaign, currentCampaign);
    },

    sendStartCampaignRequest: function(listTroop) {
        testnetwork.connector.sendStartCampaign(listTroop);
    },

    handleStartCampaignResponse: function(listTroop) {
        gv.mapActionLayer.startBattle(listTroop);
    },

    handleDropTroopResponse: function(troopType, id, x, y, tick){
        //cc.log(troopType, id, x, y, tick);
    },

    sendEndCampaignRequest: function () {
        testnetwork.connector.sendEndCampaign(gv.objectManager.getTickCount());
    },

    handleEndCampaignResponse: function(gold, elixir, star) {
        gv.objectManager.handleEndBattleResponse(gold, elixir, star);
    }

});
