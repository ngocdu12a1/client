/**
 * Created by CPU60159_LOCAL on 6/23/2020.
 */

var ShopFrame = cc.Layer.extend({
    _node: null,
    _shop: null,
    _name: null,
    _items: [],
    _buildings: [],
    _listView: null,
    _gold: 0,
    _elixir: 0,
    _coin: 0,
    ctor:function(shop, name, gold, elixir, coin){
        this._super();
        this._shop = shop;
        this._name = name;
        this._gold = gold;
        this._elixir = elixir;
        this._coin = coin;
        this.init();
    },
    init:function(){
        this.setLocalZOrder(res.MapUI.zPosition.shopFrame);
        var self = this;
        //load the shop frame
        this._node = new gv.PopupUI(res.shopFrame);

        //close button
        var closeBtn = this._node.getElementByName(res.base.button.close);
        closeBtn = gv.animatedButton(closeBtn, true, function () {
            self.closeAll();
        });

        //back button
        var backButton = this._node.getElementByName(res.base.button.back);
        backButton = gv.animatedButton(backButton, true, function(){
            self._node.close();
        });

        //add list view
        var nen = this._node.getElementByName("nen2_1");
        this._listView = new ShopTableView(this._name, this._gold, this._elixir, this._coin);
        this._node._node.addChild(this._listView);
        this._listView.x = nen.x - nen.width/2 + 15;
        this._listView.y = nen.y - nen.height/2 + 80;


        //display info
        this.displayInfo("res_bar_3", "gold");
        this.displayInfo("res_bar_5", "elixir");
        this.displayInfo("res_bar_7", "coin");
        //open
        this._node.open();
        this.addChild(this._node);

    },
    displayInfo: function(resourceName, name){
        var resourceBar = this._node.getElementByName(resourceName);
        var resource = 0;
        if (name == "gold"){
            resource = this.getGold();
        }
        if (name == "elixir")
            resource = this.getElixir();
        if (name == "coin")
            resource = this.getCoin();
        resourceBar.getChildByName(name).setString(resource);
    },
    closeAll:function(){
        this._node.close();
        this._shop.removeScene();
        this._shop.initShopBtn();

    },
    getBuildingInfo:function(){
        
    },
    getGold:function(){
        return this._gold;
    },
    getElixir:function(){
        return this._elixir;
    },
    getCoin:function(){
        return this._coin;
    }
});
