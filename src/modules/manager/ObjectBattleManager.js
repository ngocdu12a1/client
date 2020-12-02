/**
 * Created by Fersher_LOCAL on 7/25/2020.
 */

var ObjectBattleManager = cc.Class.extend({

    mapGrid: null,
    listObject: null,
    state: null,
    buildingTypeList: null,
    bulletList: null,
    listTroop: null,
    bulletCount: null,
    updateTarget: false,
    buildingPercentTotal: null,
    buildingPercentDestroyed: null,
    tickCount: null,
    battleEnded: null,

    ctor: function() {
        this.mapGrid = new MapGrid(true);
        this.listObject = {};
        this.buildingTypeList = {};
        this.bulletList = {};
        this.listTroop = [];
        this.bulletCount = 0;
        this.tickCount = 0;
        this.battleEnded = false;

    },

    getTickCount: function(){
        return this.tickCount;
    },

    getAttackDirection: function(id, x3P) {
        return this.mapGrid.getAttackDirection(this.listObject[id].getTileRect(), x3P);
    },

    runAttackAnimation: function(x3P) {
        for(let id in this.listObject) {
            if (this.listObject.hasOwnProperty(id) && this.listObject[id].getAcronym().substring(0, 3) == "DEF") {
                this.listObject[id].runAttackAnimation(x3P);
            }
        }
    },

    parseObject: function(data) {
        let obj = {};
        obj.posX = Math.floor(data.cell / 44);
        obj.posY = data.cell % 44;
        obj.type = data.type;
        obj.level = data.level;
        obj.id = data.id;
        obj.gold = data.gold;
        if (!this.listObject.hasOwnProperty(obj.id)) {
            let newobj = gv.objectUtils.getObjectFromInfo(obj);
            if (newobj != null) {

                this.addObject(newobj, false);
            }
        }

    },

    // return false if cannot drop troop, true if troop is dropped
    dropTroop: function(isoPos, type) {
        let tilePos = gv.isometricUtils.isoToTilePos(isoPos);
        if (!this.mapGrid.canDropTroop(tilePos)) {
            cc.log("cannot drop troop here");
            return false;
        }
        var touchBigTilePos = gv.isometricUtils.isoToTilePos(cc.p(isoPos.x, isoPos.y));
        var touchX3TilePos = gv.isometricUtils.tilePosToX3TilePos(cc.p(touchBigTilePos.x, touchBigTilePos.y));
        var offSetX = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
        var offSetY = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
        var time = gv.timeUtils.getCurrentTimeMillis() % offSetX.length;
        var touchTilePos = gv.isometricUtils.x3TilePosToIso(cc.p(touchX3TilePos.x + offSetX[time], touchX3TilePos.y + offSetY[time]));
        let newTroop = new Troop(type, 1, touchTilePos.x, touchTilePos.y);
        // let touchGridPos = gv.isometricUtils.isoToX3TilePos(touchTilePos);
        newTroop._id = this.listTroop.length;
        testnetwork.connector.sendDropTroop(type, newTroop._id, touchX3TilePos.x + offSetX[time], touchX3TilePos.y + offSetY[time], this.getTickCount() + 1);
        gv.mapLayer.addChild(newTroop);
        this.addTroop(newTroop);
        return true;
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
        this.mapGrid.fillGrid(obj.getId(), obj.getTileRect());
        if (!change) {
            gv.mapLayer.addSprite(obj.getSpriteList());
        }

        // relocate the wall after fill the grid so they can connect to each other
        if (obj.getAcronym() == res.MapUI.buildings.type.Wall.name) {
            let p = cc.p(obj.x, obj.y);
            this.setObjectMovingPosition(obj.getId(), cc.p(0, 0));
            this.setObjectMovingPosition(obj.getId(), p);
        }

        if (obj.getAcronym().substring(0, 3) == "DEF") {
            this.mapGrid.addDefRange(obj.getId(), obj.getTileRect(), obj.getMinAttackRange(), obj.getMaxAttackRange());
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


    getBuildingIdList: function() {
        let result = [];
        for(let id in this.listObject) {
            if (this.listObject.hasOwnProperty(id) && this.listObject[id].isBuilding()) {
                result.push(id);
            }
        }
        return result;
    },

    removeObject: function(obj) {
        delete this.listObject[obj.getId()];
        // this.listObject[obj.getId()] = undefined;
        if (obj.isBuilding()) {
            let typeId = this.buildingTypeList[obj.getAcronym()].indexOf(obj.getId());
            this.buildingTypeList[obj.getAcronym()].splice(typeId, 1);
        }
        this.mapGrid.clearGrid(obj.getTileRect());
        if (obj.getAcronym() == res.MapUI.buildings.type.Wall.name) {
            let p = cc.p(obj.x, obj.y);
            obj.setPosition(cc.p(0, 0));
            obj.setPosition(cc.p(p.x, p.y));
        }
        let spriteList = obj.getSpriteList();
        for (let i = 0; i < spriteList.length; i++) {
            spriteList[i].removeFromParent();
        }
        this.mapGrid.drawProhibitedLine();
    },

    initMapObject: function(listBuildingData) {
        for(let i = 0; i < listBuildingData.length; i++) {
            this.parseObject(listBuildingData[i]);
        }
        this.buildingPercentTotal = 0;
        this.buildingPercentDestroyed = 0;
        for(let id in this.listObject) {
            if (this.listObject.hasOwnProperty(id) && this.listObject[id].isBuilding() && this.listObject[id].getAcronym().substring(0, 3) != "WAL") {
                this.buildingPercentTotal += 1;
            }
        }
    },

    setObjectMovingPosition: function(objId, p) {
        let object = this.listObject[objId];

        if (object.x != null && p.x != object.x || p.y != object.y) {
            if (this.availableForMoving(objId))
                this.mapGrid.clearGrid(object.getTileRect());
        }
        if (p.x != object.x || p.y != object.y) {
            if (this.mapGrid.checkAvailable(cc.rect(p.x, p.y, object.width, object.height), objId))
                this.mapGrid.fillGrid(object.getId(), cc.rect(p.x, p.y, object.width, object.height));
        }
        object.setPosition(cc.p(p.x, p.y));

    },

    getObjectById: function(id){
        return this.listObject[id];
    },

    getObjectIsoPositionById: function(id) {
        return cc.p(this.listObject[id].getGrassSprite().x, this.listObject[id].getGrassSprite().y);
    },

    getObjectByTilePos: function(p) {
        let objId = this.mapGrid.getObjectId(p);
        if (objId == -1 || objId == -2)
            return null;
        let object = this.listObject[objId];
        return object;
    },

    availableForMoving: function(objId) {
        let rect = this.getObjectRectById(objId);
        return this.mapGrid.checkAvailable(rect, objId);
    },

    getObjectRectById: function(objId) {
        return this.listObject[objId].getTileRect();
    },

    getMapGrid: function() {
        return this.mapGrid.getGrid();
    },

    getMapX3Grid: function() {
        return this.mapGrid.getX3Grid();
    },

    updateGameState: function() {
        if (this.battleEnded){
            this.updateTroop();
            return;
        }
        try{
            this.updateBullet();
            this.updateTroop();
            this.updateBuilding();

        } catch(e){
            cc.log(e);
        }
        this.tickCount++;
        cc.log("Tickcount ",this.tickCount);
    },

    updateBullet: function() {
        for(let key in this.bulletList) {
            if (this.bulletList.hasOwnProperty(key)) {
                cc.log("Breakpoint bullet: ",key);
                
                let defType = this.bulletList[key].defType;
                let targetX3Pos = this.bulletList[key].targetX3Pos;
                let bulletSprite = this.bulletList[key].sprite;
                let remTick = this.bulletList[key].remainingTick;

                if (defType != res.BattleUI.defenceType.archerTower) {
                    // update bullet UI
                    let targetIsoPos = gv.isometricUtils.centerX3TilePosToIsoPos(targetX3Pos);
                    let deltaX = targetIsoPos.x - this.bulletList[key].xPos;
                    let deltaY = targetIsoPos.y - this.bulletList[key].yPos;
                    let velocity = cc.p(0, 0);
                    velocity.x = deltaX / remTick;
                    velocity.y = deltaY / remTick;
                    this.bulletList[key].xPos += velocity.x;
                    this.bulletList[key].yPos += velocity.y;
                    switch (defType) {
                        case res.BattleUI.defenceType.mortar:
                            this.bulletList[key].zPos += this.bulletList[key].zVelocity * res.BattleUI.timeTick;
                            this.bulletList[key].zVelocity += this.bulletList[key].acceleration * res.BattleUI.timeTick;
                            bulletSprite.setPosition(cc.p(this.bulletList[key].xPos, this.bulletList[key].yPos + this.bulletList[key].zPos * 2));
                            bulletSprite.setScale(1 + this.bulletList[key].zPos / 200);
                            break;
                        case res.BattleUI.defenceType.cannon:
                            bulletSprite.setPosition(cc.p(this.bulletList[key].xPos, this.bulletList[key].yPos));
                            break;
                    }
                }


                this.bulletList[key].remainingTick -= 1;
                if (this.bulletList[key].remainingTick == 0) {
                    switch (defType) {
                        case res.BattleUI.defenceType.cannon:
                            gv.mapUtils.createCannonHitEffect(gv.mapLayer, gv.isometricUtils.centerX3TilePosToIsoPos(cc.p(targetX3Pos.x, targetX3Pos.y)));
                            bulletSprite.removeFromParent();
                            this.attackTroop(this.bulletList[key].targetId, this.bulletList[key].damage);
                            break;
                        case res.BattleUI.defenceType.mortar:
                            gv.mapUtils.createMortarHitEffect(gv.mapLayer, gv.isometricUtils.centerX3TilePosToIsoPos(cc.p(targetX3Pos.x, targetX3Pos.y)));
                            bulletSprite.removeFromParent();
                            for(let troopId = 0; troopId < this.listTroop.length; troopId++) {
                                let troop = this.listTroop[troopId];
                                if (troop.isDead())
                                    continue;
                                let troopX3Pos = gv.isometricUtils.isoToX3TilePos(troop.getCoordinate());
                                let distance = gv.mapUtils.getEuclideanDistance(troopX3Pos, targetX3Pos);
                                if (distance < 5)
                                    this.attackTroop(troopId, this.bulletList[key].damage)
                            }
                            break;
                    }
                    delete this.bulletList[key]
                }
            }
        }
    },

    addBullet: function(targetTroopId, centerIsoPos, endX3P, defType, damage) {
        this.bulletCount += 1;
        this.bulletCount %= 5000;
        let direction = gv.mapUtils.getDirection(centerIsoPos, gv.isometricUtils.x3TilePosToIso(endX3P));
        let directionOffset = gv.mapUtils.getBulletOffsetByDirection(defType, direction);
        let bulletPos = cc.p(centerIsoPos.x + directionOffset.x, centerIsoPos.y + directionOffset.y);
        let distance = gv.mapUtils.getEuclideanDistance(centerIsoPos, gv.isometricUtils.centerX3TilePosToIsoPos(endX3P));
        let flyingTick = gv.mapUtils.getBulletFlyingTick(distance, defType);

        this.bulletList[this.bulletCount] = {
            targetId: targetTroopId,
            targetX3Pos: endX3P,
            damage: damage,
            remainingTick: flyingTick,
            defType: defType,
            xPos: bulletPos.x,
            yPos: bulletPos.y
        };
        if (defType == res.BattleUI.defenceType.cannon) {
            gv.mapUtils.createCannonFireEffect(
                gv.mapLayer,
                cc.p(centerIsoPos.x + directionOffset.x, centerIsoPos.y + directionOffset.y)
            );
        }

        if (defType == res.BattleUI.defenceType.mortar) {
            this.bulletList[this.bulletCount].zPos = 0;
            this.bulletList[this.bulletCount].zVelocity = gv.mapUtils.getMortarZInitialVelocity(this.bulletList[this.bulletCount].zPos, flyingTick * res.BattleUI.timeTick);
            this.bulletList[this.bulletCount].acceleration = -res.BattleUI.bulletSpeed.mortarGravity;
            // cc.log(this.bulletList[this.bulletCount].zPos.toString(), this.bulletList[this.bulletCount].zVelocity.toString(), this.bulletList[this.bulletCount].acceleration.toString());
        }

        if (defType != res.BattleUI.defenceType.archerTower) {
            let bullet = gv.mapUtils.createBullet(defType);
            this.bulletList[this.bulletCount].sprite = bullet;
            gv.mapLayer.addChild(bullet);
        }
    },

    attackBuilding: function(id, damage) {
        this.listObject[id].updateDamage(damage);
    },

    getTroopById: function(troopId) {
        return this.listTroop[troopId];
    },

    addTroop: function(troop) {
        this.listTroop.push(troop);
        
        //let x3Pos = gv.isometricUtils.isoToX3TilePos(cc.p(troop._x, troop._y));
        //let listDefBuilding = this.mapGrid.getDefenceBuildingList(x3Pos);
        //cc.log(JSON.stringify(listDefBuilding));
    },

    updateTroop: function() {
        var countDead = 0;
        for(let troopId = 0; troopId < this.listTroop.length; troopId++) {
            cc.log("Breakpoint troop: ",troopId);
            if (this.listTroop.hasOwnProperty(troopId)) {
                var troop = this.listTroop[troopId];
                if(this.battleEnded){
                    troop.setAttackStatus(false);
                    troop._path.splice(0, troop._path.length);
                    continue; 
                }
                if(troop.isDead()){
                    countDead++;
                    if(countDead == this.listTroop.length){
                        cc.log("all dead");
                        if (gv.mapActionLayer.getRemainingTroopList().length == 0){
                            cc.log("lose");
                            gv.objectManager.sendEndBattleRequest();            
                        }
                    }
                    continue;
                }
                allDead = 0;
                let x3Pos = gv.isometricUtils.isoToX3TilePos(troop.getCoordinate());
                let listDefBuilding = this.mapGrid.getDefenceBuildingList(x3Pos);
                for(let id = 0; id < listDefBuilding.length; id++) {
                    if (this.listObject.hasOwnProperty(listDefBuilding[id])) {
                        let defBuilding = this.listObject[listDefBuilding[id]];
                        if (!defBuilding.isAttacking())
                            defBuilding.updateClosestTroop(troopId, gv.isometricUtils.isoToX3TilePos(troop.getCoordinate()));
                    }
                }
                if (gv.objectManager.getObjectById(troop._buildingId) == undefined)
                {
                    //find target
                    var mapGrid = gv.objectManager.getMapX3Grid();
                    //var tmp = Date.now();
                    var target = gv.troopUtils.findTarget(troop);
                    if (target.id == null){
                        troop.setAttackStatus(false);
                        continue;
                    }
                    //cc.log("find target ", Date.now() - tmp)
                    troop.setAttackMapGrid(mapGrid);
                    troop.setAttackStatus(true);
                    troop.attackBuildingByGrid(target.id, target.x, target.y);
                }
                troop.move(res.BattleUI.timeTick);
                troop.attack(res.BattleUI.timeTick);
            }
        }
    },

    attackTroop: function(troopId, damage) {
        this.listTroop[troopId].getHit(damage);
    },

    destroyBuilding: function(id) {
        // gv.mapUtils.createBuildingExplosionEffect(gv.mapLayer, gv.isometricUtils.tilePosToIso(cc.p(this.listObject[id].x, this.listObject[id].y)));
        // let junkPath = this.listObject[id].getJunkBuildingPath();
        // let junkSprite = gv.mapUtils.createJunkBuildingSprite(
        //     this.listObject[id].getJunkBuildingPath(),
        //     gv.isometricUtils.tilePosToIso(cc.p(this.listObject[id].x, this.listObject[id].y)),
        //     res.MapUI.zPosition.background
        // );

        if (this.listObject[id].isBuilding() && this.listObject[id].getAcronym().substring(0, 3) != "WAL") {
            this.buildingPercentDestroyed += 1;
            if (this.buildingPercentDestroyed / this.buildingPercentTotal >= 0.5 && (this.buildingPercentDestroyed - 1) / this.buildingPercentTotal < 0.5)
                gv.mapActionLayer.addStar();
            if (this.buildingPercentDestroyed / this.buildingPercentTotal == 1)
                gv.mapActionLayer.addStar();
            if (this.listObject[id].getAcronym() == res.MapUI.buildings.type.TownHall.name)
                gv.mapActionLayer.addStar();
            gv.mapActionLayer.updatePercent(Math.ceil(this.buildingPercentDestroyed / this.buildingPercentTotal * 100));
        }
        this.removeObject(this.listObject[id]);
        // gv.mapLayer.addChild(junkSprite);

    },

    updateBuilding: function() {
        for(let objId in this.listObject)
            if (this.listObject.hasOwnProperty(objId) && this.listObject[objId].isBuilding()&&  !this.listObject[objId].isDestroyed()) {
                    cc.log("breakpoint", objId);
                    this.listObject[objId].getAttacked();
                    if (this.listObject[objId].getHitPoints() == 0) {
                        gv.objectManager.destroyBuilding(objId);
                        continue;
                    }
                    this.listObject[objId].resetDamage();
                    if (this.listObject[objId].getAcronym().substring(0, 3) == "DEF") {
                        this.listObject[objId].updateTarget();
                        if (this.listObject[objId].isAttacking() && !this.listObject[objId].inCooldown()) {
                            //cc.log(this.listObject[objId].getTarget());
                            //cc.log(this.listObject[objId].getAcronym(), this.listObject[objId].getAttackSpeed().toString());
                            let building = this.listObject[objId];
                            let troop = this.listTroop[building.getTarget()];
                            let troopIsoPos = troop.getCoordinate();
                            let x3Pos = gv.isometricUtils.isoToX3TilePos(cc.p(troopIsoPos.x, troopIsoPos.y));
                            this.listObject[objId].runAttackAnimation(x3Pos);
                            this.addBullet(building.getTarget(), building.getCenterIsoPos(), x3Pos, this.listObject[objId].getDefenceType(), this.listObject[objId].getDamagePerShot());
                        }
                        if (this.listObject[objId].inCooldown())
                            this.listObject[objId].updateCooldown(res.BattleUI.timeTick);
                    }
            }
    },

    sendEndBattleRequest: function() {
        gv.requestManager.sendEndCampaignRequest(this.tickCount);
    },

    handleEndBattleResponse: function(gold, elixir, star) {
        this.battleEnded = true;
        gv.mapActionLayer.endBattle(gold, elixir, star);
    }

});
