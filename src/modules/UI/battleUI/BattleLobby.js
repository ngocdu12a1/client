/**
 * Created by Fersher_LOCAL on 7/22/2020.
 */


var BattleLobby = cc.Layer.extend({
    focusStage: null,

    ctor: function() {
        this._super();
        this.setLocalZOrder(res.MapUI.zPosition.shopFrame);
        return true;
    },

    openPopup:function(listCampaign, currentCampaign) {
        this.removeAllChildren();
        let self = this;
        this._node = new gv.PopupUI(res.BattleUI.battleLobby);

        //load the exit button
        let closeBtn = this._node.getElementByName(res.base.button.close);
        closeBtn = gv.animatedButton(closeBtn, true, function () {
            self._node.close();
        });

        let conquerButton = this._node.getElementByName("conquerButton");
        conquerButton = gv.animatedButton(conquerButton, false, function() {

        });

        let totalStar = 3 * res.BattleUI.maxStage;
        let currentStar = 0;

        for(let i = 1; i <= res.BattleUI.maxStage; i++) {
            let button = this._node.getElementByName("ScrollView_1").getChildByName("stage" + i.toString());
            if (i <= currentCampaign) {
                let id = i;
                for(let star = listCampaign[i - 1].star + 1; star <= 3; star++) {
                    let starName = "star" + star.toString();
                    button.getChildByName(starName).setScale(0);
                }
                button = gv.animatedButton(button, false, function () {
                    self.setFocusStage(id);
                });
                currentStar += listCampaign[i - 1].star;
            } else {
                button.getChildByName("star1").setLocalZOrder(res.MapUI.zPosition.invisible);
                button.getChildByName("star1").setPosition(cc.p(button.x, button.y));
                button.getChildByName("star2").setLocalZOrder(res.MapUI.zPosition.invisible);
                button.getChildByName("star2").setPosition(cc.p(button.x, button.y));
                button.getChildByName("star3").setLocalZOrder(res.MapUI.zPosition.invisible);
                button.getChildByName("star3").setPosition(cc.p(button.x, button.y));
                button.getChildByName("darkStar1").setLocalZOrder(res.MapUI.zPosition.invisible);
                button.getChildByName("darkStar1").setPosition(cc.p(button.x, button.y));
                button.getChildByName("darkStar2").setLocalZOrder(res.MapUI.zPosition.invisible);
                button.getChildByName("darkStar2").setPosition(cc.p(button.x, button.y));
                button.getChildByName("darkStar3").setLocalZOrder(res.MapUI.zPosition.invisible);
                button.getChildByName("darkStar3").setPosition(cc.p(button.x, button.y));
                button.setEnabled(false);
            }
        }

        this._node.getElementByName("totalStarBackground").getChildByName("starQuantity").setString(currentStar.toString() + "/" + totalStar.toString());

        this.listCampaign = listCampaign;
        this.setFocusStage(currentCampaign);


        //load the scene
        let size = cc.director.getVisibleSize();
        this._node.setScale(size.width / 5520);
        this._node.open();
        this.addChild(this._node);
    },

    setFocusStage: function(id) {
        let resPanel = this._node.getElementByName("resourceBackground");
        resPanel.getChildByName("goldQuantity").setString(gv.normalizeNumber(this.listCampaign[id - 1].gold));
        resPanel.getChildByName("elixirQuantity").setString(gv.normalizeNumber(this.listCampaign[id - 1].elixir));
        let self = this;
        self.focusStage = id;
        let button = this._node.getElementByName("ScrollView_1").getChildByName("stage" + id.toString());
        cc.log("stage" + id.toString());
        let attackButton = this._node.getElementByName("ScrollView_1").getChildByName("attackButton");
        attackButton.setPosition(cc.p(button.x, button.y - attackButton.height / 2));
        attackButton = gv.animatedButton(attackButton, false, function() {
            self._node.close();
            gv.requestManager.sendEnterCampaignRequest(id);
        });
    },

    onEnter : function() {
        this._super();
    },

    onRemove: function() {
        cc.unloadAllAnimationData(this);
    }

});
