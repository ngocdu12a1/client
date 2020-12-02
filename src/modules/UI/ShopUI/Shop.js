/**
 * Created by Duypd2 on 18/6/2020.
 */

var Shop = cc.Layer.extend({
    _shopBtn: null,
    _node: null,
    //[button name, shopFrame name]
    _shopButtons: [
        [res.shop.button.buyRes, res.shopFrameName.buyRes],
        [res.shop.button.res, res.shopFrameName.res],
        [res.shop.button.dc, res.shopFrameName.dc],
        [res.shop.button.shield, res.shopFrameName.shield],
        [res.shop.button.defense, res.shopFrameName.defense],
        [res.shop.button.army, res.shopFrameName.army]],
    _gold: 0,
    _elixir: 0,
    _coin: 0,
    ctor:function(){
        this._super();
        // this.setLocalZOrder(res.MapUI.zPosition.shopFrame);
        this.loadScene();
        gv.shopUI = this;
        testnetwork.connector.sendResource();
        // this.setVisible(false);
    },
    loadScene:function(){
        this.initShopBtn();
    },
    openShop:function() {
        //this.removeAllChildren();
        var self = this;
        //load the scene
        this._node = new gv.PopupUI(res.shop.ui);
        this._node.open();
        this.addChild(this._node);
        // this.setVisible(true);

        //load font

        //load the exit button
        var closeBtn = this._node.getElementByName(res.base.button.close);
        closeBtn = gv.animatedButton(closeBtn, true, function () {
            self._node.close();
            // this.setVisible(false);
            var pageView = self._node.getElementByName("PageView");
            pageView.removeFromParent();
            self.initShopBtn();
        });

        //load slot button
        for (var i = 0; i < this._shopButtons.length; i++)
            this.initButton(this._shopButtons[i]);
    },
    removeScene:function(){
        this._node.removeFromParent();
    },
    initShopBtn:function(){
        var self = this;
        var shopIcon = ccs.load(res.lobby);
        this.addChild(shopIcon.node);
        shopIcon.node.setContentSize(cc.winSize);
        ccui.Helper.doLayout(shopIcon.node);
        this._shopBtn = shopIcon.node.getChildByName(res.shop.button.icon);
        this._shopBtn = gv.animatedButton(self._shopBtn, false, function(){
            gv.mapLayer.removeFocusObject();
            self.openShop();
        });
    },
    initButton:function(name){
        var self = this;
        var slot = this._node.getElementByName(name[0]);
        if (name[0] == res.shop.button.buyRes || name[0] == res.shop.button.dc || name[0] == res.shop.button.shield){
            slot.setEnabled(false);
            try {
                slot.getChildren()
                .forEach(function(child){
                    gv.setGrayScaleToSprite(child);
                })
            } catch (e){

            }
        } else {
            slot = gv.animatedButton(slot, false, function(){
                shopFrame = new ShopFrame(self, name[1], self._gold, self._elixir, self._coin);
                self.addChild(shopFrame);
                // shopFrame._node.setZOrder(9999999);
            });
        }
    },
    getResource:function(packet){
        this._gold = packet.gold;
        this._elixir = packet.elixir;
        this._coin = packet.coin;
    }
});