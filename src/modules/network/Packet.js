/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD ||{};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

//User info - 1000
gv.CMD.USER_INFO = 1001;
gv.CMD.GET_USER_RESOURCE_INFO = 1002;
gv.CMD.GET_TIMESTAMP = 1003;
gv.CMD.GET_USERNAME = 1004;
gv.CMD.UPDATE_RESOURCE = 1005;

//Map info - 2000
gv.CMD.GET_MAP_INFO = 2001;
gv.CMD.MOVE_BUILDING = 2004;
gv.CMD.GET_MAP_OBJECT_INFO = 2003;
gv.CMD.GET_MAP_OBJECT_COUNT = 2002;
gv.CMD.BUILD_BUILDING = 2005;
gv.CMD.DELETE_OBSTACLE = 2006;
gv.CMD.FINISH_DELETE_OBSTACLE = 2007;
gv.CMD.SKIP_DELETE_OBSTACLE = 2008;
gv.CMD.UPGRADE_BUILDING = 2009;
gv.CMD.FINISH_UPGRADE_BUILDING = 2010;
gv.CMD.SKIP_UPGRADE_BUILDING = 2011;
gv.CMD.CANCEL_BUILD_BUILDING = 2012;
gv.CMD.CANCEL_UPGRADE_BUILDING = 2013;
gv.CMD.GET_MAP_INFO_LIST = 2014;
//Troop - 3000
gv.CMD.GET_TROOP = 3001;

//Train troop - 4000
gv.CMD.GET_TRAIN_INFO = 4001;
gv.CMD.TRAIN_TROOP = 4002;
gv.CMD.SKIP_TROOP = 4003;
gv.CMD.CANCEL_TROOP = 4004;
gv.CMD.TRAIN_TROOP_FINISH = 4005;
gv.CMD.UPDATE_TRAIN_OFFLINE = 4006;

//Attack map info - 5000
gv.CMD.GET_CAMPAIGN_INFO = 5001;
gv.CMD.ENTER_CAMPAIGN = 5002;
gv.CMD.START_CAMPAIGN = 5003;
gv.CMD.DROP_TROOP = 5004;
gv.CMD.END_CAMPAIGN = 5005;
// gv.CMD.MAP_INFO = 5004;
gv.CMD.RESET_MAP = 5006;

testnetwork = testnetwork||{};
testnetwork.packetMap = {};

/**
 * OutPacket
 */

//Handshake
CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
            this.setCmdId(gv.CMD.HAND_SHAKE);
        },
        putData:function(){
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
);

//User Info
CmdSendUserResource = fr.OutPacket.extend({
    ctor:function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_USER_RESOURCE_INFO);
    },
    pack:function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdGetTimestamp = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.GET_TIMESTAMP);
        this.initData(100);
    },
    pack: function() {
        this.packHeader();
        this.updateSize();
    }
});

CmdSendUpdateResource = fr.OutPacket.extend({
    ctor:function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.UPDATE_RESOURCE);
    },
    pack:function(gold, elixir, darkElixir, coin){
        this.packHeader();   

        this.putInt(gold);
        this.putInt(elixir);
        this.putInt(darkElixir);
        this.putInt(coin);    

        this.updateSize();
    }
});

//Map Info

CmdGetMapInfoList = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.GET_MAP_INFO_LIST);
        this.initData(100);
    },
    pack: function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdGetMapObjectCount = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.GET_MAP_OBJECT_COUNT);
        this.initData(100);
    },
    pack: function() {
        this.packHeader();
        this.updateSize();
    }
});

CmdGetMapObjectInfo = fr.OutPacket.extend(
    {
        ctor: function() {
            this._super();
            this.setCmdId(gv.CMD.GET_MAP_OBJECT_INFO);
            this.initData(100);
        },
        pack: function(id) {
            this.packHeader();
            this.putInt(id);
            this.updateSize();
        }
    }
);

CmdMoveBuilding = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.MOVE_BUILDING);
        this.initData(100);
    },
    pack: function(id, xOld, yOld, xNew, yNew) {
        this.packHeader();
        this.putInt(id);
        this.putInt(xOld);
        this.putInt(yOld);
        this.putInt(xNew);
        this.putInt(yNew);
        this.updateSize();
    }
});

