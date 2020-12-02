/**
 *
 * Created by Fersher_LOCAL on 6/22/2020.
 */
var ObjectManager = cc.Class.extend({
    mapGrid: null,
    listObject: null,
    greenSprite: null,
    redSprite: null,
    arrowSprite: null,
    nameString: null,
    levelString: null,
    nameAndLevelString: null,
    buildingBuildActionButton: null,
    buildingTypeList: null,

    ctor: function() {
        this.mapGrid = new MapGrid(false);
        this.greenSprite = {};
        this.redSprite = {};
        this.arrowSprite = {};
        this.listObject = {};
        this.buildingTypeList = {};
        this.initSprite();
    },

    parseObject: function(data) {
        if (!this.listObject.hasOwnProperty(data.id)) {
            let newobj = gv.objectUtils.getObjectFromInfo(data);
            if (newobj != null) {
                this.addObject(newobj, false);
                newobj.startBuildingAction(newobj.startActionTimestamp);
            }
        } else if (this.listObject[data.id].isBuilding()) {
            this.listObject[data.id].updateBuildingAttribute(data);
            this.listObject[data.id].setPosition(cc.p(this.listObject[data.id].x, this.listObject[data.id].y));
        }

    },


    initSprite: function() {
        this.nameString = gv.mapUtils.createNameLabel();
        this.levelString = gv.mapUtils.createLevelLabel();
        this.redSprite = gv.mapUtils.createRedSprite();
        this.arrowSprite = gv.mapUtils.createArrowSprite();
        this.greenSprite = gv.mapUtils.createGreenSprite();
        this.buildingBuildActionButton = gv.mapUtils.createBuildingBuildActionButton();
    },

    addSpriteList: function() {
        let result = [
            this.levelString,
            this.nameString,
            this.buildingBuildActionButton[res.MapUI.action.buildAction.type.accept.name],
            this.buildingBuildActionButton[res.MapUI.action.buildAction.type.cancel.name]
        ];
        for(let i = 1; i <= res.MapUI.maxObjectSize.width; i++) {
            result.push(this.greenSprite[i]);
            result.push(this.redSprite[i]);
            result.push(this.arrowSprite[i]);
        }
        gv.mapLayer.addSprite(result);
    },

    // if change is true, object sprite list is added to the map previously, only object Id need to be updated
    addObject: function(obj, change) {
        //cc.log("newId", obj.getId());
        if (obj.isBuilding() && obj.getId() != res.MapUI.buildings.id.newBuilding) {
            if (this.buildingTypeList[obj.getAcronym()] == null) {
                this.buildingTypeList[obj.getAcronym()] = [];
            }
            this.buildingTypeList[obj.getAcronym()].push(obj.getId());
        }
        if (obj.getAcronym() == res.MapUI.buildings.type.Barrack.name && obj.getLevel() > 0) {
            gv.trainManager.addBarrack(obj.getId(), obj.getLevel());
        }
        this.listObject[obj.getId()] = obj;
        cc.log(JSON.stringify(obj.getTileRect()));
        this.mapGrid.fillGrid(obj.getId(), obj.getTileRect());
        if (!change) {
            gv.mapLayer.addSprite(obj.getSpriteList());
        }
        if (obj.getAcronym() == res.MapUI.buildings.type.Wall.name) {
            let p = cc.p(obj.x, obj.y);
            this.setObjectMovingPosition(obj.getId(), cc.p(0, 0));
            this.setObjectMovingPosition(obj.getId(), p);
            this.disableGreenRed(obj.width);
        }
        this.mapGrid.drawProhibitedLine();
    },

    getListObjectByType: function(type) {
        if (this.buildingTypeList[type] == null)
            return [];
        let result = [];
        for(let i = 0; i < this.buildingTypeList[type].length; i++) {
            result.push(this.listObject[this.buildingTypeList[type][i]]);
        }
        return result;
    },

    removeObject: function(obj) {
        delete this.listObject[obj.getId()];
        if (obj.isBuilding() && obj.getId() != res.MapUI.buildings.id.newBuilding) {
            let typeId = this.buildingTypeList[obj.getAcronym()].indexOf(obj.getId());
            this.buildingTypeList[obj.getAcronym()].splice(typeId, 1);
        }
        this.mapGrid.clearGrid(obj.getTileRect());
        let spriteList = obj.getSpriteList();
        for(let i = 0; i < spriteList.length; i++) {
            spriteList[i].removeFromParent();
        }
        this.mapGrid.drawProhibitedLine();
    },

    enableActionButton: function(objId) {
        let object = this.listObject[objId];
        let listAction = object.getAction();
        if (listAction.length == 0)
            return;
        gv.mapActionLayer.enableListActionButton(listAction, object.getNameString() + " " + object.getLevelString());
    },

    disableActionButton: function(objId) {
        let object = this.listObject[objId];
        let listAction = object.getAction();
        if (listAction.length == 0)
            return;
        gv.mapActionLayer.disableListActionButton();
    },

    getFocusedObjectByTile: function(p) {
        let object = this.getObjectByTilePos(p);
        if (object == null)
            return null;
        let isBuilding = object.isBuilding();
        return {
            id: object.getId(),
            offset: cc.p(p.x - object.x, p.y - object.y),
            isBuilding: isBuilding,
            oldPosition: cc.p(object.x, object.y)
        };
    },

    enableFocusObject: function(objId) {
        let object = this.listObject[objId];
        let isoPos = gv.isometricUtils.tilePosToIso(cc.p(object.x, object.y));
        let posName = object.getNameStringPosition();
        if (object.isBuilding())
            gv.nodeUtils.monitorNode(this.arrowSprite[object.width], res.MapUI.zPosition.arrow, isoPos);
        gv.nodeUtils.monitorLabel(this.nameString, res.MapUI.zPosition.arrow, posName, object.getNameString());
        gv.nodeUtils.monitorLabel(this.levelString, res.MapUI.zPosition.arrow, posName, object.getLevelString());
        if (objId != res.MapUI.buildings.id.newBuilding) {
            this.enableActionButton(objId);
        }
        this.runFocusAnimation(object);
    },

    runFocusAnimation: function(object) {
        this.arrowSprite[object.width].stopAllActions();
        this.arrowSprite[object.width].setScale(0);
        this.arrowSprite[object.width].runAction(new cc.ScaleTo(0.1,1));
        object.runFocusAnimation();
    },

    getFocusedObjectId: function() {
        return gv.mapLayer.getFocusedObjectId();
    },

    getObjectConfig: function(id) {
        let result = {
            type: this.listObject[id].getAcronym(),
            isBuilding: this.listObject[id].isBuilding()
        };
        if (this.listObject[id].isBuilding()) {
            result.attributeList = this.listObject[id].getAttributeList();
        }
        if (this.listObject[id].isBuilding()) {
            result.level = this.listObject[id].getLevel();
        }
        return result;
    },

    getObjectBuildingActionRemainingTime: function(id) {
        return this.listObject[id].getRemainingBuildingActionTime();
    },

    setObjectMovingPosition: function(objId, p) {
        let object = this.listObject[objId];
        let isoPos = gv.isometricUtils.tilePosToIso(cc.p(p.x, p.y));

        gv.nodeUtils.monitorNode(this.arrowSprite[object.width], null, isoPos);
        gv.nodeUtils.monitorNode(this.greenSprite[object.width], null, isoPos);
        gv.nodeUtils.monitorNode(this.redSprite[object.width], null, isoPos);

        if (object.x != null && p.x != object.x || p.y != object.y) {
            if (this.availableForMoving(objId))
                this.mapGrid.clearGrid(object.getTileRect());
        }
        if (p.x != object.x || p.y != object.y) {
            if (this.mapGrid.checkAvailable(cc.rect(p.x, p.y, object.width, object.height), objId))
                this.mapGrid.fillGrid(object.getId(), cc.rect(p.x, p.y, object.width, object.height));
        }
        object.setPosition(cc.p(p.x, p.y));
        if (this.availableForMoving(objId)) {
            gv.nodeUtils.monitorNode(this.greenSprite[object.width], res.MapUI.zPosition.greenred, null);
            gv.nodeUtils.monitorNode(this.redSprite[object.width], res.MapUI.zPosition.invisible, null);
        } else {
            gv.nodeUtils.monitorNode(this.redSprite[object.width], res.MapUI.zPosition.greenred, null);
            gv.nodeUtils.monitorNode(this.greenSprite[object.width], res.MapUI.zPosition.invisible, null);
        }

        let posName = object.getNameStringPosition();
        let acceptBtn = this.buildingBuildActionButton[res.MapUI.action.buildAction.type.accept.name];
        let cancelBtn = this.buildingBuildActionButton[res.MapUI.action.buildAction.type.cancel.name];
        gv.nodeUtils.monitorButton(acceptBtn, null, cc.p(posName.x, posName.y + acceptBtn.height), null);
        gv.nodeUtils.monitorButton(cancelBtn, null, cc.p(posName.x, posName.y + cancelBtn.height), null);
        gv.nodeUtils.monitorLabel(this.nameString, null, posName, null);
        gv.nodeUtils.monitorLabel(this.levelString, null, posName, null);
    },

    startMovingState: function(focusedObject) {
        this.disableActionButton(focusedObject.id);
        let object = this.listObject[focusedObject.id];
        //cc.log(object.x.toString(), object.y.toString());
        this.setObjectMovingPosition(
            focusedObject.id,
            cc.p(object.x, object.y)
        );
    },

    //return true if continue moving, false otherwise
    removeMovingState: function(focusedObject, forceRemove) {
        let object = this.listObject[focusedObject.id];
        if (this.availableForMoving(focusedObject.id)) {
            gv.requestManager.sendMoveBuildingRequest(focusedObject.id, focusedObject.oldPosition.x, focusedObject.oldPosition.y, object.x, object.y);
            // this.confirmMove(true, object.id, focusedObject.oldPosition.x, focusedObject.oldPosition.y, object.x, object.y);
            this.enableActionButton(focusedObject.id);
            focusedObject.oldPosition = cc.p(object.x, object.y);
            return false;
        } else if (forceRemove) {
            this.moveToOldPos(focusedObject.id, cc.p(focusedObject.oldPosition.x, focusedObject.oldPosition.y));
            return false;
        }
        return true;
    },

    moveToOldPos: function(id, oldPos) {
        this.setObjectMovingPosition(id, oldPos);
        let object = this.listObject[id];
        this.disableGreenRed(object.width);
    },

    getBuildingIdList: function() {
        let result = [];
        for(let id in this.listObject) {
            if (this.listObject.hasOwnProperty(id) && this.listObject[id].isBuilding()) {
                result.push(id);
            }
        }
        return result;
    },

    confirmMove: function(success, id, xOld, yOld, x, y) {
        let object = this.listObject[id];
        if (!success || object.x != x || object.y != y) {
            //cc.log(xOld.toString(), yOld.toString());
            this.moveToOldPos(id, cc.p(xOld, yOld));
            return;
        }
        this.disableGreenRed(object.width);
        this.mapGrid.drawProhibitedLine();
    },

    disableGreenRed: function(size) {
        gv.nodeUtils.monitorNode(this.greenSprite[size], res.MapUI.zPosition.invisible, null);
        gv.nodeUtils.monitorNode(this.redSprite[size], res.MapUI.zPosition.invisible, null);
    },

    availableForMoving: function(objId) {
        let rect = this.getObjectRectById(objId);
        return this.mapGrid.checkAvailable(rect, objId);
    },

    getObjectRectById: function(objId) {
        return this.listObject[objId].getTileRect();
    },

    removeFocusObject: function(objId) {
        let object = this.listObject[objId];
        gv.nodeUtils.monitorNode(this.arrowSprite[object.width], res.MapUI.zPosition.invisible, null);
        gv.nodeUtils.monitorLabel(this.nameString, res.MapUI.zPosition.invisible, null, null);
        gv.nodeUtils.monitorLabel(this.levelString, res.MapUI.zPosition.invisible, null, null);
        object.disableFocusAnimation();
        this.disableActionButton(objId);
    },

    getObjectIsoPositionById: function(id) {
        return cc.p(this.listObject[id].getGrassSprite().x, this.listObject[id].getGrassSprite().y);
    },

    getMovingOffset: function(p, objId){
        let object = this.listObject[objId];
        return cc.p(p.x - object.x, p.y - object.y);
    },

    getObjectBuildingActionResource: function(id) {
        return this.listObject[id].getBuildingActionResource();
    },

    startBuildingNewBuilding: function(type) {
        if (this.listObject.hasOwnProperty(res.MapUI.buildings.id.newBuilding)) {
            return;
        }
        let objInfo = {
            type: type,
            id: res.MapUI.buildings.id.newBuilding,
            level: 0,
            startActionTimestamp: 0
        };
        let newObj = gv.objectUtils.getObjectFromInfo(objInfo);
        let startPosition = this.mapGrid.getAvailablePositionForRect(newObj.getTileRect());
        if (startPosition == null)
            startPosition =  gv.isometricUtils.isoToTilePos(gv.mapLayer.getCenterCameraPosition());
        gv.mapLayer.moveCenterCameraToPosition(gv.isometricUtils.tilePosToIso(startPosition));
        let acceptBtn = this.buildingBuildActionButton[res.MapUI.action.buildAction.type.accept.name];
        let cancelBtn = this.buildingBuildActionButton[res.MapUI.action.buildAction.type.cancel.name];
        acceptBtn.setEnabled(true);
        cancelBtn.setEnabled(true);
        gv.nodeUtils.monitorButton(acceptBtn, res.MapUI.zPosition.button, null, true);
        gv.nodeUtils.monitorButton(cancelBtn, res.MapUI.zPosition.button, null, true);
        newObj.setPosition(startPosition);
        this.addObject(newObj, false);
        let focusesObject = {
            id: newObj.id,
            isBuilding: true
        };
        gv.mapLayer.startBuildingNewBuilding(focusesObject);
    },

    finishBuildingNewBuilding: function() {
        let acceptBtn = this.buildingBuildActionButton[res.MapUI.action.buildAction.type.accept.name];
        let cancelBtn = this.buildingBuildActionButton[res.MapUI.action.buildAction.type.cancel.name];
        gv.nodeUtils.monitorButton(acceptBtn, res.MapUI.zPosition.invisible, null, false);
        gv.nodeUtils.monitorButton(cancelBtn, res.MapUI.zPosition.invisible, null, false);
        acceptBtn.setEnabled(false);
        cancelBtn.setEnabled(false);
    },

    assignBuilderHut: function(id) {
        var bdhId = gv.resourceManager.getFreeBuilderHutId();
        this.listObject[bdhId].assignToBuilding(id);
    },

    startBuildingAction: function(id, startActionTimestamp) {
        let object = this.listObject[id];
        object.startBuildingAction(startActionTimestamp);
        if (object.getAcronym() != res.MapUI.buildings.type.BuilderHut.name)
            this.assignBuilderHut(id);
        gv.mapLayer.removeFocusObject();
    },

    finishBuildingAction: function(id) {
        if (gv.mapLayer.getFocusedObjectId() == id) {
            gv.mapLayer.removeMovingState(true);
            gv.mapLayer.removeFocusObject();
        }
        this.listObject[id].finishBuildingAction();
    },

    cancelBuildingAction: function(id) {
        if (gv.mapLayer.getFocusedObjectId() == id) {
            gv.mapLayer.removeMovingState(true);
            gv.mapLayer.removeFocusObject();
        }
        if (this.listObject[id].isBuilding()) {
            this.listObject[id].cancelBuildingAction();
            if (this.listObject[id].getLevel() == 0)
                this.removeObject(this.listObject[id]);
        }
    },

    acceptBuild: function() {
        let id = res.MapUI.buildings.id.newBuilding;
        if (!this.availableForMoving(id))
            return;
        let newObj = this.listObject[id];
        gv.requestManager.sendBuildNewBuildingRequest(newObj.getAcronym(), newObj.x, newObj.y);
        // this.confirmBuild(true, 100, newObj.getAcronym(), newObj.x, newObj.y, (new Date()).getTime());
    },

    confirmBuild: function(success, newId, type, x, y, startActionTimestamp) {
        let newObj = this.listObject[res.MapUI.buildings.id.newBuilding];
        if (!success || newObj.x != x || newObj.y != y || newObj.getAcronym() != type) {
            this.cancelBuild();
            return;
        }
        gv.mapLayer.finishBuildingNewBuilding();
        newObj.setId(newId);
        this.addObject(newObj, true);
        delete this.listObject[res.MapUI.buildings.id.newBuilding];
        this.disableGreenRed(newObj.width);
        this.finishBuildingNewBuilding();
        this.startBuildingAction(newId, startActionTimestamp);
    },

    cancelBuild: function() {
        gv.mapLayer.finishBuildingNewBuilding();
        let object = this.listObject[res.MapUI.buildings.id.newBuilding];
        this.removeObject(object);
        this.disableGreenRed(object.width);
        this.finishBuildingNewBuilding();
    },

    getObjectByTilePos: function(p) {
        let objId = this.mapGrid.getObjectId(p);
        if (objId == -1 || objId == -2)
            return null;
        let object = this.listObject[objId];
        return object;
    },

    getObjectById: function(id) {
        return this.listObject[id];
    },

    getObjectRequiredResourceList: function(id) {
        return this.listObject[id].getBuildingActionResource();
    },

    showLackOfResPopup: function(actionType, id, resList) {
        gv.mapActionLayer.showLackOfResPopup(actionType, id, resList);
    },

    showLackOfBuilderPopup: function(actionType, id) {
        gv.mapActionLayer.showLackOfBuilderPopup(actionType, id);
    },

    closeLackOfPopup: function() {
        gv.mapActionLayer.closeLackOfPopup();
    },

    initMapObject: function() {
        //testnetwork.connector.sendMapObjectCountRequest();
        testnetwork.connector.sendGetMapInfoListRequest();
    },

    getMapGrid: function() {
        return this.mapGrid.getGrid();
    }
});
