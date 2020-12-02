var ShopItem = cc.Layer.extend({
    name: null,
    _node: null,
    ctor:function(index, name){
        this._super();
        var loader = ccs.load(res.shop.item);
        this._node = loader.node;
        this.name = name;
        this.addChild(this._node);
    },
    getNode:function(){
        return this._node;
    }
});