var troopDirection = {};
troopDirection.south = 0;
troopDirection.southWest = 1;
troopDirection.west = 2;
troopDirection.northWest = 3;
troopDirection.north = 4;
troopDirection.northEast = 5;
troopDirection.east = 6;
troopDirection.southEast = 7;

var velocityScale = 7;

var grassTileEdge = Math.sqrt((res.MapUI.grassTileSize.height/2) * (res.MapUI.grassTileSize.height/2) + (res.MapUI.grassTileSize.width/2) * (res.MapUI.grassTileSize.width/2));
var sinAlpha = (res.MapUI.grassTileSize.height/2)/grassTileEdge;
var cosAlpha = (res.MapUI.grassTileSize.width/2)/grassTileEdge;

var state = {};
state.idle = "idle";
state.run = "run";
state.attack = "attack01";

var speed = 2.8 / 50;

var spriteLength = {};
spriteLength.idle = {
    "ARM_1": 6,
    "ARM_2": 6,
    "ARM_4": 6,
    "ARM_6": 6
};
spriteLength.run = {
    "ARM_1": 14,
    "ARM_2": 16,
    "ARM_4": 16,
    "ARM_6": 16
};
spriteLength.attack = {
    "ARM_1": 13,
    "ARM_2": 13,
    "ARM_4": 13,
    "ARM_6": 12
};

var epsilon = 0.001;