CmdBuildBuilding = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.BUILD_BUILDING);
        this.initData(100);
    },
    pack: function(type, x, y) {
        this.packHeader();
        this.putString(type);
        this.putInt(x);
        this.putInt(y);
        this.updateSize();
    }
});

CmdDeleteObstacle = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.DELETE_OBSTACLE);
        this.initData(100);
    },
    pack: function(id) {
        this.packHeader();
        this.putInt(id);
        this.updateSize();
    }
});


CmdUpgradeBuilding = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.UPGRADE_BUILDING);
        this.initData(100);
    },
    pack: function(id) {
        this.packHeader();
        this.putInt(id);
        this.updateSize();
    }
});

CmdFinishDeleteObstacle = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.FINISH_DELETE_OBSTACLE);
        this.initData(100);
    },
    pack: function(id) {
        this.packHeader();
        this.putInt(id);
        this.updateSize();
    }
});

CmdFinishUpgradeBuilding = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.FINISH_UPGRADE_BUILDING);
        this.initData(100);
    },
    pack: function(id) {
        this.packHeader();
        this.putInt(id);
        this.updateSize();
    }
});

CmdSkipDeleteObstacle = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.SKIP_DELETE_OBSTACLE);
        this.initData(100);
    },
    pack: function(id, timestamp) {
        this.packHeader();
        this.putInt(id);
        this.putString(timestamp.toString());
        this.updateSize();
    }
});

CmdSkipUpgradeBuilding = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.SKIP_UPGRADE_BUILDING);
        this.initData(100);
    },
    pack: function(id, timestamp) {
        this.packHeader();
        this.putInt(id);
        this.putString(timestamp.toString());
        this.updateSize();
    }
});

CmdCancelUpgradeBuilding = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.CANCEL_UPGRADE_BUILDING);
        this.initData(100);
    },
    pack: function(id) {
        this.packHeader();
        this.putInt(id);
        this.updateSize();
    }
});

CmdCancelBuildBuilding = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.CANCEL_BUILD_BUILDING);
        this.initData(100);
    },
    pack: function(id) {
        this.packHeader();
        this.putInt(id);
        this.updateSize();
    }
});
//Troop Info
CmdGetTroop = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.GET_TROOP);
        this.initData(100);
    },
    pack: function() {
        this.packHeader();

        this.updateSize();
    }
});
CmdGetTrainInfo = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.GET_TRAIN_INFO);
        this.initData(100);
    },
    pack: function() {
        this.packHeader();
        
        this.updateSize();
    }
});
CmdTrainTroop = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.TRAIN_TROOP);
        this.initData(100);
    },
    pack: function(type, id) {
        this.packHeader();
        
        this.putString(type);
        this.putInt(id);

        this.updateSize();
    }
});
CmdSkipTroop = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.SKIP_TROOP);
        this.initData(100);
    },
    pack: function(barrackID, armyCampID, timestamp) {
        this.packHeader();

        this.putInt(barrackID);
        this.putInt(armyCampID);
        this.putString(timestamp.toString());

        this.updateSize();
    }

});
CmdCancelTroop = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.CANCEL_TROOP);
        this.initData(100);
    },
    pack: function(type, id) {
        this.packHeader();
        
        this.putString(type);
        this.putInt(id);

        this.updateSize();
    }
});
CmdTrainTroopFinish = fr.OutPacket.extend({
    ctor: function() {
        this._super();
        this.setCmdId(gv.CMD.TRAIN_TROOP_FINISH);
        this.initData(100);
    },
    pack: function(barrackID, armyCampID, timestamp) {
        this.packHeader();

        this.putInt(barrackID);
        this.putInt(armyCampID);
        this.putString(timestamp.toString());

        this.updateSize();
    }
});
CmdUpdateTrainOffline = fr.OutPacket.extend({
    ctor: function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.UPDATE_TRAIN_OFFLINE);
    },
    pack: function(){
        this.packHeader();
        this.updateSize();
    }
});

