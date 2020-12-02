/**
 * Created by Fersher_LOCAL on 7/8/2020.
 */


var BuildingActionLayer = cc.Layer.extend({
    buildingActionButton: null,
    nameAndLevelString: null,
    resourceRequiredList: null,
    resourceScale: null,
    coinRequired: null,
    infoPopup: null,
    upgradePopup: null,
    lackOfResPopup: null,
    lackOfBuilderPopup: null,

    ctor: function() {
        this._super();
        return true;
    },

    onEnter: function() {
        this._super();
        this.resourceScale = {
            "1" : 1,
            "2" : 0.7,
            "3" : 0.5
        };
        this.buildingActionButton = {};
        this.setLocalZOrder(res.MapUI.zPosition.button);
        gv.mapActionLayer = this;
        this.initBuildingActionButtons();
    },

    initBuildingActionButtons: function() {
        this.buildingActionButton = gv.mapUtils.createBuildingActionButton();
        for(let key in this.buildingActionButton) {
            if (this.buildingActionButton.hasOwnProperty(key)) {
                this.addChild(this.buildingActionButton[key]);
                this.buildingActionButton[key].setLocalZOrder(res.MapUI.zPosition.button);
                let thisPointer = this;
                let buttonType = key;
                this.buildingActionButton[key].callback = function() {
                    thisPointer.handleButtonCallback(buttonType);
                }
            }
        }
        this.nameAndLevelString = gv.mapUtils.createNameAndLevelLabel();
        this.addChild(this.nameAndLevelString);

        let listRes = res.ResourceType;
        this.resourceRequiredList = {};
        for(let key in listRes) {
            if (listRes.hasOwnProperty(key)) {
                this.resourceRequiredList[key] = gv.mapUtils.createRequiredResourceBar(key, 0);
                this.addChild(this.resourceRequiredList[key]);
                this.resourceRequiredList[key].setLocalZOrder(res.MapUI.zPosition.resourceRequired);
            }
        }

        this.coinRequired = new cc.LabelBMFont("","res/fonts/soji_16.fnt");
        this.addChild(this.coinRequired);
        this.coinRequired.setAnchorPoint(cc.p(0.5, 1));
        this.coinRequired.setColor(cc.color(255, 255, 255, 1));
        this.coinRequired.setLocalZOrder(res.MapUI.zPosition.resourceRequired);
        this.coinRequired.setPosition(cc.p(-100, -100));

        this.infoPopup = new InfoPopup();
        this.addChild(this.infoPopup);

        this.upgradePopup = new UpgradePopup();
        this.addChild(this.upgradePopup);

        this.lackOfResPopup = new LackOfResPopup();
        this.addChild(this.lackOfResPopup);

        this.lackOfBuilderPopup = new LackOfBuilderPopup();
        this.addChild(this.lackOfBuilderPopup);
    },

    enableListActionButton: function(listAction, nameAndLevel) {

        //stop all button action
        for(let key in this.buildingActionButton) {
            if (this.buildingActionButton.hasOwnProperty(key)) {
                this.buildingActionButton[key].stopAllActions();
                this.buildingActionButton[key].setPosition(cc.p(0, 0));
            }
        }
        this.nameAndLevelString.stopAllActions();
        this.nameAndLevelString.setPosition(cc.p(0, 0));


        //calculate total width of button lists for positioning symetric buttons
        var totalWidth = 0;
        for(let i = 0; i < listAction.length; i++) {
            var btn = this.buildingActionButton[listAction[i]];
            totalWidth += btn.width + res.MapUI.action.actionSpace;
        }

        var size = cc.director.getVisibleSize();

        this.nameAndLevelString.setString(nameAndLevel);
        this.nameAndLevelString.setPosition(cc.p(size.width / 2, 0));
        var stringAction = cc.MoveTo.create(0.1,
            cc.p(size.width / 2, res.MapUI.action.height));
        this.nameAndLevelString.runAction(stringAction);

        totalWidth -= res.MapUI.action.actionSpace;
        var startX = (size.width - totalWidth) / 2;
        for(let i = 0; i < listAction.length; i++) {
            btn = this.buildingActionButton[listAction[i]];
            btn.setPosition(cc.p(startX + btn.width / 2, 0));
            var action = cc.MoveTo.create(0.1, cc.p(startX + btn.width / 2, res.MapUI.action.height));
            btn.runAction(action);
            startX += btn.width + res.MapUI.action.actionSpace;
        }

        //add resource bar to upgrade button or remove button
        //cc.log(JSON.stringify(listAction));
        if (listAction.indexOf(res.MapUI.action.type.upgrade.name) >= 0) {
            this.updateResourceButton(this.buildingActionButton[res.MapUI.action.type.upgrade.name]);
        }
        if (listAction.indexOf(res.MapUI.action.type.remove.name) >= 0) {
            this.updateResourceButton(this.buildingActionButton[res.MapUI.action.type.remove.name]);
        }
        if (listAction.indexOf(res.MapUI.action.type.quick_finish.name) >= 0) {
            this.updateQuickFinishQuantity(this.buildingActionButton[res.MapUI.action.type.quick_finish.name]);
        }
    },

    updateQuickFinishQuantity: function(button) {
        let currentFocusObjectId = gv.objectManager.getFocusedObjectId();
        let remainingTime = gv.objectManager.getObjectBuildingActionRemainingTime(currentFocusObjectId);
        this.coinRequired.stopAllActions();
        this.coinRequired.setString(gv.resourceUtils.timeToCoin(remainingTime).toString());
        this.coinRequired.setPosition(cc.p(button.x, button.y));

        var action = cc.MoveTo.create(0.1, cc.p(button.x, res.MapUI.action.height));
        this.coinRequired.runAction(action);
    },

    updateResourceButton: function(button) {
        let currentFocusObjectId = gv.objectManager.getFocusedObjectId();
        let resourceList = gv.objectManager.getObjectBuildingActionResource(currentFocusObjectId);
        let count = 0;
        for(let key in resourceList) {
            count += 1;
        }
        let scaleRate = this.resourceScale[count.toString()];

        let subY = 10;
        for(let key in resourceList) {
            if (resourceList.hasOwnProperty(key)) {
                this.resourceRequiredList[key].stopAllActions();
                this.resourceRequiredList[key].setScale(scaleRate);
                this.resourceRequiredList[key].setString(resourceList[key]);
                if (resourceList[key] > gv.resourceManager.getTotalResource(key)) {
                    this.resourceRequiredList[key].setColor(cc.color(255, 0, 0, 1));
                } else {
                    this.resourceRequiredList[key].setColor(cc.color(255, 255, 255, 1));
                }
                this.resourceRequiredList[key].updateAnchorPoint();
                this.resourceRequiredList[key].setPosition(cc.p(button.x, button.y - subY));
                var action = cc.MoveTo.create(0.1, cc.p(this.resourceRequiredList[key].x, res.MapUI.action.height - subY));
                subY += this.resourceRequiredList[key].height * scaleRate;
                this.resourceRequiredList[key].runAction(action);
            }
        }


        //make animation for resource bar


    },

    disableListActionButton: function() {

        //stop all button action
        for(let key in this.buildingActionButton) {
            if (this.buildingActionButton.hasOwnProperty(key)) {
                this.buildingActionButton[key].stopAllActions();
            }
        }
        this.nameAndLevelString.stopAllActions();

        var stringAction = cc.MoveTo.create(0.1,
            cc.p(this.nameAndLevelString.x, -100));
        this.nameAndLevelString.runAction(stringAction);

        for(let key in this.buildingActionButton) {
            if (this.buildingActionButton.hasOwnProperty(key) && this.buildingActionButton[key].y > 0) {
                let btn = this.buildingActionButton[key];
                let action = cc.MoveTo.create(0.1, cc.p(btn.x, 0));
                btn.runAction(action);
            }
        }

        for(let key in this.resourceRequiredList) {
            if (this.resourceRequiredList.hasOwnProperty(key)) {
                let label = this.resourceRequiredList[key];
                let action = cc.MoveTo.create(0.1, cc.p(label.x, 0));
                label.runAction(action);
            }
        }
        let action = cc.MoveTo.create(0.1, cc.p(this.coinRequired.x, 0));
        this.coinRequired.runAction(action);
    },

    handleButtonCallback: function(buttonType) {
        var currentFocusObjectId = gv.objectManager.getFocusedObjectId();
        // var currentFocusObject = gv.objectManager.getObjectRectById(currentFocusObject); 
        // cc.log(currentFocusObject);
        var configObj = gv.objectManager.getObjectConfig(currentFocusObjectId);
        //cc.log(currentFocusObjectId.toString(), buttonType.toString());
        switch (buttonType) {
            case res.MapUI.action.type.remove.name:
                gv.requestManager.handleDeleteObstacleRequest(currentFocusObjectId);
                break;
            case res.MapUI.action.type.upgrade.name:
                this.upgradePopup.openPopup(configObj.type, configObj.level, currentFocusObjectId);
                break;
            case res.MapUI.action.type.quick_finish.name:
                gv.requestManager.handleQuickFinishRequest(currentFocusObjectId, configObj.isBuilding);
                break;
            case res.MapUI.action.type.cancel.name:
                if (configObj.level == 0)
                    gv.requestManager.sendCancelBuildBuildingRequest(currentFocusObjectId);
                else
                    gv.requestManager.sendCancelUpgradeBuildingRequest(currentFocusObjectId);
                break;
            case res.MapUI.action.type.train_troop.name:
                var bar = gv.trainManager.getBarrackList();
                gv.mapLayer.removeFocusObject();
                // cc.log(currentFocusObjectId);
                bar.forEach(function(bar){
                    // cc.log (bar._id);
                    if (bar._id == currentFocusObjectId)
                    {
                        bar.openTrainGUI();
                        return;
                    }});
                break;
            case res.MapUI.action.type.share.name:
                break;
            case res.MapUI.action.type.info.name:
                this.infoPopup.openPopup(configObj.type, configObj.level, configObj.attributeList);
                break;
        }
    },

    showLackOfResPopup: function(actionType, id, resList) {
        this.lackOfResPopup.openPopup(actionType, id, resList);
    },

    showLackOfBuilderPopup: function(actionType, id) {
        this.lackOfBuilderPopup.openPopup(actionType, id);
    },

    closeLackOfPopup: function() {
        this.lackOfBuilderPopup.closePopup();
        this.lackOfResPopup.closePopup();
    },

    onRemove: function() {
       cc.unloadAllAnimationData(this);
    }
});