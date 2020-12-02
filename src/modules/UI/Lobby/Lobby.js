var Lobby = cc.Layer.extend({
    username: null,
    level: null,
    exp: null,
    trophy: null,

    armyInfo: null,
    builderInfo: null,
    shieldInfo: null,

    resourceInfo: [],
    maxResourceInfo: [],
    resourceProgress: [],

    resourceInfoTxt: {
        gold: "GoldInfo",
        elixir: "ElixirInfo", 
        darkElixir: "DarkElixirInfo",
        coin: "CoinInfo"
    },

    //cheat
    cheatBtn: null,

    ctor:function(){
        this._super();

        gv.game_lobby = this;

        var game_lobby = ccs.load(res.game_lobby, "res/");
        // cc.log("Minhhhh");
        gv.scaleLayerByVisibleSize(game_lobby.node);
        game_lobby.node.setContentSize(cc.winSize);
        ccui.Helper.doLayout(game_lobby.node);
        this.addChild(game_lobby.node);

        this.initAttribute(game_lobby.node);
        this.initBattle();
        this.initShop();
        this.initTroop();

        // testnetwork.connector.sendResource();

        
        //cheat
        //cheat butoon
        var cheatBtn = game_lobby.node.getChildByName("CheatBtn");
        //cheat panel
        var cheatPanel = cheatBtn.getChildByName("CheatPanel");

        //text fields
        var goldBg = cheatPanel.getChildByName("GoldBg");
        var goldValue = goldBg.getChildByName("goldTextField");

        var elixirBg = cheatPanel.getChildByName("ElixirBg");
        var elixirValue = elixirBg.getChildByName("elixirTextField");

        var coinBg = cheatPanel.getChildByName("CoinBg");
        var coinValue = coinBg.getChildByName("coinTextField");

        //confirm button
        var confirmButton = cheatPanel.getChildByName("ConfirmButton");
        confirmButton = gv.animatedButton(confirmButton, false, function () {
            var gold = parseInt(goldValue.getString());
            if (isNaN(gold)) gold = 0;
            var elixir = parseInt(elixirValue.getString());
            if (isNaN(elixir)) elixir = 0;
            var coin = parseInt(coinValue.getString());
            if (isNaN(coin)) coin = 0;

            cc.log(gold + " " + elixir + " " + coin);
            testnetwork.connector.sendUpdateResource(gold, elixir, 1000, coin);
        });
        //cancel button
        var cancelButton = cheatPanel.getChildByName("CancelButton");
        cancelButton = gv.animatedButton(cancelButton, false, function () {
            cheatPanel.setVisible(false);
        });
        //set visible to cheat panel
        cheatBtn = gv.animatedButton(cheatBtn, false, function () {
            if (cheatPanel.isVisible()){
                cheatPanel.setVisible(false);
            }
            else{
                cheatPanel.setVisible(true);
            }
        });
    },

    onCheatSelect:function() {
        cc.log("CHEAT");

        testnetwork.connector.sendUpdateResource(100000, 100000, 100000, 0);
    },

    setUsername:function(pkg) {
        this.username.string = pkg.username;
    },

    getResource:function(pkg) {
        let freeBuilder = gv.resourceManager.getFreeBuilderHutCount();
        let totalBuilder = gv.resourceManager.getBuildingQuantity(res.MapUI.buildings.type.BuilderHut.name);

        this.builderInfo.string = freeBuilder + '/' + totalBuilder;

        let totalTroop = gv.troopManager.getTotalTroop();
        let maxTroop = gv.resourceManager.getTotalTroopCapacity();
        this.armyInfo.string = totalTroop + '/' + maxTroop;

        let length = Object.keys(res.ResourceType).length;
        for (i=0; i<length; i++) {
            let type = res.ResourceType[Object.keys(res.ResourceType)[i]]
            // resource = gv.resourceManager.getTotalResource(type); //capacity
            // maxResource = gv.resourceManager.getTotalCapacity(type); //Max Capacity
            resource = pkg[type]; //capacity
            maxResource = gv.resourceManager.getTotalCapacity(type); //Max Capacity
            this.resourceInfo[type].string = gv.normalizeNumber(resource);
            if (type == res.ResourceType.coin)
                continue;
            this.maxResourceInfo[type].string = "Max:"+gv.normalizeNumber(maxResource);
            if (maxResource==0) {
                this.resourceProgress[type].setPercent(100);
            }
            else {
                this.resourceProgress[type].setPercent(resource/maxResource*100);
            }
        }

    },

    initAttribute:function(node) {
        this.username = node.getChildByName("UserInfo").getChildByName("UsernameTxt");
        this.level = node.getChildByName("UserInfo").getChildByName("ExpBarBg").getChildByName("ExpIcon").getChildByName("LevelTxt");
        this.exp = node.getChildByName("UserInfo").getChildByName("ExpBarBg").getChildByName("ExpTxt");
        this.trophy = node.getChildByName("UserInfo").getChildByName("TrophyBg").getChildByName("TrophyTxt");

        this.armyInfo = node.getChildByName("MapInfo").getChildByName("ArmyInfo").getChildByName("InfoTxt");
        this.builderInfo = node.getChildByName("MapInfo").getChildByName("BuilderInfo").getChildByName("InfoTxt");
        this.shieldInfo = node.getChildByName("MapInfo").getChildByName("ShieldInfo").getChildByName("InfoTxt");

        let length = Object.keys(res.ResourceType).length;
        for (i=0; i<length; i++) {
            let type = res.ResourceType[Object.keys(res.ResourceType)[i]]
            this.resourceInfo[type] = node.getChildByName("ResourceInfo").getChildByName(this.resourceInfoTxt[type]).getChildByName("Capacity");
            if (type == res.ResourceType.coin)
                continue;
            this.maxResourceInfo[type] = node.getChildByName("ResourceInfo").getChildByName(this.resourceInfoTxt[type]).getChildByName("MaxCapacity");
            this.resourceProgress[type] = node.getChildByName("ResourceInfo").getChildByName(this.resourceInfoTxt[type]).getChildByName("ProgressBar");
        }

        addArmyBtn = node.getChildByName("MapInfo").getChildByName("ArmyInfo").getChildByName("AddBtn");
        gv.animatedButton(addArmyBtn, false, function(){});
        addBuilderBtn = node.getChildByName("MapInfo").getChildByName("BuilderInfo").getChildByName("AddBtn");
        gv.animatedButton(addBuilderBtn, false, function(){});
        addShieldBtn = node.getChildByName("MapInfo").getChildByName("ShieldInfo").getChildByName("AddBtn");
        gv.animatedButton(addShieldBtn, false, function(){});
        addCoinBtn = node.getChildByName("ResourceInfo").getChildByName("CoinInfo").getChildByName("AddBtn");
        gv.animatedButton(addCoinBtn, false, function(){testnetwork.connector.sendUpdateResource(0, 0, 0, 1000);});
    },

    initShop:function() {
        this.shopButtons = new Shop();
        this.addChild(this.shopButtons);
        this.shopButtons.setLocalZOrder(res.MapUI.zPosition.button);
    },

    initBattle: function() {
        this.battleLobby = new BattleLobby();
        this.battleButton = ccui.Button(res.BattleUI.battleIcon);
        this.addChild(this.battleButton);
        this.addChild(this.battleLobby);
        let self = this;

        this.battleButton = gv.animatedButton(this.battleButton, false, function() {
            gv.requestManager.sendGetCampaignInfoRequest();
        });
        this.battleButton.setPosition(cc.p(this.battleButton.width / 2, this.battleButton.height / 2));
        this.battleButton.setAnchorPoint(cc.p(0.5, 0.5));
    },

    openBattlePopup: function(listCampaign, currentCampaign) {
        this.battleLobby.openPopup(listCampaign, currentCampaign);
    },

    initTroop:function() {
        var self = this;
        var trainGui = gv.trainManager.getBarrackList();

        for (var i = 0; i < trainGui.length; i++) {
            cc.log("Train GUI:", JSON.stringify(trainGui[i]));
        }
    
        this.troopButton = ccui.Button(res.troop.lobbyIcon, res.troop.lobbyIcon, res.troop.lobbyIcon);
        this.troopButton = gv.animatedButton(this.troopButton, false, function(){
            gv.mapLayer.removeFocusObject();
            if (trainGui[0])
                trainGui[0].openTrainGUI();
        });
        this.addChild(this.troopButton);
        this.troopButton.setLocalZOrder(res.MapUI.zPosition.background);

        this.troopButton.setPosition(cc.p(this.troopButton.width/2, this.troopButton.height/2 + this.battleButton.height));
    }
});