// Attack map
CmdGetCampaignInfo = fr.OutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_CAMPAIGN_INFO);
    },
    pack:function(){
        this.packHeader();
        this.updateSize();
    }
});


CmdEnterCampaign = fr.OutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.ENTER_CAMPAIGN);
    },
    pack:function(level){
        this.packHeader();
        this.putInt(level);
        this.updateSize();
    }
});

CmdStartCampaign = fr.OutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.START_CAMPAIGN);
    },
    pack:function(numberOfTroop, listTroop){
        this.packHeader();
        this.putInt(numberOfTroop);
        for(let i = 0; i < numberOfTroop; i++) {
            this.putString(listTroop[i].type);
            this.putInt(listTroop[i].quantity);
        }
        this.updateSize();
    }
});

CmdDropTroop = fr.OutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.DROP_TROOP);
    },
    pack:function(troopType, id, x, y, tick){
        this.packHeader();
        this.putString(troopType);
        this.putInt(id);
        this.putInt(x);
        this.putInt(y);
        this.putInt(tick);
        this.updateSize();
    }
});

CmdEndCampaign = fr.OutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.END_CAMPAIGN);
    },
    pack:function(tick){
        this.packHeader();
        this.putInt(tick);
        this.updateSize();
    }
});
//Demo Info
CmdSendLogin = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_LOGIN);
        },
        pack:function(sessionKey, userID){
            this.packHeader();
            this.putString(sessionKey);
            this.putInt(userID);
            this.updateSize();
        }
    }
);

/**
 * InPacket
 */


//Handshake
testnetwork.packetMap[gv.CMD.HAND_SHAKE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.token = this.getString();
        }
    }
);

//User Info

testnetwork.packetMap[gv.CMD.GET_USER_RESOURCE_INFO] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.gold = this.getInt();
        this.elixir = this.getInt();
        this.darkElixir = this.getInt();
        this.coin = this.getInt();
    }
});

testnetwork.packetMap[gv.CMD.GET_TIMESTAMP] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.timestamp = this.getLong() - 0;
        }
    }
);

testnetwork.packetMap[gv.CMD.GET_USERNAME] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.username = this.getString();
        }
    }
);

//Map Info

testnetwork.packetMap[gv.CMD.GET_MAP_INFO_LIST] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        let count = this.getInt();
        this.objList = [];
        for(let i = 0; i < count; i++) {
            let obj = {};
            obj.id = this.getInt();
            obj.posX = this.getInt();
            obj.posY = this.getInt();
            obj.type = this.getString();
            obj.level = this.getInt();
            obj.startActionTimestamp = this.getLong() - 0;
            var objType = res.MapUI.buildings.type;
            switch (obj.type) {
                case objType.Barrack.name:
                    obj.trainTimestamp = this.getLong() - 0;
                    break;
                case objType.Laboratory.name:
                    obj.isResearching = this.getLong() - 0;
                    break;
                case objType.BuilderHut.name:
                    obj.targetID = this.getInt();
                    break;
                case objType.GoldMine.name:
                case objType.ElixirCollector.name:
                case objType.DarkElixirCollector.name:
                    obj.quantity = this.getInt();
                    obj.harvestTimeStamp = this.getLong() - 0;
                    break;
                case objType.GoldStorage.name:
                case objType.ElixirStorage.name:
                case objType.DarkElixirStorage.name:
                    obj.quantity = this.getInt();
                    break;
                case objType.TownHall.name:
                    obj.gold = this.getInt();
                    obj.elixir = this.getInt();
                    obj.darkElixir = this.getInt();
                    break;
            }
            this.objList.push(obj);
        }
    }
});

testnetwork.packetMap[gv.CMD.GET_MAP_OBJECT_COUNT] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.count = this.getInt();
        this.objIdList = [];
        for(let i = 0; i < this.count; i++) {
            this.objIdList.push(this.getInt());
        }
        //this.finishCount = this.getInt();
        //this.finishListId = [];
        //for(let i = 0; i < this.finishCount; i++) {
        //    this.finishListId.push(this.getInt());
        //}
    }
});

