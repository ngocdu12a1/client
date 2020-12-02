/**
 * Created by Fersher_LOCAL on 7/16/2020.
 */

var UpgradePopup = cc.Layer.extend({

    ctor: function() {
        this._super();
        this.setLocalZOrder(res.MapUI.zPosition.shopFrame);
        return true;
    },

    openPopup:function(_objType, _level, _id) {
        this.removeAllChildren();
        let self = this;

        this.object = gv.objectUtils.getObjectFromInfo({
            type: _objType,
            level: _level + 1
        });
        //load the scene
        this._node = new gv.PopupUI(res.MapUI.upgradePopup);



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

        let objName = this._node.getElementByName("objectName");
        objName.setString(this.object.getNameString() + " " + this.object.getLevelString());
        this._node.getElementByName("BitmapFontLabel_5").setLocalZOrder(res.MapUI.zPosition.shopFrame);

        let newAttributeList = this.object.getAttributeList();
        this.object.level -= 1;
        this._node.getElementByName("upgrade").setLocalZOrder(res.MapUI.zPosition.shopFrame);
        this._node.getElementByName("upgrade").setString(gv.timeUtils.getFormattedTime(this.object.getBuildingActionTime()));

        let resourcesList = this.object.getBuildingActionResource();
        let oldAttributeList = this.object.getAttributeList();
        //cc.log(JSON.stringify(oldAttributeList), JSON.stringify(newAttributeList));
        this.object.level = this.object.maxLevel;
        let maxAttributeList = this.object.getAttributeList();

        this.object.level = _level + 1;

        let count = 0;
        for(let key in oldAttributeList) {
            count += 1;
        }
        let curY = 210 + count / 2 * 240;
        let subY = 720 / count;
        count = 1;
        for(let key in newAttributeList) {
            if (newAttributeList.hasOwnProperty(key)) {
                let sprite = gv.mapUtils.createBuildingAttributeSprite(key);
                let progressoldbar = this._node.getElementByName("progressoldbar" + count);
                let progressnewbar = this._node.getElementByName("progressnewbar" + count);
                let progressBG = this._node.getElementByName("progressbg" + count);
                let string = this._node.getElementByName("attr" + count);
                this._node.addNewChild(sprite);
                sprite.setPosition(cc.p(-400, curY));
                sprite.setScale(5);
                string.setPosition(cc.p(string.x, curY + 50));
                progressBG.setLocalZOrder(res.MapUI.zPosition.progressBackground);
                progressBG.setPosition(cc.p(progressBG.x, curY));
                progressnewbar.setLocalZOrder(res.MapUI.zPosition.progressBar);
                progressoldbar.setLocalZOrder(res.MapUI.zPosition.progressBar);
                string.setLocalZOrder(res.MapUI.zPosition.buildingAttribute);
                progressoldbar.setPosition(cc.p(progressnewbar.x, curY));
                progressnewbar.setPosition(cc.p(progressoldbar.x, curY));
                if (key == "goldCapacity" || key == "elixirCapacity" || key == "dartElixirCapacity") {
                    string.setString(res.MapUI.buildingAttribute[key].name + ": " + oldAttributeList[key].capacity + " + " + (newAttributeList[key].capacity - oldAttributeList[key].capacity).toString());
                    progressoldbar.setPercent(oldAttributeList[key].capacity / maxAttributeList[key].capacity * 100);
                    progressnewbar.setPercent(newAttributeList[key].capacity / maxAttributeList[key].capacity * 100);
                } else {
                    if (key == "goldProductionRate" || key == "elixirProductionRate" || key == "darkElixirProductionRate"){
                        string.setString(res.MapUI.buildingAttribute[key].name + ": " + oldAttributeList[key] + "+" + (newAttributeList[key] - oldAttributeList[key]).toString() + "/1h");
                    } else {
                        string.setString(res.MapUI.buildingAttribute[key].name + ": " + oldAttributeList[key] + "+" + (newAttributeList[key] - oldAttributeList[key]).toString());
                    }
                    progressoldbar.setPercent(oldAttributeList[key] / maxAttributeList[key] * 100);
                    progressnewbar.setPercent(newAttributeList[key] / maxAttributeList[key] * 100);
                }
                count += 1;
                curY -= subY;
            }
        }
        for(let i = count; i <= 3; i++) {
            let string = this._node.getElementByName("attr" + i);
            let progressoldbar = this._node.getElementByName("progressoldbar" + i);
            let progressnewbar = this._node.getElementByName("progressnewbar" + i);
            let progressBG = this._node.getElementByName("progressbg" + i);
            string.setLocalZOrder(res.MapUI.zPosition.invisible);
            progressBG.setLocalZOrder(res.MapUI.zPosition.invisible);
            progressoldbar.setLocalZOrder(res.MapUI.zPosition.invisible);
            progressnewbar.setLocalZOrder(res.MapUI.zPosition.invisible);
        }


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

        let upgradeBtn = this._node.getElementByName("upgradeButton");
        upgradeBtn = gv.animatedButton(upgradeBtn, true, function() {
            self._node.close();
            gv.requestManager.handleUpgradeBuildingRequest(_id);
        });

        let townHallLevelRequired = this.object.getTownHallLevelRequired();
        if (townHallLevelRequired > gv.resourceManager.getTownHallLevel()) {
            let warning = new cc.LabelBMFont("Công trình yêu cầu nhà chính cấp " + townHallLevelRequired, "res/fonts/soji_16.fnt");
            warning.setColor(cc.color(255, 0, 0, 1));
            warning.setLocalZOrder(res.MapUI.zPosition.buildingAttribute);
            warning.setPosition(upgradeBtn.x, upgradeBtn.y);
            warning.setScale(5);
            this._node.addNewChild(warning);
            upgradeBtn.setLocalZOrder(res.MapUI.zPosition.invisible);
            upgradeBtn.setEnabled(false);
        } else {
            let startY = upgradeBtn.y + 100;
            for(let key in resourcesList) {
                if (resourcesList.hasOwnProperty(key)) {
                    let sprite = gv.mapUtils.createRequiredResourceBar(key, resourcesList[key]);
                    sprite.setPosition(cc.p(upgradeBtn.x, startY));
                    sprite.setScale(5);
                    if (resourcesList[key] > gv.resourceManager.getTotalResource(key)) {
                        sprite.setColor(cc.color(255, 0, 0, 1));
                    } else {
                        sprite.setColor(cc.color(255, 255, 255, 1));
                    }
                    this._node.addNewChild(sprite);
                    startY -= 100;
                }
            }
        }

    },

    onEnter : function() {
        this._super();
    },

    onRemove: function() {
        cc.unloadAllAnimationData(this);
    }
});