var Troop = cc.Layer.extend({
    _id: null,
    _mapGrid: null,
    _x: null,
    _y: null,
    _gridPosX: null,
    _gridPosY: null,
    _name: null,
    _velocity: null,
    _remainX: null,
    _remainY: null,
    _level : null,
    _buildingId: null,
    _status: null,
    _currentDirection: null,
    _direction: null,
    _troop: null,
    _isMoving: null,
    _isAttacking: null,
    _idle: null,
    _run: null,
    _attack: null,
    _path: null,
    _attackMapGrid: null,
    _attackStatus: null,
    _hitPoints: null,
    _damagePerAttack: null,
    _attackSpeed: null,
    direction: null,
    prevGridX: null,
    prevGridY: null,
    targetGridX: null,
    targetGridY: null,
    _healthBar: null,
    ctor:function(name, level, x, y){
        this._super();
        this._id = 0;
        this._remainX = 0;
        this._remainY = 0;
        this._buildingId = null;
        this._status = state.idle;
        this._currentDirection = 0;
        this._direction = [troopDirection.south, troopDirection.southWest, troopDirection.west, troopDirection.northWest,
                    troopDirection.north, troopDirection.northEast, troopDirection.east, troopDirection.southEast];
        this._isMoving = false;
        this._isAttacking = false;
        this._idle = [];
        this._run = [];
        this._attack = [];
        this._path = [];
        this._attackMapGrid = [];
        this._attackStatus = false;
        this.direction = -1;
        this.prevGridX = 0;
        this.prevGridY = 0;
        this.targetGridX = 0;
        this.targetGridY = 0;

        this._mapGrid = gv.objectManager.getMapGrid();
        this._name = name;
        this._level = level;
        this._x = x;
        this._y = y;
        var pos = cc.p(this._x, this._y);
        var tilePos = gv.isometricUtils.isoToTilePos(pos);
        this._gridPosX = tilePos.x;
        this._gridPosY = tilePos.y;
        this._velocity = gv.dataWrapper.getTroopBaseConfig(name).moveSpeed * velocityScale;
        this._hitPoints = gv.dataWrapper.getTroopConfig(name, 1).hitpoints;
        this._idle = [];
        this._run = [];
        this._isAttacking = false;
        this._damagePerAttack = gv.dataWrapper.getTroopConfig(name, 1).damagePerAttack;
        this._attackSpeed = gv.dataWrapper.getTroopBaseConfig(name).attackSpeed;
        this.init();
    },
    init:function(){
        var self = this;

        var path = res.troop.animation + this._name + "_" + this._level + "/" + this._name + "_" + this._level;
        var spritePath = path + "/idle/image0000.png";
        this._troop = new cc.Sprite(spritePath);
        this.addChild(this._troop);
        this._troop.setPosition(cc.p(this._x, this._y));
        this._healthBar = new cc.Sprite(res.troop.healthBarBackground);
        this._troop.addChild(this._healthBar);
        this._healthBar.setPosition(cc.p(this._troop.width/2, this._troop.height/1.3));

        var healthProgress = ccui.LoadingBar.create(res.troop.healthBar, 100);
        this._healthBar.addChild(healthProgress);
        healthProgress.setPosition(cc.p(this._healthBar.width/2, this._healthBar.height/2));
        healthProgress.setName("heathProgress");
        this._healthBar.setVisible(false);

        for (var i = 0; i < this._direction.length; i++){
            self.initAction(state.idle, this._direction[i], path);
            self.initAction(state.run, this._direction[i], path);
            self.initAction(state.attack, this._direction[i], path);
        }
        this.scheduleUpdate();
        this.doAction(this._troop, this._status, troopDirection.southEast);
    },
    initAction:function(action, direction, path){
        var tempDirection;
        var animation = new cc.Animation();
        var spriteSheetLength;

        switch (action){
            case state.idle:
                spriteSheetLength = spriteLength.idle[this._name];
                break;
            case state.run:
                spriteSheetLength = spriteLength.run[this._name];
                break;
            case state.attack:
                spriteSheetLength = spriteLength.attack[this._name];
                break;
        }

        switch (direction){
            case (troopDirection.northEast):
                tempDirection = troopDirection.northWest;
                break;
            case (troopDirection.east):
                tempDirection = troopDirection.west;
                break;
            case (troopDirection.southEast):
                tempDirection = troopDirection.southWest;
                break;
            default:
                tempDirection = direction;
        }
        for (var i = tempDirection * spriteSheetLength; i < spriteSheetLength + tempDirection * spriteSheetLength; i++){
            var frameName = path + "/" + action + "/image00" + ((i < 10) ? ("0" + i) : i) + ".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(speed);
        animation.setRestoreOriginalFrame(true);
    
        var troopAnimation = cc.animate(animation);

        if (action == state.idle)
        {
            this._idle[direction] = cc.repeatForever(troopAnimation);
            // var idleTag = 100 + direction;
            // this._idle[direction].setTag(idleTag);
            this._idle[direction].retain();
        }
        if (action == state.run)
        {
            this._run[direction] = cc.repeatForever(troopAnimation);
            // this._run[direction].setTag(direction);
            this._run[direction].retain();
        }
        if (action == state.attack){
            this._attack[direction] = cc.repeatForever(troopAnimation);
            // this._attack[direction].setTag(direction);
            this._attack[direction].retain();
        }
    },
    getHit: function(damage){
        this._healthBar.setVisible(true);
        if (this._hitPoints - damage < 0) this._hitPoints = 0;
        else {
            this._hitPoints -= damage;
        }
        cc.log((this._hitPoints / gv.dataWrapper.getTroopConfig(this._name, 1).hitpoints));
        this._healthBar.getChildByName("heathProgress").setPercent((this._hitPoints / gv.dataWrapper.getTroopConfig(this._name, 1).hitpoints) * 100);
    },
    isDead: function(){
        return this._hitPoints == 0;
    },
    followBuildingById: function(id){
        this._buildingId = id;
        this._mapGrid = gv.objectManager.getMapGrid();
        this.moveToBuilding(this._mapGrid, 0, 0);
    },
    doAction:function(sprite, action, direction){
        switch (action){
            case state.idle:
                sprite.runAction(this._idle[direction]);
                break;
            case state.run:
                sprite.runAction(this._run[direction]);
                break;
        }
    },
    getCoordinate: function(){
        return cc.p(this._x, this._y);
    },
    setAttackMapGrid: function(mapGrid){
        this._attackMapGrid = mapGrid;
    },
    setAttackStatus: function(status){
        this._attackStatus = status;
    },
    extractCompare: function(d1, d2){
        return Math.abs(d1 - d2) < epsilon;
    },
    getDirection:function(x1, y1, x2, y2){
        if (this.extractCompare(x1, x2)){
            if (y1 > y2)
                return troopDirection.north;
            else if (y1 < y2) return troopDirection.south;
        }
        if (x1 < x2){
            if (y1 > y2)
                return troopDirection.northWest;
            if (this.extractCompare(y1, y2))
                return troopDirection.west;
            if (y1 < y2)
                return troopDirection.southWest;    
        }
        if (x1 > x2){
            if (y1 > y2)
                return troopDirection.northEast;
            if (this.extractCompare(y1, y2))
                return troopDirection.east;
            if (y1 < y2)
                return troopDirection.southEast;
        }
    },
    addToMap:function(){
        var spriteList = [this];
        gv.mapLayer.addSprite(spriteList);
    },
    moveAroundBuilding: function(){

    },
    moveToBuilding: function(mapGrid, targetGridX, targetGridY){
        this._path = [];
        var troopPosX = this._gridPosX;
        var troopPosY = this._gridPosY;
        var buildingIsoPos = gv.objectManager.getObjectIsoPositionById(this._buildingId);
        // cc.log("building pos " + buildingIsoPos.x + " " + buildingIsoPos.y);
        var buildingTilePos = gv.isometricUtils.isoToTilePos(buildingIsoPos);
        if (this._attackStatus){
            var x3Pos = gv.isometricUtils.isoToX3TilePos(cc.p(this._x, this._y));
            troopPosX = x3Pos.x;
            troopPosY = x3Pos.y;
            this.targetGridX = targetGridX;
            this.targetGridY = targetGridY;
            buildingTilePos = cc.p(targetGridX, targetGridY);
        }
        // cc.log(buildingTilePos.x + " " + buildingTilePos.y);
        var pathToBuildingTile = gv.troopUtils.findPath(mapGrid, mapGrid.length, mapGrid.length, troopPosX, troopPosY, buildingTilePos.x, buildingTilePos.y, this._id);
        
        //  cc.log("path length: " + pathToBuildingTile.length);
        for (var i = 0; i < pathToBuildingTile.length; i++){
            // cc.log("path: " + pathToBuildingTile[i].x + " " + pathToBuildingTile[i].y);
            var step = cc.p(pathToBuildingTile[i].x, pathToBuildingTile[i].y);
            var stepPosIso;
            if (this._attackStatus) stepPosIso = gv.isometricUtils.x3TilePosToIso(step);
            else stepPosIso = gv.isometricUtils.tilePosToIso(step);
             var dn = new cc.DrawNode();
             this.addChild(dn);
             dn.drawDot(cc.p(stepPosIso.x,stepPosIso.y), 2,  cc.color(0, 0, 0));
             //cc.log("path: " + stepPosIso.x + " " + stepPosIso.y);
            this._path.push({
                x: stepPosIso.x,
                y: stepPosIso.y
            });
        }
    },
    attackBuildingByGrid: function(id, gridX, gridY){
        this._buildingId = id;
        this.moveToBuilding(this._attackMapGrid, gridX, gridY);
    },
    attack: function(t){
        if (this._path.length == 0){
            var damage = Math.ceil(this._damagePerAttack * this._attackSpeed * t);
            gv.objectManager.attackBuilding(this._buildingId, damage);
            if (!this._isAttacking){
                this._troop.stopAllActions();
                var target = gv.objectManager.getObjectById(this._buildingId);
                //cc.log("target", target.width, target.height);
                var targetPosIso = gv.objectManager.getObjectIsoPositionById(this._buildingId);
                var targetPosTile = gv.isometricUtils.isoToTilePos(targetPosIso);
                var centerTargetPosTile = cc.p(targetPosTile.x + Math.ceil(target.width/2), targetPosTile.y + Math.ceil(target.height/2));
                var centerTargetPosIso = gv.isometricUtils.tilePosToIso(centerTargetPosTile);
                // cc.log(JSON.stringify(centerTargetPosIso));

                // var dn = new cc.DrawNode();
                // this.addChild(dn);
                // this.setLocalZOrder(9999999);
                // dn.drawDot(cc.p(centerTargetPosIso.x, centerTargetPosIso.y), 2,  cc.color(0, 0, 255));

                // dn.drawDot(cc.p(this._troop.x, this._troop.y), 2,  cc.color(255, 0, 0));


                var attackDirection = this.getDirection(centerTargetPosIso.x, centerTargetPosIso.y, this._x, this._y);
                // cc.log("attack dir ", attackDirection);

                if (attackDirection > troopDirection.north) this._troop.setFlippedX(true);
                else this._troop.setFlippedX(false);

                this._troop.runAction(this._attack[attackDirection]);
                this._isAttacking = true;
            }
        }
    },

    checkOvercomeGrid: function(direction, dx, dy, currentGrid){
        var directionVector = [{x: 0, y: -1}, {x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}];
        let stepInTheFuture = {
            x: 0,
            y: 0
        };

        stepInTheFuture.x = this._x + dx * directionVector[direction].x;
        stepInTheFuture.y = this._y + dy * directionVector[direction].y;

        var dn = new cc.DrawNode();
        this.addChild(dn);
        dn.drawDot(cc.p(stepInTheFuture.x, stepInTheFuture.y), 2,  cc.color(0, 255, 0));

        dn.drawDot(cc.p(currentGrid.x, currentGrid.y), 2,  cc.color(255, 0, 0));


        var totalLength = Math.floor(Math.sqrt((stepInTheFuture.x - this._x) * (stepInTheFuture.x - this._x) + (stepInTheFuture.y - this._y) * (stepInTheFuture.y - this._y)));
        var lengthToCurrentGrid = Math.floor(Math.sqrt((currentGrid.x - this._x) * (currentGrid.x - this._x) + (currentGrid.y - this._y) * (currentGrid.y - this._y)));
        if (totalLength > lengthToCurrentGrid){
            cc.log(totalLength + " " + lengthToCurrentGrid);
            this._x = currentGrid.x;
            this._y = currentGrid.y;
            this._troop.setPosition(cc.p(this._x, this._y));
            return true;
        }
        else {
            cc.log(totalLength + " " + lengthToCurrentGrid);
            this._x += dx * directionVector[direction].x;
            this._y += dy * directionVector[direction].y;
            this._troop.setPosition(cc.p(this._x, this._y));
            return false;
        }
    },

    move: function(t){
        var directionVector = {
            x: 0,
            y: 0
        };
        this._remainX = 0;
        this._remainY = 0;
        //cc.log("remain", this._remainX, this._remainY);
        if(this._path.length > 0) {
            if (!this._isMoving){
                this._troop.stopAllActions();
                this._isMoving = true;
            }
             //this._remainX = 0;
             //this._remainY = 0;
            var currentGrid = this._path[0];
            this.prevGridX = this.extractCompare(this.prevGridX, 0)? this._x : this.prevGridX;
            this.prevGridY = this.extractCompare(this.prevGridY, 0)? this._y : this.prevGridY;
            // cc.log("prev: " + this.prevGridX + " " + this.prevGridY);
            // cc.log("currentGrid: " + currentGrid.x + " " + currentGrid.y);

            var direction = this.getDirection(currentGrid.x, currentGrid.y, this.prevGridX, this.prevGridY);
            // this.direction = direction;
            //cc.log(direction);
            

            //get total length
            var totalLength = Math.floor(Math.sqrt(this._remainX * this._remainX + this._remainY * this._remainY))  + this._velocity * t;
            var dx = totalLength*cosAlpha;
            var dy = totalLength*sinAlpha;

            var stepInTheFutureX;
            var stepInTheFutureY;

            // var flag = this.checkOvercomeGrid(direction, dx, dy, currentGrid);
            var flag = false;

            switch (direction){
               case troopDirection.south:
                   directionVector.x = 0;
                   directionVector.y = -1;
                   //this._troop.x += dx * directionVector.x
                   stepInTheFutureY = this._y + dy * directionVector.y;
                   if (stepInTheFutureY < currentGrid.y){
                       this._remainY = currentGrid.y - stepInTheFutureY;
                       this._y = currentGrid.y;
                       flag = true;
                   }
                   break;
               case troopDirection.southWest:
                   directionVector.x = -1;
                   directionVector.y = -1;
                   stepInTheFutureX = this._x + dx * directionVector.x;
                   stepInTheFutureY = this._y + dy * directionVector.y;
                   if (stepInTheFutureX < currentGrid.x && stepInTheFutureY < currentGrid.y){
                       this._x = currentGrid.x;
                       this._y = currentGrid.y;
                       this._remainX = currentGrid.x - stepInTheFutureX;
                       this._remainY = currentGrid.y - stepInTheFutureY;
                       flag = true;
                   }
                   break;
               case troopDirection.west:
                   directionVector.x = -1;
                   directionVector.y = 0;
                   stepInTheFutureX = this._x + dx * directionVector.x;
                   if (stepInTheFutureX < currentGrid.x){
                       this._x = currentGrid.x;
                       this._remainX = currentGrid.x - stepInTheFutureX;
                       flag = true;
                   }
                   break;
               case troopDirection.northWest:
                   directionVector.x = -1;
                   directionVector.y = 1;
                   stepInTheFutureX = this._x + dx * directionVector.x;
                   stepInTheFutureY = this._y + dy * directionVector.y;
                   if (stepInTheFutureX < currentGrid.x && stepInTheFutureY > currentGrid.y){
                       this._x = currentGrid.x;
                       this._y = currentGrid.y;
                       this._remainX = currentGrid.x - stepInTheFutureX;
                       this._remainY = stepInTheFutureY - currentGrid.y;
                       flag = true;
                   }
                   break;
               case troopDirection.north:
                   directionVector.x = 0;
                   directionVector.y = 1;
                   stepInTheFutureY = this._y + dy * directionVector.y;
                   if (stepInTheFutureY > currentGrid.y){
                       this._y = currentGrid.y;
                       this._remainY = stepInTheFutureY - currentGrid.y;
                       flag = true;
                   }
                   break;
               case troopDirection.northEast:
                   directionVector.x = 1;
                   directionVector.y = 1;
                   stepInTheFutureX = this._x + dx * directionVector.x;
                   stepInTheFutureY = this._y + dy * directionVector.y;
                   if (stepInTheFutureX > currentGrid.x && stepInTheFutureY > currentGrid.y){
                       this._x = currentGrid.x;
                       this._y = currentGrid.y;
                       this._remainX = stepInTheFutureX - currentGrid.x;
                       this._remainY = stepInTheFutureY - currentGrid.y;
                       flag = true;
                   }
                   break;
               case troopDirection.east:
                   directionVector.x = 1;
                   directionVector.y = 0;
                   stepInTheFutureX = this._x + dx * directionVector.x;
                   if (stepInTheFutureX > currentGrid.x){
                       this._x = currentGrid.x;
                       this._remainX = stepInTheFutureX - currentGrid.x;
                       flag = true;
                   }
                   break;
               case troopDirection.southEast:
                   directionVector.x = 1;
                   directionVector.y = -1;
                   stepInTheFutureX = this._x + dx * directionVector.x;
                   stepInTheFutureY = this._y + dy * directionVector.y;
                   if (stepInTheFutureX > currentGrid.x && stepInTheFutureY < currentGrid.y){
                       this._x = currentGrid.x;
                       this._y = currentGrid.y;
                       this._remainX = stepInTheFutureX - currentGrid.x;
                       this._remainY = currentGrid.y - stepInTheFutureY;
                       flag = true;
                   }
                   break;
               default :
                   break;
            }
            if (!flag) {
                //cc.log("false");
                this._x += dx * directionVector.x;
                this._y += dy * directionVector.y;
            } else {
                cc.log("true");
                this.prevGridX = currentGrid.x;
                this.prevGridY = currentGrid.y;
                this._path.shift();
                //flag = false;
            }
            //var gridPos = gv.isometricUtils.isoToX3TilePos(cc.p(this._troop.x, this._troop.y));
            this._troop.setPosition(cc.p(this._x, this._y));
            //cc.log("x, y, gridx, gridy " + this._x + " " + this._y + " " + gridPos.x + " " + gridPos.y);
            if(direction != this.direction && direction != undefined){
                this._troop.stopAllActions();
                this.direction = direction;
                if (direction > troopDirection.north) this._troop.setFlippedX(true);
                else this._troop.setFlippedX(false);
                this._troop.runAction(this._run[direction]);
            }
        } else{
            this.prevGridX = 0;
            this.prevGridY = 0;
            if (!this._attackStatus){
                if (this._isMoving ){
                    this._troop.stopAllActions();
                    this._isMoving = false;
                    this.doAction(this._troop, this._status, troopDirection.southEast);
                }
            }
        }
    },
    update: function(dt){
        //set z order 
        var gridPos = gv.isometricUtils.isoToTilePos(cc.p(this._x, this._y));
        this.setLocalZOrder(gv.objectUtils.getObjectZOrder(gridPos));
        // cc.log("troop", gv.objectUtils.getObjectZOrder(gridPos));

        if (gv.objectManager.getObjectById(this._buildingId) == undefined){
            this._isAttacking = false;
            this._x = this._troop.x;
            this._y = this._troop.y;
        }
        // cc.log("building id " + this._buildingId);
        // cc.log(JSON.stringify(gv.objectManager.getObjectById(this._buildingId)));
        //draw position
        // var dn = new cc.DrawNode();
        // this.addChild(dn);
        // dn.drawDot(cc.p(this._troop.x, this._troop.y), 2,  cc.color(0, 0, 255));

        if (this.isDead()){
            this._healthBar.setVisible(false);
            this.unscheduleUpdate();
            this._troop.stopAllActions();
            var path = res.troop.animation + this._name + "_" + this._level + "/" + this._name + "_" + this._level + "/dead/image0000.png";
            this._troop.setTexture(path);
        }


        if(!this._attackStatus){
            this.move(dt);
        }
        
    }
});