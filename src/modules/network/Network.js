/**
 * Created by KienVN on 10/2/2017.
 */

var gv = gv||{};
var testnetwork = testnetwork||{};

gv.CONSTANT = gv.CONSTANT ||{};
gv.CONSTANT.USERID = 1;

testnetwork.Connector = cc.Class.extend({

    ctor:function(gameClient)
    {
        this.gameClient = gameClient;
        gameClient.packetFactory.addPacketMap(testnetwork.packetMap);
        gameClient.receivePacketSignal.add(this.onReceivedPacket, this);
        this._userId = 0;
    },
    onReceivedPacket:function(cmd, packet)
    {
        // cc.log("onReceivedPacket:", cmd);
        switch (cmd)
        {
            case gv.CMD.HAND_SHAKE:
                this.sendLoginRequest();
                gv.screen_login.setProgressBarPercent(33);
                break;

            //User Info
            case gv.CMD.USER_LOGIN:
                fr.getCurrentScreen().onFinishLogin();
                gv.screen_login.setProgressBarPercent(66);
                break;
            case gv.CMD.GET_USER_RESOURCE_INFO:
                gv.requestManager.handleGetUserResourceResponse(packet);
                cc.log("Get User Resource!");
                break;
            case gv.CMD.GET_USERNAME:
                gv.game_lobby.setUsername(packet);
                break;
            case gv.CMD.GET_TIMESTAMP:
                if (packet.getError() != 0) {
                    cc.log("Get Timestamp response error");
                    break;
                }
                cc.log(JSON.stringify(packet), Date.now().toString());
                gv.requestManager.handleGetTimestampResponse(packet.timestamp);
                break;

            //Map Info
            case gv.CMD.GET_MAP_INFO_LIST:
                if (packet.getError() != 0) {
                    cc.log("Get Map Info List error");
                    break;
                }
                gv.requestManager.handleGetMapInfoListResponse(packet.objList);
                break;
            case gv.CMD.GET_MAP_OBJECT_COUNT:
                if (packet.getError() != 0) {
                    cc.log("Get Map Object Count Response error");
                    break;
                }
                gv.requestManager.handleGetMapObjectCountResponse(packet.objIdList);
                break;
            case gv.CMD.GET_MAP_OBJECT_INFO:
                if (packet.getError() != 0) {
                    cc.log("Get Map Object Info Response error");
                    break;
                }
                gv.requestManager.handleGetMapObjectInfoResponse(packet);
                break;
            case gv.CMD.MOVE_BUILDING:
                if (packet.getError() != 0) {
                    cc.log("Move Building Response error");
                }
                cc.log(JSON.stringify(packet));
                gv.requestManager.handleMoveBuildingResponse(packet.getError() == 0, packet.id, packet.xOld, packet.yOld, packet.xNew, packet.yNew);
                break;
            case gv.CMD.BUILD_BUILDING:
                if (packet.getError() != 0) {
                    cc.log("Build building response error");
                }
                cc.log(JSON.stringify(packet));
                gv.requestManager.handleBuildNewBuildingResponse(packet.getError() == 0, packet.id, packet.type, packet.x, packet.y, packet.startActionTimestamp);
                break;
            case gv.CMD.FINISH_UPGRADE_BUILDING:
                if (packet.getError() != 0) {
                    cc.log("Finish upgrade building response error");
                    break;
                }
                gv.requestManager.handleFinishUpgradeBuildingResponse(packet.id);
                break;
            case gv.CMD.FINISH_DELETE_OBSTACLE:
                if (packet.getError() != 0) {
                    cc.log("Finish delete obstacle response error");
                    break;
                }
                gv.requestManager.handleFinishDeleteObstacleResponse(packet.id);
                break;
            case gv.CMD.UPGRADE_BUILDING:
                if (packet.getError() != 0) {
                    cc.log("Upgrade building response error");
                    break;
                }
                cc.log(packet.getError());
                gv.requestManager.handleUpgradeBuildingResponse(packet.id, packet.startActionTimestamp);
                break;
            case gv.CMD.DELETE_OBSTACLE:
                if (packet.getError() != 0) {
                    cc.log("Delete Obstacle response error");
                    break;
                }
                gv.requestManager.handleDeleteObstacleResponse(packet.id, packet.startActionTimestamp);
                break;
            case gv.CMD.SKIP_UPGRADE_BUILDING:
            case gv.CMD.SKIP_DELETE_OBSTACLE:
                if (packet.getError() != 0) {
                    cc.log("Skip Building Action Error", packet.id.toString());
                    break;
                }
                gv.requestManager.handleQuickFinishResponse(packet.getError() == 0, packet.id, packet.startActionTimestamp);
                break;
            case gv.CMD.CANCEL_BUILD_BUILDING:
                if (packet.getError() != 0) {
                    cc.log("Cancel Build Building Error", packet.id.toString());
                    break;
                }
                gv.requestManager.handleCancelBuildBuildingResponse(packet.id);
                break;
            case gv.CMD.CANCEL_UPGRADE_BUILDING:
                if (packet.getError() != 0) {
                    cc.log("Cancel Upgrade Building Error", packet.id.toString());
                    break;
                }
                gv.requestManager.handleCancelUpgradeBuildingResponse(packet.id);
                break;


            //Troop Info
            case gv.CMD.GET_TROOP:
                if (packet.getError() != 0){
                    cc.log("Get troop list error");
                    break;
                }
                gv.requestManager.handleGetTroopResponse(packet);
                // gv.troopManager.handleGetTroopResponse(packet.troops);
                cc.log(JSON.stringify(packet.troops));
                break;
            case gv.CMD.GET_TRAIN_INFO:
                if (packet.getError() != 0){
                    cc.log("Get train info error");
                    break;
                }
                gv.requestManager.handleGetTrainInfoResponse(packet);
                // gv.trainManager.handleGetTrainInfoResponse(packet.trainingTroops);
                break;
            case gv.CMD.TRAIN_TROOP:
                if (packet.getError() != 0){
                    cc.log("Train troop error", packet.id, packet.type);
                    return;
                }
                gv.requestManager.handleTrainTroopResponse(packet);
                // gv.trainManager.handleTrainResponse(packet.type, packet.id);
                break;
            case gv.CMD.SKIP_TROOP:
                if (packet.getError() != 0){
                    cc.log("skip error");
                    break;
                }
                gv.requestManager.handleSkipTroopResponse(packet);
                gv.trainManager.handleSkipTroopResponse(packet.barrackID, packet.armyCampID, packet.timestamp);
                break;
            case gv.CMD.CANCEL_TROOP:
                if (packet.getError() != 0){
                    cc.log("cancel error");
                    break;
                }
                gv.requestManager.handleCancelTroopResponse(packet);
                // gv.trainManager.handleCancelTroopResponse(packet.type, packet.id);
                break;
            case gv.CMD.TRAIN_TROOP_FINISH:
                if (packet.getError() != 0){
                    cc.log("finish error");
                    break;
                }
                gv.requestManager.handleTrainTroopFinishResponse(packet);
                // gv.trainManager.handleTrainTroopFinishResponse(packet.barrackID, packet.armyCampID, packet.timestamp);
                break;
            case gv.CMD.UPDATE_TRAIN_OFFLINE:
                if (packet.getError() != 0){
                    cc.log("update offline error");
                    break;
                }
                gv.requestManager.handleUpdateTrainOffline(packet);
                break;

            // Attack Map Info
            case gv.CMD.ENTER_CAMPAIGN:
                if (packet.getError() != 0) {
                    cc.log("enter campaign error");
                    break;
                }
                gv.requestManager.handleEnterCampaignResponse(packet.level, packet.listBuilding, packet.listTroop);
                break;

            case gv.CMD.GET_CAMPAIGN_INFO:
                if (packet.getError() != 0) {
                    cc.log("Get campaign info error");
                    break;
                }
                cc.log(JSON.stringify(packet));
                gv.requestManager.handleGetCampaignInfoResponse(packet.listCampaign, packet.currentCampaign);
                break;

            case gv.CMD.START_CAMPAIGN:
                if (packet.getError() != 0) {
                    cc.log("Start campaign error");
                    break;
                }
                gv.requestManager.handleStartCampaignResponse(packet.listTroop);
                break;

            case gv.CMD.DROP_TROOP:
                if (packet.getError() != 0){
                    cc.log("Drop troop error");
                    break;
                }
                gv.requestManager.handleDropTroopResponse(packet.troopType, packet.id, packet.x, packet.y, packet.tick);
                break;

            case gv.CMD.END_CAMPAIGN:
                if (packet.getError() != 0) {
                    cc.log("End Campaign Error");
                    break;
                }
                cc.log(JSON.stringify(packet));
                gv.requestManager.handleEndCampaignResponse(packet.gold, packet.elixir, packet.star);
                break;

            //Demo Info
            case gv.CMD.RESET_MAP:
               fr.getCurrentScreen().reset();
               break;
            case gv.CMD.MAP_INFO:
               fr.getCurrentScreen().updateMap(packet);
               break;
        }
    },

    sendLoginRequest: function () {
        cc.log("sendLoginRequest");
        let pk = this.gameClient.getOutPacket(CmdSendLogin);
        pk.pack("", gv.CONSTANT.USERID); //sessionkey sử dụng khi làm login social, ở bản dev thì để trống
        this.gameClient.sendPacket(pk);
    },
    //User Info
    sendResource: function(){
        //cc.log("send resource");
        let pk = this.gameClient.getOutPacket(CmdSendUserResource);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendUpdateResource: function(gold, elixir, darkElixir, coin){
        //cc.log("send resource");
        let pk = this.gameClient.getOutPacket(CmdSendUpdateResource);
        pk.pack(gold, elixir, darkElixir, coin);
        this.gameClient.sendPacket(pk);
    },

    sendGetTimestampRequest: function() {
        cc.log("sendGetTimestamp");
        let pk = this.gameClient.getOutPacket(CmdGetTimestamp);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    //Map Info
    sendGetMapInfoListRequest: function() {
        cc.log("sendGetMapInfoList");
        let pk = this.gameClient.getOutPacket(CmdGetMapInfoList);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendGetMapObjectInfoRequest: function(id) {
        let pk = this.gameClient.getOutPacket(CmdGetMapObjectInfo);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },

    sendMapObjectCountRequest: function() {
        cc.log("sendMapObjectCountRequest");
        let pk = this.gameClient.getOutPacket(CmdGetMapObjectCount);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendMoveBuildingRequest: function(id, xOld, yOld, xNew, yNew) {
        cc.log("sendMoveBuildingRequest", id.toString(), xOld.toString(), yOld.toString(), xNew.toString(), yNew.toString());
        let pk = this.gameClient.getOutPacket(CmdMoveBuilding);
        pk.pack(id, xOld, yOld, xNew, yNew);
        this.gameClient.sendPacket(pk);
    },

    sendBuildBuildingRequest: function(type, x, y) {
        cc.log("sendBuildBuildingRequest", type.toString(), x.toString(), y.toString());
        let pk = this.gameClient.getOutPacket(CmdBuildBuilding);
        pk.pack(type, x, y);
        this.gameClient.sendPacket(pk);
    },

    sendUpgradeBuildingRequest: function(id) {
        cc.log("sendUpgradeBuildingRequest", id.toString());
        let pk = this.gameClient.getOutPacket(CmdUpgradeBuilding);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },

    sendDeleteObstacleRequest: function(id) {
        cc.log("sendDeleteObstacleRequest", id.toString());
        let pk = this.gameClient.getOutPacket(CmdDeleteObstacle);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },

    sendFinishDeleteObstacleRequest: function(id) {
        cc.log("sendFinishDeleteObstacleRequest", id.toString());
        let pk = this.gameClient.getOutPacket(CmdFinishDeleteObstacle);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },

    sendFinishUpgradeBuildingRequest: function(id) {
        cc.log("sendFinishUpgradeBuildingRequest", id.toString());
        let pk = this.gameClient.getOutPacket(CmdFinishUpgradeBuilding);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },

    sendSkipDeleteObstacleRequest: function(id, timestamp) {
        cc.log("sendSkipDeleteObstacleRequest", id.toString());
        let pk = this.gameClient.getOutPacket(CmdSkipDeleteObstacle);
        pk.pack(id, timestamp);
        this.gameClient.sendPacket(pk);
    },

    sendSkipUpgradeBuildingRequest: function(id, timestamp) {
        cc.log("sendSkipUpgradeBuildingRequest", id.toString(), timestamp.toString());
        let pk = this.gameClient.getOutPacket(CmdSkipUpgradeBuilding);
        pk.pack(id, timestamp);
        this.gameClient.sendPacket(pk);
    },

    sendCancelUpgradeBuildingRequest: function(id) {
        cc.log("sendCancelUpgradeBuildingRequest", id.toString());
        let pk = this.gameClient.getOutPacket(CmdCancelUpgradeBuilding);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },

    sendCancelBuildBuildingRequest: function(id) {
        cc.log("sendCancelBuildBuildingRequest", id.toString());
        let pk = this.gameClient.getOutPacket(CmdCancelBuildBuilding);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },

    //Troop Info
    sendGetTroopRequest: function(){
        cc.log("sendGetTroopRequest");
        let pk = this.gameClient.getOutPacket(CmdGetTroop);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    //Train
    sendGetTrainInfoRequest: function(){
        let pk = this.gameClient.getOutPacket(CmdGetTrainInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendTrainTroop: function(type, id){
        let pk = this.gameClient.getOutPacket(CmdTrainTroop);
        pk.pack(type, id);
        this.gameClient.sendPacket(pk);
    },

    sendSkipTroop: function(barrackID, armyCampID, timestamp){
        let pk = this.gameClient.getOutPacket(CmdSkipTroop);
        pk.pack(barrackID, armyCampID, timestamp);
        this.gameClient.sendPacket(pk);
    },
    
    sendCancelTroop: function(type, id){
        let pk = this.gameClient.getOutPacket(CmdCancelTroop);
        pk.pack(type, id);
        this.gameClient.sendPacket(pk);
    },

    sendTrainTroopFinish: function(barrackID, armyCampID, timestamp){
        let pk = this.gameClient.getOutPacket(CmdTrainTroopFinish);
        pk.pack(barrackID, armyCampID, timestamp);
        this.gameClient.sendPacket(pk);
    },

    sendUpdateTrainOffline: function(){
        let pk = this.gameClient.getOutPacket(CmdUpdateTrainOffline);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    // Attack map info
    sendGetCampaignInfo: function() {
        cc.log("sendGetCampaignInfo");
        let pk = this.gameClient.getOutPacket(CmdGetCampaignInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendEnterCampaign: function(level) {
        cc.log("sendEnterCampaign");
        let pk = this.gameClient.getOutPacket(CmdEnterCampaign);
        pk.pack(level);
        this.gameClient.sendPacket(pk);
    },

    sendStartCampaign: function(listTroop) {
        cc.log("sendStartCampaign");
        let pk = this.gameClient.getOutPacket(CmdStartCampaign);
        pk.pack(listTroop.length, listTroop);
        this.gameClient.sendPacket(pk);
    },

    sendDropTroop: function(troopType, id, x, y, tick) {
        cc.log("sendDropTroop");
        let pk = this.gameClient.getOutPacket(CmdDropTroop);
        pk.pack(troopType, id, x, y, tick);
        this.gameClient.sendPacket(pk);
    },

    sendEndCampaign: function(tick) {
        cc.log("sendEndCampaign");
        let pk = this.gameClient.getOutPacket(CmdEndCampaign);
        pk.pack(tick + 100);
        this.gameClient.sendPacket(pk);
    }

    //Demo Info
});



