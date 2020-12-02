/**
 * Created by KienVN on 9/29/2017.
 */

var gv = gv||{};

gv.commonButton = function(w, h, x, y, text){
    if(text === undefined)
        text = "";
    let btn = new ccui.Button(res.base.img_btn_normal, res.base.img_btn_normal, res.base.img_btn_disable);
    if(x === undefined)
        x = 0;
    if(y === undefined)
        y = 0;
    btn.attr({
        x: x,
        y: y
    });

    btn.setTitleText(text);
    btn.setTitleFontSize(32);
    btn.setTitleColor(cc.color(65,65,65,255));
    btn.setZoomScale(0.1);
    btn.setPressedActionEnabled(true);

    btn.setScale9Enabled(true);
    btn.setUnifySizeEnabled(false);
    btn.ignoreContentAdaptWithSize(false);
    let capInsets = cc.rect(15, 15, 15, 15);
    btn.setCapInsets(capInsets);
    btn.setContentSize(cc.size(w,h));
    return btn;
};

gv.commonText = function(text, x, y){
    let _lb = new ccui.Text(text,'', 30);
    if(x === undefined)
        x = 0;
    if(y === undefined)
        y = 0;
    _lb.attr({
        x: x,
        y: y
    });
    _lb.setColor(cc.color(220,220,220,255));
    return _lb;
};
//button gets bigger when on touch
gv.animatedButton = function(button, closeButton, functionCallBack){
    button.callback = functionCallBack;
    let scaleX = button.getScaleX();
    let scaleY = button.getScaleY();
    button.addTouchEventListener(function(sender, type){
        let scaleUp = cc.ScaleTo.create(0.1, 1.05 * scaleX, 1.05 * scaleY);
        let scaleDown = cc.ScaleTo.create(0.1, 1 * scaleX, 1 * scaleY);
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                button.stopAllActions();
                button.runAction(scaleUp);
                break;

            case ccui.Widget.TOUCH_ENDED:
                button.stopAllActions();
                button.runAction(scaleDown);
                button.callback();
                if (closeButton){
                    button.setEnabled(false);
                }
                break;
                
            case ccui.Widget.TOUCH_CANCELED:
                button.runAction(scaleDown);
                break;
        }
    }, this);
    return button;
};
gv.PopupUI = cc.Layer.extend({
    _listener: null,
    _node: null,
    ctor:function(path) {
        this._super();
        let loader = ccs.load(path);
        this._node = loader.node;
        this.addChild(this._node);
        this._node.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
        this._node.setAnchorPoint(0.5, 0.5);
    },
    open:function(){
        this._node.setScale(0);
        this._node.setOpacity(0);
        let scaleUp = cc.ScaleTo.create(0.2, 1, 1);
        let easeScale = new cc.EaseBackOut(scaleUp);
        let fadeIn = cc.FadeIn.create(0.3);
        let spawn = cc.Spawn.create(easeScale, fadeIn);
        this._node.runAction(spawn);
        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(this._listener, this);
    },

    addNewChild: function(node) {
        this._node.addChild(node);
    },

    close:function(callback){
        let self = this;
        let scaleDown = cc.ScaleTo.create(0.2, 0, 0);
        let easeScale = new cc.EaseBackIn(scaleDown);
        let fadeOut = cc.FadeOut.create(0.3);
        let spawn = cc.Spawn.create(easeScale, fadeOut);
        if (this._listener != null){
            cc.eventManager.removeListener(this._listener);
            this._listener = null;
        }
        if (callback != null) {
            let closeSequence = cc.Sequence.create(spawn, cc.CallFunc(callback, self));
            this._node.runAction(closeSequence);
        } else {
            this._node.runAction(spawn);
        }
    },
    appear: function(){
        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(this._listener, this);
        this.setVisible(true);
    },
    disappear: function(){
        if (this._listener != null){
            cc.eventManager.removeListener(this._listener);
            this._listener = null;
        }
        this.setVisible(false);
    },
    getElementByName:function(name){
        return this._node.getChildByName(name);
    }
});
gv.normalizeTime = function(time){
    let days = Math.floor(time / 86400);
    if (days > 0)
        time -= days * 86400;

    // calculate (and subtract) whole hours
    let hours = Math.floor(time / 3600) % 24;
    if (hours > 0)
        time -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(time / 60) % 60;
    if (minutes > 0)
        time -= minutes * 60;

    // what's left is seconds
    let seconds = Math.floor(time % 60);
    let res;
    if (days > 0){
        res = days + "d";
        if (hours > 0) res = res + hours + "h";
    } else if (hours > 0){
        res = hours + "h";
        if (minutes > 0) res = res + minutes + "m";
    } else if (minutes > 0){
        res = minutes + "m";
        if (seconds > 0) res = res + seconds + "s";
    } else {
        if (isNaN(seconds)) return "0s";
        res = seconds + "s";
    }
    return res;
};
gv.normalizeNumber = function(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
gv.setGrayScaleToSprite = function(sprite){
    sprite.setGLProgramState(cc.GLProgramState.getOrCreateWithGLProgramName("ShaderUIGrayScale"));
    sprite.getChildren().forEach(function(child){
        child.setGLProgramState(cc.GLProgramState.getOrCreateWithGLProgramName("ShaderUIGrayScale"));
    })
};
gv.setRGBToSprite = function(sprite){
    sprite.setGLProgramState(cc.GLProgramState.getOrCreateWithGLProgramName("ShaderPositionTextureColor_noMVP"));
    sprite.getChildren().forEach(function(child){
        child.setGLProgramState(cc.GLProgramState.getOrCreateWithGLProgramName("ShaderPositionTextureColor_noMVP"));
    })

};
gv.scaleLayerByVisibleSize = function (layer) {
    layer.setContentSize(cc.director.getVisibleSize());
    ccui.Helper.doLayout(layer);
    let sizeRatio = cc.size(
        cc.director.getVisibleSize().width / DESIGN_RESOLUTION_WIDTH,
        cc.director.getVisibleSize().height / DESIGN_RESOLUTION_HEIGHT
    );
    layer.getChildren().forEach(function (child) {
        let minScale = sizeRatio.width < sizeRatio.height ? sizeRatio.width : sizeRatio.height;
        child.setScale(child.getScaleX() * minScale, child.getScaleY() * minScale);
    }.bind(this));
};
gv.disableButton = function(button) {
    button.setEnabled(false);
    button.getChildren().forEach(function(child){
        child.setGLProgramState(cc.GLProgramState.getOrCreateWithGLProgramName("ShaderUIGrayScale"));
    });
};

gv.enableButton = function (button) {
    button.setEnabled(true);
    button.getChildren().forEach(function(child){
        child.setGLProgramState(cc.GLProgramState.getOrCreateWithGLProgramName("ShaderPositionTextureColor_noMVP"));
    });
};