testnetwork.packetMap[gv.CMD.GET_MAP_OBJECT_INFO] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
        this.posX = this.getInt();
        this.posY = this.getInt();
        this.type = this.getString();
        this.level = this.getInt();
        this.startActionTimestamp = this.getLong() - 0;
        var objType = res.MapUI.buildings.type;
        switch (this.type) {
            case objType.Barrack.name:
                this.trainTimestamp = this.getLong() - 0;
                break;
            case objType.Laboratory.name:
                this.isResearching = this.getLong() - 0;
                break;
            case objType.BuilderHut.name:
                this.targetID = this.getInt();
                break;
            case objType.GoldMine.name:
            case objType.ElixirCollector.name:
            case objType.DarkElixirCollector.name:
                this.quantity = this.getInt();
                this.harvestTimeStamp = this.getLong() - 0;
                break;
            case objType.GoldStorage.name:
            case objType.ElixirStorage.name:
            case objType.DarkElixirStorage.name:
                this.quantity = this.getInt();
                break;
            case objType.TownHall.name:
                this.gold = this.getInt();
                this.elixir = this.getInt();
                this.darkElixir = this.getInt();
                break;
        }
    }
});

testnetwork.packetMap[gv.CMD.MOVE_BUILDING] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
        this.xOld = this.getInt();
        this.yOld = this.getInt();
        this.xNew = this.getInt();
        this.yNew = this.getInt();
    }
});

testnetwork.packetMap[gv.CMD.BUILD_BUILDING] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
        this.type = this.getString();
        this.x = this.getInt();
        this.y = this.getInt();
        this.startActionTimestamp = this.getLong() - 0;
    }
});

testnetwork.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
        }
    }
);

testnetwork.packetMap[gv.CMD.DELETE_OBSTACLE] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
        this.startActionTimestamp = this.getLong() - 0;
    }
});

testnetwork.packetMap[gv.CMD.UPGRADE_BUILDING] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
        this.startActionTimestamp = this.getLong() - 0;
    }
});

testnetwork.packetMap[gv.CMD.FINISH_DELETE_OBSTACLE] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
    }
});

testnetwork.packetMap[gv.CMD.FINISH_UPGRADE_BUILDING] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
    }
});

testnetwork.packetMap[gv.CMD.SKIP_DELETE_OBSTACLE] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
        this.timestamp = this.getLong() - 0;
    }
});

testnetwork.packetMap[gv.CMD.SKIP_UPGRADE_BUILDING] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
        this.timestamp = this.getLong() - 0;
    }
});

testnetwork.packetMap[gv.CMD.CANCEL_UPGRADE_BUILDING] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
    }
});

testnetwork.packetMap[gv.CMD.CANCEL_BUILD_BUILDING] = fr.InPacket.extend({
    ctor: function() {
        this._super();
    },
    readData: function() {
        this.id = this.getInt();
    }
});
//Map Info
testnetwork.packetMap[gv.CMD.GET_MAP_INFO] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.mapW = this.getInt();
            this.mapH = this.getInt();
            this.mapGrid = [];
            for(var i = 0; i < this.mapW; i++)
            {
                this.mapGrid[i] = [];
                for(var j = 0; j < this.mapH; j++)
                {
                    this.mapGrid[i][j] = this.getInt();
                }
            }
        }
    }
);

//train troop
testnetwork.packetMap[gv.CMD.GET_TROOP] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        var self = this;
        this.troops = [];
        var js = JSON.parse(this.getString());
        cc.log("get troop return: ", JSON.stringify(js));
        for (amc in js){
            if (js.hasOwnProperty(amc)){
                var jsonItem = js[amc];
                var id;
                var troopList = [];

                Object.keys(jsonItem).forEach(function(key){
                    if (key == "id")
                        id = jsonItem[key];
                    else {
                        troopList.push({
                            type: key,
                            amount: jsonItem[key]
                        })
                    }
                });

                self.troops.push({
                    id: id,
                    troopList: troopList
                })
            }

        }
    }
});

