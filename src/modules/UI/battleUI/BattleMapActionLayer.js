

var BattleMapActionLayer = cc.Layer.extend({
    battleLobby: null,
    selectedTroopPanel: null,
    availableTroopPanel: null,
    battleTroopPanel: null,
    listSelectedTroop: null,
    listAvailableTroop: null,
    listBattleTroop: null,
    texture: null,
    battleTroopType: null,
    battleStarted: null,
    selectedTroopPos: null,
    starCount: null,

    ctor: function() {
        this._super();
        this.battleStarted = false;
        this.starCount = 0;
        this.texture = {};
        this.battleTroopType = {};
        this.listAvailableTroop = {};
        this.listSelectedTroop = {};
        this.listBattleTroop = {};
        this.setLocalZOrder(res.MapUI.zPosition.shopFrame);
        let thisPointer = this;
        gv.mapActionLayer = this;


        let battle_lobby = ccs.load(res.BattleUI.battleActionLayer);
        this.addChild(battle_lobby.node);
        this.battleLobby = battle_lobby.node;
        this.battleLobby.setLocalZOrder(res.MapUI.zPosition.shopFrame);
        gv.scaleLayerByVisibleSize(this.battleLobby);
        this.battleLobby.setContentSize(cc.winSize);
        ccui.Helper.doLayout(this.battleLobby);

        let size = cc.director.getVisibleSize();
        let selectedTroopPanel = this.battleLobby.getChildByName("selectedTroopPanel");
        let availableTroopPanel = this.battleLobby.getChildByName("availableTroopPanel");
        let battleTroopPanel = this.battleLobby.getChildByName("battleTroopPanel");

        battleTroopPanel.setScale(0);
        selectedTroopPanel.setScale(1.3);
        availableTroopPanel.setScale(1.3);

        battleTroopPanel.setPosition(cc.p(size.width / 2, 0));
        selectedTroopPanel.setPosition(cc.p(size.width / 2, size.height));
        availableTroopPanel.setPosition(cc.p(size.width / 2, 0));

        selectedTroopPanel.getChildByName("Image_41").setContentSize(cc.size(size.width / 1.3, selectedTroopPanel.getChildByName("Image_41").height));
        selectedTroopPanel.getChildByName("troopBar").setContentSize(cc.size(size.width / 1.3 - 10, selectedTroopPanel.getChildByName("troopBar").height));

        battleTroopPanel.getChildByName("Image_44").setContentSize(cc.size(size.width / 1.3, battleTroopPanel.getChildByName("Image_44").height));
        battleTroopPanel.getChildByName("listTroop").setContentSize(cc.size(size.width / 1.3 - 20, battleTroopPanel.getChildByName("listTroop").height));

        let listSelectedTroop = selectedTroopPanel.getChildByName("troopBar").getChildByName("listTroop");
        listSelectedTroop.setScrollBarEnabled(false);

        let listAvailableTroop = availableTroopPanel.getChildByName("listTroop");
        listAvailableTroop.setScrollBarEnabled(false);

        let listBattleTroop = battleTroopPanel.getChildByName("listTroop");
        listBattleTroop.setScrollBarEnabled(false);

        this.selectedTroopPanel = selectedTroopPanel;
        this.availableTroopPanel = availableTroopPanel;
        this.battleTroopPanel = battleTroopPanel;

        this.updateAvailableTroop();
        this.updateBattleTroop(false);
        this.updateSelectedTroop();

        let goHomeButton = availableTroopPanel.getChildByName("goHomeButton");
        goHomeButton = gv.animatedButton(goHomeButton, true, function() {
            gv.viewMainScreen();
        });

        let startButton = availableTroopPanel.getChildByName("startButton");
        startButton = gv.animatedButton(startButton, true, function() {
            let listTroop = [];
            for(let key in thisPointer.listSelectedTroop) {
                if (thisPointer.listSelectedTroop.hasOwnProperty(key)) {
                    listTroop.push({
                        type: key,
                        quantity: thisPointer.listSelectedTroop[key]
                    })
                }
            }
            gv.requestManager.sendStartCampaignRequest(listTroop);
        });

        let endBattleButton = battleTroopPanel.getChildByName("endButton");
        endBattleButton.setPosition( cc.p(- battleTroopPanel.getChildByName("Image_44").width / 1.3 / 2 + endBattleButton.width / 1.3 / 2, endBattleButton.y));
        endBattleButton = gv.animatedButton(endBattleButton, true, function() {
            gv.objectManager.sendEndBattleRequest();
        });


        let resultPanel = this.battleTroopPanel.getChildByName("Result");
        resultPanel.setPosition(cc.p(battleTroopPanel.getChildByName("Image_44").width / 2, resultPanel.y));

        this.battleTroopPanel.getChildByName("Result").getChildByName("star1").setScale(0);
        this.battleTroopPanel.getChildByName("Result").getChildByName("star2").setScale(0);
        this.battleTroopPanel.getChildByName("Result").getChildByName("star3").setScale(0);
        this.updatePercent(0);


        return true;
    },

    startBattle: function(listTroop) {
        this.selectedTroopPanel.setScale(0);
        this.availableTroopPanel.setScale(0);
        this.battleTroopPanel.setScale(1.3);
        this.initStartBattle(listTroop);
    },

    initTroop: function(listTroop) {
        for(let i = 0; i < listTroop.length; i++) {
            this.listAvailableTroop[listTroop[i].type] = listTroop[i].quantity;
            this.texture[listTroop[i].type] = cc.textureCache.addImage(res.troop.pathBattle + listTroop[i].type + ".png");
        }
        //cc.log(JSON.stringify(this.listAvailableTroop));
        this.updateAvailableTroop();
    },

    initStartBattle: function(listTroop) {
        this.battleStarted = true;
        this.listBattleTroop = {};
        for(let i = 0; i < listTroop.length; i++) {
            this.listBattleTroop[listTroop[i].type] = listTroop[i].quantity;
        }
        this.updateBattleTroop(true);
        this.initUserResource();
    },

    selectTroop: function(type) {
        if (!this.listAvailableTroop.hasOwnProperty(type)) {
            return;
        }
        this.listAvailableTroop[type] -= 1;
        if (this.listAvailableTroop[type] == 0)
            delete this.listAvailableTroop[type];
        if (!this.listSelectedTroop.hasOwnProperty(type))
            this.listSelectedTroop[type] = 0;
        this.listSelectedTroop[type] += 1;
        this.updateAvailableTroop();
        this.updateSelectedTroop();
    },

    deselectTroop: function(type) {
        if (!this.listSelectedTroop.hasOwnProperty(type)) {
            return;
        }
        this.listSelectedTroop[type] -= 1;
        if (this.listSelectedTroop[type] == 0)
            delete this.listSelectedTroop[type];
        if (!this.listAvailableTroop.hasOwnProperty(type))
            this.listAvailableTroop[type] = 0;
        this.listAvailableTroop[type] += 1;
        this.updateAvailableTroop();
        this.updateSelectedTroop();
    },

    updateAvailableTroop: function() {
        let listTroop = this.availableTroopPanel.getChildByName("listTroop");
        let count = 0;
        let thisPointer = this;
        for(let type in this.listAvailableTroop) if (this.listAvailableTroop.hasOwnProperty(type)) {
            let armyName = "army" + count.toString();
            let armyPanel = listTroop.getChildByName(armyName);
            let button = armyPanel.getChildByName("Button");
            button.setScale(1);

            button.getChildByName("troopbackground").setTexture(this.texture[type]);
            button.getChildByName("quantity").setString("x" + this.listAvailableTroop[type].toString());
            button.getChildByName("quantity").setScale(0.5);
            let currentType = type;
            button = gv.animatedButton(button, false, function() {
                 thisPointer.selectTroop(currentType);
            });
            button.setPosition(cc.p(35, 43));
            count += 1;
        }
        for(let i = count; i < res.BattleUI.maxTroopTypes; i++) {
            let armyName = "army" + i.toString();
            let armyPanel = listTroop.getChildByName(armyName);
            let button = armyPanel.getChildByName("Button");
            button.setScale(0);
            button.setPosition(cc.p(0, -1000));
        }
    },

    updateSelectedTroop: function() {
        let listTroop = this.selectedTroopPanel.getChildByName("troopBar").getChildByName("listTroop");
        let count = 0;
        let thisPointer = this;
        for(let type in this.listSelectedTroop) if (this.listSelectedTroop.hasOwnProperty(type)) {
            let armyName = "army" + count.toString();
            let armyPanel = listTroop.getChildByName(armyName);
            let button = armyPanel.getChildByName("Button");
            button.setScale(1);

            button.getChildByName("troopbackground").setTexture(this.texture[type]);
            button.getChildByName("quantity").setString("x" + this.listSelectedTroop[type].toString());
            button.getChildByName("quantity").setScale(0.5);
            let currentType = type;
            button = gv.animatedButton(button, false, function() {
                thisPointer.deselectTroop(currentType);
            });
            button.setPosition(cc.p(35, 43));
            count += 1;
        }
        for(let i = count; i < res.BattleUI.maxTroopTypes; i++) {
            let armyName = "army" + i.toString();
            let armyPanel = listTroop.getChildByName(armyName);
            let button = armyPanel.getChildByName("Button");
            button.setScale(0);
            button.setPosition(cc.p(0, -1000));
        }
    },

    dropTroop: function(isoPos) {
        if (!this.battleStarted)
            return;
        let pos = this.selectedTroopPos;
        let type = this.battleTroopType[pos];
        if (this.selectedTroopPos == null) {
            cc.log("het linh");
            return;
        }
        this.listBattleTroop[type] -= 1;
        let dropped = gv.objectManager.dropTroop(isoPos, type);
        if (!dropped)
            return;

        if (this.listBattleTroop[type] == 0) {
            delete this.listBattleTroop[type];
            this.updateBattleTroop(true);
        } else
            this.updateBattleTroop(false);
    },

    updatePercent: function(percent) {
        this.battleTroopPanel.getChildByName("Result").getChildByName("percent").setString(percent.toString() + "%");
    },

    addStar: function() {
        this.starCount += 1;
        this.battleTroopPanel.getChildByName("Result").getChildByName("star" + this.starCount.toString()).setScale(1);
        if (this.starCount == 3) {
            gv.objectManager.sendEndBattleRequest();
        }
    },

    endBattle: function(gold, elixir, star) {
        if (!this.battleStarted)
            return;
        this.battleStarted = false;
        this.battleTroopPanel.setScale(0);
        let endBattle = ccs.load(res.BattleUI.endBattle).node;
        this.addChild(endBattle);
        endBattle.setLocalZOrder(res.MapUI.zPosition.shopFrame);

        let size = cc.director.getVisibleSize();
        let panel = endBattle.getChildByName("panel");
        // hardcoded value by resources
        let bgWidth = 900;
        panel.setPosition(cc.p(0, 0));
        panel.setScale(size.width / bgWidth);
        panel.getChildByName("Image_1").setContentSize(cc.size(size.width + 100, size.height + 100));

        if (star != 0)
            panel.getChildByName("resultLabel").setString("Thắng lợi");
        else
            panel.getChildByName("resultLabel").setString("Thất bại");

        panel.getChildByName("goldQuantity").setString(gv.normalizeNumber(gold));
        panel.getChildByName("elixirQuantity").setString(gv.normalizeNumber(elixir));

        for(let i = star + 1; i <= 3; i++) {
            let starName = "star" + i.toString();
            panel.getChildByName(starName).setScale(0);
        }
        let button = panel.getChildByName("goHomeButton");
        button = gv.animatedButton(button, true, function() {
            gv.viewMainScreen();
        })
    },

    updateBattleTroop: function(changeSelectedTroop) {
        let listTroop = this.battleTroopPanel.getChildByName("listTroop");
        let count = 0;
        for(let type in this.listBattleTroop) if (this.listBattleTroop.hasOwnProperty(type)) {
            let armyName = "army" + count.toString();
            let armyPanel = listTroop.getChildByName(armyName);
            let button = armyPanel.getChildByName("Button");
            button.setScale(1);

            button.getChildByName("troopbackground").setTexture(this.texture[type]);
            button.getChildByName("quantity").setString("x" + this.listBattleTroop[type].toString());
            button.getChildByName("quantity").setScale(0.5);
            let thisPointer = this;
            this.battleTroopType[count] = type;
            let cnt = count;
            button = gv.animatedButton(button, false, function() {
                thisPointer.selectedTroopPos = cnt;
                listTroop.getChildByName("selectTroop").setPosition(cc.p(armyPanel.x, armyPanel.y));
            });
            button.setPosition(cc.p(35, 43));
            count += 1;
        }

        if (count == 0) {
            listTroop.getChildByName("selectTroop").setPosition(cc.p(0, -1000));
            this.selectedTroopPos = null;
        } else if (changeSelectedTroop) {
            this.selectedTroopPos = 0;
            listTroop.getChildByName("selectTroop").setPosition(cc.p(45, 43));
        }

        for(let i = count; i < res.BattleUI.maxTroopTypes; i++) {
            let armyName = "army" + i.toString();
            let armyPanel = listTroop.getChildByName(armyName);
            let button = armyPanel.getChildByName("Button");
            button.setScale(0);
            button.setPosition(cc.p(0, -1000));
        }
    },

    getRemainingTroopList: function() {
        let listTroop = [];
        cc.log(JSON.stringify(this.listBattleTroop));
        for(let type in this.listBattleTroop) {
            if (this.listBattleTroop.hasOwnProperty(type)) {
                listTroop.push({
                    type: type,
                    quantity: this.listBattleTroop[type]
                })
            }
        }
        return listTroop;
    },

    initUserResource: function() {
        let userResPanel = ccs.load(res.BattleUI.battleUserResource, "res/").node;
        this.userResPanel = userResPanel;
        gv.scaleLayerByVisibleSize(this.userResPanel);
        this.userResPanel.setContentSize(cc.winSize);
        ccui.Helper.doLayout(this.userResPanel);
        let size = cc.director.getVisibleSize();
        this.addChild(this.userResPanel);
        this.userResPanel.setLocalZOrder(res.MapUI.zPosition.shopFrame);
    },

    onEnter: function() {
        this._super();
    },


    onRemove: function() {
        cc.unloadAllAnimationData(this);
    }
});