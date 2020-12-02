/**
 *
 * Created by Fersher_LOCAL on 6/18/2020.
 */


var MapUI = cc.Layer.extend({
    size: null,
    tileMap: null,
    background: null,
    currentTouchPosition: null,
    backgroundSprites: null,
    currentScale: null,
    rangeScale: null,
    text: null,
    touches: null,
    currentTouchesDistance: null,
    standardTouchesDistance: null,
    movingObjectTouchId: null,
    maximumMovingDis: null,
    isMovingObject: null,
    inBuildingAction: null,
    holdingTouchTimeElapsed: null,
    screenCurrentVelocity: null,

    ctor: function() {
        this._super();
        return true;
    },

    onEnter: function() {
        this._super();
        this.setLocalZOrder(res.MapUI.zPosition.background);
        gv.mapLayer = this;
        gv.isometricUtils = new IsometricUtils();
        this.size = cc.director.getVisibleSize();
        this.currentScale = 1;
        this.setScale(this.currentScale);
        this.rangeScale = {
            minScale: 0.5,
            maxScale: 2
        };
        this.maximumMovingDis = 20;
        this.movingObjectTouchId = -1;
        this.isMovingObject = false;
        this.inBuildingAction = false;
        this.loadMap();
        this.addTouchListener();
        this.addMouseScrollListener();
        this.loadObjectBackground();
        this.moveCenterCameraToPosition(cc.p(this.tileMap.width / 2, this.tileMap.height / 2));
        this.scheduleUpdate();
        gv.objectManager.initMapObject();
    },

    onRemove: function() {
        cc.unloadAllAnimationData(this);
    },

    loadMap:function() {
        cc.log("Load MapGrid");
        this.tileMap = new cc.TMXTiledMap();
        this.tileMap.initWithTMXFile(res.MapUI.tmxMap);
        this.background = this.tileMap.getLayer("bg2");
        this.tileMap.setLocalZOrder(res.MapUI.zPosition.background);
        this.addChild(this.tileMap);
        this.setAnchorPoint(cc.p(0, 0));

        cc.log("Load MapBackground");
        this.loadBackgroundSprites();

        for (let i = 0; i < 4; i++) {
            let sp = this.backgroundSprites[i];

            let pos = cc.p(this.tileMap.width / 2, this.tileMap.height / 2);
            //if (i == 2 || i == 3)
            //    pos.y += 1;
            //if (i == 1 || i == 3)
            //    pos.x += 1;
            sp.setPosition(pos);
            this.addChild(sp);
        }
    },

    loadObjectBackground: function() {
        gv.objectManager.addSpriteList();
    },

    loadBackgroundSprites:function() {

        this.backgroundSprites = [];
        for (let i = 0; i < 4; i++) {
            this.backgroundSprites[i] = cc.Sprite(res.MapUI.background.backgroundLayer[i]);
            this.backgroundSprites[i].setLocalZOrder(res.MapUI.zPosition.background);
        }
        this.backgroundSprites[0].setAnchorPoint(cc.p(1, 1));
        this.backgroundSprites[1].setAnchorPoint(cc.p(0, 1));
        this.backgroundSprites[2].setAnchorPoint(cc.p(1, 0));
        this.backgroundSprites[3].setAnchorPoint(cc.p(0, 0));

        let xRange = this.backgroundSprites[0].width + this.backgroundSprites[1].width;
        let yRange = this.backgroundSprites[0].height + this.backgroundSprites[2].height;
        let backgroundScale = cc.p(res.MapUI.grassTileSize.width * res.MapUI.background.scale.backgroundLayer / xRange,
                            res.MapUI.grassTileSize.height * res.MapUI.background.scale.backgroundLayer / yRange);
        for(i = 0; i < 4; i++) {
            this.backgroundSprites[i].setScale(backgroundScale.x, backgroundScale.y);
        }
    },

    addTouchListener:function() {
        let thisPointer = this;
        this.touches = {};
        this.standardTouchesDistance = 40;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,

            onTouchesBegan: function(touches, event) {
                //cc.log("Mouse Tile Pos:", tilePos.x.toString(), tilePos.y.toString());
                thisPointer.screenCurrentVelocity = null;
                for(let i = 0; i < touches.length; i++) {
                    let key = touches[i].getID();
                    thisPointer.touches[key] = {
                        touch: cc.p(touches[i].getLocationX(), touches[i].getLocationY()),
                        movingDis: 0
                    };

                    if (thisPointer.focusedObject != null) {
                        let tilePos = thisPointer.getMouseTilePos(cc.p(touches[0].getLocationX(), touches[0].getLocationY()));
                        let objectRect = thisPointer.getObjectRectById(thisPointer.focusedObject.id);
                        if (thisPointer.focusedObject.isBuilding && gv.mapUtils.isInRect(tilePos, objectRect)) {
                            thisPointer.startMovingState(touches[i]);
                        }
                    }
                }
                thisPointer.updateTouchesList();
                return true;
            },

            onTouchesMoved: function(touches, event) {
                thisPointer.screenCurrentVelocity = null;

                for(let i = 0; i < touches.length; i++) {
                    let key = touches[i].getID();
                    if (thisPointer.touches.hasOwnProperty(key)) {
                        let diffX = touches[i].getLocationX() - thisPointer.touches[key].touch.x;
                        let diffY = touches[i].getLocationY() - thisPointer.touches[key].touch.y;
                        thisPointer.touches[key].movingDis += Math.sqrt(diffX * diffX + diffY * diffY);
                        thisPointer.touches[key].touch = cc.p(touches[i].getLocationX(), touches[i].getLocationY());
                    }
                }

                let touchesList = thisPointer.getTouchesList();
                if (touchesList.length == 1) {
                    let newX, newY;
                    if (touches[0].getID() == thisPointer.movingObjectTouchId) {
                        let tilePos = thisPointer.getMouseTilePos(cc.p(touches[0].getLocationX(), touches[0].getLocationY()));
                        newX = tilePos.x - thisPointer.focusedObject.offset.x;
                        newY = tilePos.y - thisPointer.focusedObject.offset.y;
                        thisPointer.setObjectMovingPosition(cc.p(newX, newY));
                    } else {
                        newX = thisPointer.x + touchesList[0].x - thisPointer.currentTouchPosition.x;
                        newY = thisPointer.y + touchesList[0].y - thisPointer.currentTouchPosition.y;
                        thisPointer.setPos(cc.p(newX, newY));
                        thisPointer.holdingTouchTimeElapsed = 0;
                    }
                } else if (touchesList.length == 2) {
                    let center = cc.p((touchesList[0].x + touchesList[1].x) / 2, (touchesList[0].y + touchesList[1].y) / 2);
                    let newTouchesDistance = gv.mapUtils.getEuclideanDistance(touchesList[0], touchesList[1]);
                    let distanceDiff = newTouchesDistance / thisPointer.currentTouchesDistance;
                    thisPointer.monitorScale(center.x, center.y, distanceDiff);
                }

                thisPointer.updateTouchesList();
            },

            onTouchesEnded: function(touches, event) {

                for(let i = 0; i < touches.length; i++) {
                    let key = touches[i].getID();
                    if (thisPointer.touches.hasOwnProperty(key)) {
                        if (!thisPointer.inBuildingAction) {
                            // cc.log(JSON.stringify(gv.isometricUtils.isoToTilePos(cc.p((touches[i].getLocationX() - thisPointer.x) / thisPointer.currentScale , (touches[i].getLocationY() - thisPointer.y)/ thisPointer.currentScale))));
                            if (thisPointer.movingObjectTouchId == key) {
                                thisPointer.removeMovingState(false);
                            }
                            if (thisPointer.touches[key].movingDis <= thisPointer.maximumMovingDis) {
                                //Tap behavior
                                thisPointer.removeMovingState(true);
                                let tilePos = thisPointer.getMouseTilePos(cc.p(touches[0].getLocationX(), touches[0].getLocationY()));
                                thisPointer.focusObject(tilePos);
                            }
                        } else {
                            if (thisPointer.movingObjectTouchId == key) {
                                thisPointer.setNewMovingTouch(null);
                            }
                        }
                        delete thisPointer.touches[key];
                    }
                }
                thisPointer.updateTouchesList();
            }
        }, thisPointer);
    },

    update: function(dt) {


        let touchList = this.getTouchesList();
        if (touchList.length > 0) {
            this.holdingTouchTimeElapsed += 1;
        }
        if (this.holdingTouchTimeElapsed > 10) {
            this.screenCurrentVelocity = null;
        }
        if (this.screenCurrentVelocity != null && touchList.length == 0) {
            let newPos = cc.p(this.x + this.screenCurrentVelocity.x, this.y + this.screenCurrentVelocity.y);
            this.setPos(newPos);
            this.screenCurrentVelocity.x *= 1 - dt * 10;
            this.screenCurrentVelocity.y *= 1 - dt * 10;
            if (Math.abs(this.screenCurrentVelocity.x) < 1 && Math.abs(this.screenCurrentVelocity.y) < 1)
                this.screenCurrentVelocity = null;
        }
    },

    getMouseTilePos: function(p) {
        let scalePos = cc.p(p.x - this.x, p.y - this.y);
        scalePos.x /= this.currentScale;
        scalePos.y /= this.currentScale;
        return gv.isometricUtils.isoToTilePos(scalePos);
    },

    getTouchesList: function() {
        let touchesList = [];
        for(let key in this.touches) {
            if (this.touches.hasOwnProperty(key)) {
                touchesList.push(cc.p(this.touches[key].touch.x, this.touches[key].touch.y))
            }
        }
        return touchesList;
    },

    updateTouchesList: function() {
        let touchesList = this.getTouchesList();

        if (touchesList.length == 1) {
            this.currentTouchPosition = cc.p(touchesList[0].x, touchesList[0].y);
        }
        if (touchesList.length == 2) {
            this.currentTouchesDistance = gv.mapUtils.getEuclideanDistance(touchesList[0], touchesList[1]);
        }

    },

    getObjectRectById: function(objId) {
        return gv.objectManager.getObjectRectById(objId);
    },

    setNewMovingTouch: function(touch) {
        if (this.focusedObject == null)
            return;
        if (touch == null) {
            this.movingObjectTouchId = -1;
            return;
        }
        this.movingObjectTouchId = touch.getID();
        let touchTilePos = this.getMouseTilePos(cc.p(touch.getLocationX(), touch.getLocationY()));
        this.focusedObject.offset = gv.objectManager.getMovingOffset(touchTilePos, this.focusedObject.id);
    },

    focusObject: function(p) {
        let newFocusedObject = gv.objectManager.getFocusedObjectByTile(p);
        if (newFocusedObject == null) {
            this.removeFocusObject();
            return;
        }
        if (this.focusedObject != null) {
            if (this.focusedObject.id != newFocusedObject.id)
                this.removeFocusObject();
            else
                return;
        }
        this.focusedObject = newFocusedObject;
        gv.objectManager.enableFocusObject(this.focusedObject.id);
    },

    getFocusedObjectId: function() {
        if (this.focusedObject == null)
            return res.MapUI.buildings.id.unavailable;
        return this.focusedObject.id;
    },

    removeFocusObject: function() {
        if (this.focusedObject == null) {
            return;
        }
        gv.objectManager.removeFocusObject(this.focusedObject.id);
        this.focusedObject = null;
    },

    startMovingState: function(touch) {
        this.isMovingObject = true;
        gv.objectManager.startMovingState(this.focusedObject);
        this.setNewMovingTouch(touch);
    },

    removeMovingState: function(forceRemove) {
        if (!this.isMovingObject) {
            return;
        }
        this.isMovingObject = gv.objectManager.removeMovingState(this.focusedObject, forceRemove);
        this.movingObjectTouchId = -1;

    },

    addMouseScrollListener: function() {
        if (cc.sys.capabilities.hasOwnProperty("mouse")) {
            let thisPointer = this;
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,

                onMouseScroll: function(event) {
                     thisPointer.monitorScale(event.getLocationX(), event.getLocationY(), 1 + 0.1 * event.getScrollY());
                    //gv.requestManager.handleBuildBuildingRequest(res.MapUI.buildings.type.Wall.name);
                }
            }, thisPointer);
        }
    },

    monitorScale: function(mouseX, mouseY, scaleDiff) {
        let curScaleRate = this.currentScale;
        this.currentScale *= scaleDiff;
        this.currentScale = Math.max(this.currentScale, this.rangeScale.minScale);
        this.currentScale = Math.min(this.currentScale, this.rangeScale.maxScale);
        let newScaleRate = this.currentScale;
        let curMousePositionToLayer = cc.p(mouseX - this.x, mouseY - this.y);
        let newMousePositionToLayer = cc.p(curMousePositionToLayer.x / curScaleRate * newScaleRate, curMousePositionToLayer.y / curScaleRate * newScaleRate);
        this.setScale(newScaleRate);
        this.setPos(cc.p(mouseX - newMousePositionToLayer.x, mouseY - newMousePositionToLayer.y));
    },

    setObjectMovingPosition: function(p) {
        gv.objectManager.setObjectMovingPosition(this.focusedObject.id, p);
    },

    setPos: function(p) {
        let newX = p.x;
        let newY = p.y;
        let scaleRate = this.currentScale;
        let minX = 0;
        let minY = 0;
        let maxX = this.tileMap.width * scaleRate - this.size.width;
        let maxY = this.tileMap.height * scaleRate - this.size.height;
        newX = Math.min(newX, - minX);
        newY = Math.min(newY, - minY);
        newX = Math.max(newX, - maxX);
        newY = Math.max(newY, - maxY);
        let touchesList = this.getTouchesList();
        if (touchesList.length != 0) {
            this.screenCurrentVelocity = {
                x: newX - this.x,
                y: newY - this.y
            };
            if (newX == -minX || newX == -maxX)
                this.screenCurrentVelocity.x *= -1;
            if (newY == -minY || newY == -maxY)
                this.screenCurrentVelocity.y *= -1;
        }
        this.setPosition(cc.p(newX, newY));
    },

    getCenterCameraPosition: function() {
        return cc.p((this.size.width / 2 - this.x) / this.currentScale, (this.height / 2 - this.y) / this.currentScale);
    },

    moveCenterCameraToPosition: function(p) {
        let pos = cc.p(p.x * this.currentScale, p.y * this.currentScale);
        let mapPos = cc.p(this.size.width / 2 - pos.x, this.size.height / 2 - pos.y);
        this.setPos(mapPos);
    },

    addSprite: function(spriteList) {
        for(let i = 0; i < spriteList.length; i++) {
            this.addChild(spriteList[i]);
        }
    },

    startBuildingNewBuilding: function(focusedObject) {
        if (this.focusedObject != null)
            this.removeFocusObject();
        this.focusedObject = focusedObject;
        this.isMovingObject = true;
        gv.objectManager.enableFocusObject(this.focusedObject.id);
        gv.objectManager.startMovingState(focusedObject);
        this.inBuildingAction = true;
    },

    finishBuildingNewBuilding: function() {
        this.removeFocusObject();
        this.isMovingObject = false;
        this.inBuildingAction = false;
    }

});