testnetwork.packetMap[gv.CMD.GET_TRAIN_INFO] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function() {
        var self = this;
        this.trainingTroops = [];
        var js = JSON.parse(this.getString());
        for (bar in js) {
            if (js.hasOwnProperty(bar)) {
                var jsonItem = js[bar];
                var id;
                var timestamp;
                var troopList = [];
                Object.keys(jsonItem).forEach(function (key) {
                    if (key == "id")
                        id = jsonItem[key];
                    else if (key == "timeStamp")
                        timestamp = jsonItem[key];
                    else {
                        troopList.push({
                            type: key,
                            amount: jsonItem[key]
                        })
                    }
                });
                self.trainingTroops.push({
                    id: id,
                    timestamp: timestamp,
                    troops: troopList
                });
            }
        }
    }
});

testnetwork.packetMap[gv.CMD.TRAIN_TROOP] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.type = this.getString();
        this.id = this.getInt();
    }
});

testnetwork.packetMap[gv.CMD.SKIP_TROOP] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.barrackID = this.getInt();
        this.armyCampID = this.getInt();
        this.timestamp = this.getLong();
    }
});

testnetwork.packetMap[gv.CMD.CANCEL_TROOP] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.type = this.getString();
        this.id = this.getInt();
    }
});

testnetwork.packetMap[gv.CMD.TRAIN_TROOP_FINISH] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.barrackID = this.getInt();
        this.armyCampID = this.getInt();
        this.timestamp = this.getLong();
    }
});

testnetwork.packetMap[gv.CMD.UPDATE_TRAIN_OFFLINE] = fr.InPacket.extend({
    ctor: function(){
        this._super();
    },
    readData: function(){
    }
});

// Battle map

testnetwork.packetMap[gv.CMD.GET_CAMPAIGN_INFO] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.numberOfCampaign = this.getInt();
        this.currentCampaign = this.getInt();
        this.listCampaign = [];
        for(let i = 0; i < this.numberOfCampaign; i++) {
            let gold = this.getInt();
            let elixir = this.getInt();
            let star = this.getInt();
            this.listCampaign.push({
                "gold": gold,
                "elixir": elixir,
                "star": star
            });
        }
    }
});

testnetwork.packetMap[gv.CMD.ENTER_CAMPAIGN] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.level = this.getInt();
        this.numberOfBuilding = this.getInt();
        this.listBuilding = [];
        for(let i = 0; i < this.numberOfBuilding; i++) {
            let id = this.getInt();
            let type = this.getString();
            let level = this.getInt();
            let cell = this.getInt();
            let gold = this.getInt();
            let elixir = this.getInt();
            this.listBuilding.push({
                "id": id,
                "type": type,
                "level": level,
                "cell": cell,
                "gold": gold,
                "elixir": elixir
            })
        }
        this.numberOfTroop = this.getInt();
        this.listTroop = [];
        for(let i = 0; i < this.numberOfTroop; i++) {
            let type = this.getString();
            let quantity = this.getInt();
            this.listTroop.push({
                "type": type,
                "quantity": quantity
            })
        }
        cc.log("listtroop:", JSON.stringify(this.listTroop));
    }
});

testnetwork.packetMap[gv.CMD.START_CAMPAIGN] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.numberOfTroop = this.getInt();
        this.listTroop = [];
        for(let i = 0; i < this.numberOfTroop; i++) {
            let type = this.getString();
            let quantity = this.getInt();
            this.listTroop.push({
                "type": type,
                "quantity": quantity
            })
        }
    }
});

testnetwork.packetMap[gv.CMD.DROP_TROOP] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.troopType = this.getString();
        this.id = this.getInt();
        this.x = this.getInt();
        this.y = this.getInt();
        this.tick = this.getInt();
    }
});

testnetwork.packetMap[gv.CMD.END_CAMPAIGN] = fr.InPacket.extend({
    ctor:function(){
        this._super();
    },
    readData:function(){
        this.gold = this.getInt();
        this.elixir = this.getInt();
        this.star = this.getInt();
    }
});
