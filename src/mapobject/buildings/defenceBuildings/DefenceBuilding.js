/**
 * Created by Fersher_LOCAL on 7/13/2020.
 */
var DefenceBuilding = Building.extend({
    targetId: null,
    cooldownTime: null,
    attackAnimations: null,
    closestTroop: null,

    ctor: function(obj) {
        this.attackAnimations = {};
        this.targetId = -1;
        this.cooldownTime = 0;
        this._super(obj);
    },

    initSprite: function() {
        this._super();
        let dirList = res.Direction;

        for(let dir in dirList) {


            if (dirList.hasOwnProperty(dir)) {
                let dirPath = dirList[dir];
                if (dirList[dir] < 0)
                    dirPath = - dirList[dir];
                this.attackAnimations[dirList[dir]] = gv.objectUtils.createAnimatedObjectEffect(
                    this.getResPath(),
                    dirPath * this.getAttackLen(),
                    (dirPath + 1) * this.getAttackLen() - 1
                );
            }
        }
    },

    setPosition: function(p) {
        this._super(p);
    },

    getSpriteList: function() {
        let result = this._super();
        return result;
    },

    getAnimatedDurationPerFrame: function() {
        return 5 + Math.floor(Math.random() * 20);
    },

    getAttackSpeed: function() {
        return this.getConfig()["attackSpeed"];
    },

    runAttackAnimation: function(p) {
        if (this.inCooldown()) {
            return;
        }
        this.cooldownTime = this.getAttackSpeed();
        let direction = gv.objectManager.getAttackDirection(this.getId(), p);
        let thisPointer = this;
        let callback = function() {
            //thisPointer.getAnimatedSprite().getActionByTag(res.MapUI.actionTag.idleAnimated).resume();

        };
        //this.getAnimatedSprite().getActionByTag(res.MapUI.actionTag.idleAnimated).pause();
        //this.getAnimatedSprite().stopAllActions();
        if (direction < 0)
            this.getAnimatedSprite().setScaleX(-1);
        else
            this.getAnimatedSprite().setScaleX(1);
        this.getAnimatedSprite().runAction(this.attackAnimations[direction]());
        cc.log("direction:", direction);
        // cc.log(JSON.stringify(this.attackAnimations));
    },

    runFocusAnimation: function() {
        this.getAnimatedSprite().stopAllActions();
        let scaleUp = cc.ScaleTo.create(0.1 , 1.1 * this.getAnimatedSpriteScale());
        let scaleDown = cc.ScaleTo.create(0.1, 1 * this.getAnimatedSpriteScale());
        let seq = cc.Sequence.create(scaleUp, scaleDown);
        let darkTint = cc.TintBy.create(0.5, -63, -63, -63);
        let brightTint = cc.TintBy.create(0.5, 63, 63, 63);
        let tintSeq = cc.repeatForever(cc.Sequence.create(darkTint, brightTint));
        this.getAnimatedSprite().runAction(seq);
        this.getAnimatedSprite().runAction(tintSeq);
    },

    // length of attack animation
    getAttackLen: function() {
    },

    disableFocusAnimation: function() {
        this.getAnimatedSprite().stopAllActions();
        this.getAnimatedSprite().setColor(cc.color(255, 255, 255, 1));
        //let tint = cc.TintBy.create(0.1, 255, 255, 255);
        //this.getIdleSprite().runAction(tint);
    },

    getConfig: function() {
        return gv.dataWrapper.getDefenceBuildingConfig(this.getAcronym(), Math.max(1, this.level));
    },

    getDamagePerShot: function() {
        return this.getConfig()["damagePerShot"];
    },

    getAttributeList: function() {
        let result = this._super();
        result.damage = this.getDamagePerShot();
        return result;
    },

    // troop enter range
    updateClosestTroop: function(id, troopX3P) {
        let x3Rect = gv.objectManager.mapGrid.objectRectToX3Rect(this.getTileRect());
        let buildingX3TilePos = cc.p(x3Rect.x + Math.ceil(x3Rect.width / 2) - 1, x3Rect.y + Math.ceil(x3Rect.height / 2) - 1);
        let distance = gv.mapUtils.getEuclideanDistance(troopX3P, buildingX3TilePos);
        if (this.closestTroop == null || this.closestTroop.distance < distance) {
            this.closestTroop = {
                distance: distance,
                id: id
            }
        }
    },

    getTarget: function() {
        return this.targetId;
    },

    isAttacking: function() {
        return (this.getTarget() != -1);
    },

    getMaxAttackRange: function() {
        return this.getConfig()["maxRange"];
    },

    getMinAttackRange: function() {
        return this.getConfig()["minRange"];
    },


    updateCooldown: function(deltaC) {
        this.cooldownTime -= deltaC;
        //cc.log(this.cooldownTime);
    },

    inCooldown: function() {
        return this.cooldownTime > 0;
    },

    updateTarget: function() {
        if (this.targetId != -1) {
            let troop = gv.objectManager.getTroopById(this.targetId);
            if (troop.isDead()) {
                this.targetId = -1;
                return;
            }
            let troopIsoPos = troop.getCoordinate();
            let troopX3TilePos = gv.isometricUtils.isoToX3TilePos(troopIsoPos);
            let x3Rect = gv.objectManager.mapGrid.objectRectToX3Rect(this.getTileRect());
            let buildingX3TilePos = cc.p(x3Rect.x + Math.ceil(x3Rect.width / 2) - 1, x3Rect.y + Math.ceil(x3Rect.height / 2) - 1);
            let x3MaxRange = this.getMaxAttackRange() * 3;
            let x3MinRange = this.getMinAttackRange() * 3;
            let x3Distance = gv.mapUtils.getEuclideanDistance(troopX3TilePos, buildingX3TilePos);
            //cc.log("Dis and range: ", x3Distance.toString(), x3Range.toString());
            if (x3Distance > x3MaxRange || x3Distance < x3MinRange) {
                this.targetId = -1;
            }
        } else {
            if (this.closestTroop == null)
                return;
            this.targetId = this.closestTroop.id;
            this.closestTroop = null;
        }
    },

    getDefenceType: function() {
        return -1;
    }


});
