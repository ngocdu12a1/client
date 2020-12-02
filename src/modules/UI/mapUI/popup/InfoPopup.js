

var InfoPopup = cc.Layer.extend({
    object: null,

    ctor: function() {
        this._super();
        this.setLocalZOrder(res.MapUI.zPosition.shopFrame);
        return true;
    },

    openPopup:function(_objType, _level, attributeList) {
        this.removeAllChildren();
        let self = this;
        try {
            this.object = gv.objectUtils.getObjectFromInfo({
                id: -1,
                type: _objType,
                level: _level
            });
            if (attributeList == null) {
                attributeList = this.object.getAttributeList();
            }

            this.object.level = this.object.maxLevel;
            let maxAttributeList = this.object.getAttributeList();
            this.object.level = _level;

            this._node = new gv.PopupUI(res.MapUI.infoPopup);

            let list = [this.object.getGrassSprite(), this.object.getIdleSprite(), this.object.getAnimatedSprite()];
            for(let i = 0; i < list.length; i++) {
                if (list[i] != null) {
                    this._node.addNewChild(list[i]);
                    list[i].setAnchorPoint(cc.p(0.5, 0.5));
                    list[i].setPosition(cc.p(-1200, 300));
                    list[i].setLocalZOrder(res.MapUI.zPosition.shopFrame);
                    list[i].setScale(list[i].scale * 3.5);
                }
            }

            let count = 0;
            for(let key in attributeList) {
                count += 1;
            }
            let curY = 210 + count / 2 * 240;
            let subY = 720 / count;
            count = 1;
            for(let key in attributeList) {
                if (attributeList.hasOwnProperty(key)) {
                    let sprite = gv.mapUtils.createBuildingAttributeSprite(key);
                    this._node.addNewChild(sprite);
                    sprite.setPosition(cc.p(-400, curY));
                    sprite.setScale(5);
                    let string = this._node.getElementByName("attr" + count);
                    string.setLocalZOrder(res.MapUI.zPosition.buildingAttribute);
                    string.setScale(string.getScaleX() * 1.5, string.getScaleY() * 1.5);
                    string.setPosition(cc.p(string.x, curY + 50));
                    let progressbar = this._node.getElementByName("progressbar" + count);
                    let progressBG = this._node.getElementByName("progressbg" + count);
                    progressBG.setLocalZOrder(res.MapUI.zPosition.progressBackground);
                    progressBG.setPosition(cc.p(progressBG.x, curY));
                    progressbar.setLocalZOrder(res.MapUI.zPosition.progressBar);
                    progressbar.setPosition(cc.p(progressbar.x, curY));
                    if (key == "goldCapacity" || key == "elixirCapacity" || key == "darkElixirCapacity") {
                        //cc.log(JSON.stringify(attributeList[key]));
                        string.setString(res.MapUI.buildingAttribute[key].name + ": " + attributeList[key].quantity + "/" + attributeList[key].capacity);
                        progressbar.setPercent(attributeList[key].quantity / attributeList[key].capacity * 100);
                    } else if (key == "goldProductionRate" || key == "elixirProductionRate" || key == "darkElixirProductionRate"){
                        string.setString(res.MapUI.buildingAttribute[key].name + ": " + attributeList[key] + "/1h");
                        progressbar.setPercent(100);
                    } else if (key == "damage") {
                        string.setString(res.MapUI.buildingAttribute[key].name + ": " + attributeList[key]);
                        progressbar.setPercent(attributeList[key] / maxAttributeList[key] * 100);
                    } else {
                        string.setString(res.MapUI.buildingAttribute[key].name + ": " + attributeList[key]);
                        progressbar.setPercent(100);
                    }

                    count += 1;
                    curY -= subY;
                }
            }
            for(let i = count; i <= 3; i++) {
                let string = this._node.getElementByName("attr" + i);
                let progressbar = this._node.getElementByName("progressbar" + i);
                let progressBG = this._node.getElementByName("progressbg" + i);
                string.setLocalZOrder(res.MapUI.zPosition.invisible);
                progressBG.setLocalZOrder(res.MapUI.zPosition.invisible);
                progressbar.setLocalZOrder(res.MapUI.zPosition.invisible);
            }

            let objName = this._node.getElementByName("objectName");
            objName.setString(this.object.getNameString() + " " + this.object.getLevelString());

            let description = new cc.LabelBMFont("", "res/fonts/soji_20.fnt");
            description.setAnchorPoint(cc.p(0, 1));
            description.setLocalZOrder(res.MapUI.zPosition.buildingAttribute);
            description.setPosition(cc.p(-1670, -330));
            description.setScale(5);
            description.setBoundingWidth(700);
            description.setString(this.object.getInfo());
            this._node.addNewChild(description);

            let bg = this._node.getElementByName("Sprite_1");
            let size = cc.director.getVisibleSize();
            this._node.setPosition(cc.p(0, 0));
            // this._node.setScale(size.width * 0.8 / bg.width, size.height * 0.8 / bg.height);
            this._node.setScale(0.2, 0.2);
            //cc.log(bg.width);
            this._node.open();
            this.addChild(this._node);

            //load text


            //load the exit button
            let closeBtn = this._node.getElementByName(res.base.button.close);
            closeBtn = gv.animatedButton(closeBtn, true, function () {
                self._node.close();
            });


        } catch(e){
            this._node = new gv.PopupUI(res.MapUI.infoPopup);
            
            let description = new cc.LabelBMFont(" ", "res/fonts/soji_20.fnt");
            description.setAnchorPoint(cc.p(0, 1));
            description.setLocalZOrder(res.MapUI.zPosition.buildingAttribute);
            description.setPosition(cc.p(-1670, -330));
            description.setScale(5);
            description.setBoundingWidth(700);
            description.setString("Hiện chưa có trong bản build này");
            this._node.addNewChild(description);

            this._node.setPosition(cc.p(0, 0));
            // this._node.setScale(size.width * 0.8 / bg.width, size.height * 0.8 / bg.height);
            this._node.setScale(0.2, 0.2);
            //cc.log(bg.width);
            this._node.open();
            this.addChild(this._node);

            //load text

            //load the exit button
            let closeBtn = this._node.getElementByName(res.base.button.close);
            closeBtn = gv.animatedButton(closeBtn, true, function () {
                self._node.close();
            });
        }
        
        //load the scene
        
    },

    onEnter : function() {
        this._super();
    },

    onRemove: function() {
        cc.unloadAllAnimationData(this);
    }
});