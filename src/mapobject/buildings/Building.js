/**
 * Created by Fersher_LOCAL on 6/22/2020.
 */


var Building = MapObject.extend({
    level: null,
    maxLevel: null,
    hitpoints: null,
    healthBar: null,
    healthBarBackground: null,
    destroyed: null,
    junkSprite: null,
    attackedAnimation: null,
    currentDamageCount: null,
    inAttackedAnimation: null,
    hasBeenAttacked: null,


    ctor: function(obj) {
        this.level = obj["level"];
        this.updateBuildingAttribute(obj);
        this.destroyed = false;
        this._super(obj);
        this.hitpoints = this.getMaximumHitpoints();
        this.currentDamageCount = 0;
        this.inAttackedAnimation = false;
    },

    upgrade: function() {
        this.level += 1;
    },

    //update building attribute by new config
    updateBuildingAttribute: function(obj) {

    },

    getAttacked: function() {
        if (this.isDestroyed())
            return;
        let dmg = this.currentDamageCount;
        if (dmg == 0) {
            return;
        }

        this.hasBeenAttacked = true;
        if (!this.inAttackedAnimation) {
            this.attackedAnimation.setLocalZOrder(gv.objectUtils.getObjectZOrder(cc.p(this.x + Math.ceil(this.width / 2) - 1, this.y + Math.ceil(this.height / 2) - 1)));
            this.inAttackedAnimation = true;
            let thisPointer = this;
            let order = 0;
            this.animationCallback = function () {
                let action = gv.mapLayer.getHitAction(order);
                if (!thisPointer.hasBeenAttacked) {
                    thisPointer.attackedAnimation.setLocalZOrder(res.MapUI.zPosition.invisible);
                    thisPointer.inAttackedAnimation = false;
                } else {
                    // there is only 0 - 2 attack animation order
                    order = (order + 1) % 3;
                    thisPointer.attackedAnimation.runAction(cc.sequence(action, cc.callFunc(thisPointer.animationCallback, thisPointer)));
                    thisPointer.hasBeenAttacked = false;
                }
            };
            this.animationCallback();

        }


        if (this.hitpoints == this.getMaximumHitpoints()) {
            this.healthBar.setLocalZOrder(res.MapUI.zPosition.progressBar);
            this.healthBarBackground.setLocalZOrder(res.MapUI.zPosition.progressBackground);
        }
        this.hitpoints -= dmg;
        this.hitpoints = Math.max(0, this.hitpoints);
        this.healthBar.setScaleX(this.hitpoints / this.getMaximumHitpoints());
        if (this.hitpoints <= 0) {
            this.destroy();
        }
    },

    getHitPoints: function() {
        return this.hitpoints;
    },

    destroy: function() {
        this.destroyed = true;
    },

    isDestroyed: function() {
        return this.destroyed;
    },

    configAttributes: function() {
        this._super();
        this.maxLevel = gv.dataWrapper.getBuildingMaxLevel(this.getAcronym());
    },

    initSprite: function() {
        this._super();
        this.animatedSprite = gv.objectUtils.getAnimatedSprite(
            this.getAcronym() + "_" + Math.min(Math.max(this.level, 1), this.getMaxResLevel()).toString(),
            this.getAnimatedPathList(),
            this.width,
            this.height,
            this.getAnimatedDurationPerFrame()
        );
        if (this.getAnimatedSprite() != null)
            this.getAnimatedSprite().setScale(this.getAnimatedSpriteScale());
        if (this.canBeUpgrade()) {
            this.upgradingSprite = gv.objectUtils.getUpgradingSprite();
        }
        let health = gv.objectUtils.createBuildingHealthBar();
        this.healthBar = health.bar;
        this.healthBarBackground = health.barBG;
        this.healthBar.setLocalZOrder(res.MapUI.zPosition.invisible);
        this.healthBarBackground.setLocalZOrder(res.MapUI.zPosition.invisible);

        this.attackedAnimation = gv.objectUtils.createAttackHitSprite(this.width, this.height);
        this.attackedAnimation.setLocalZOrder(res.MapUI.zPosition.invisible);
    },

    resetDamage: function() {
        this.currentDamageCount = 0;
    },

    updateDamage: function(delta) {
        this.currentDamageCount += delta;
    },

    setPosition: function(p) {
        this._super(p);
        var tilePos = cc.p(this.x, this.y);
        var isoPos = gv.isometricUtils.tilePosToIso(tilePos);
        if (this.canBeUpgrade() && this.isInBuildingAction) {
            gv.nodeUtils.monitorNode(
                this.upgradingSprite,
                gv.objectUtils.getObjectZOrder(tilePos),
                cc.p(isoPos.x, isoPos.y)
            );
        }
        let grassSprite = this.getGrassSprite();
        gv.nodeUtils.monitorNode(
            this.healthBarBackground,
            null,
            cc.p(grassSprite.x, grassSprite.y + grassSprite.height * grassSprite.getScaleY())
        );
        gv.nodeUtils.monitorNode(
            this.healthBar,
            null,
            cc.p(this.healthBarBackground.x - this.healthBarBackground.width / 2, this.healthBarBackground.y)
        );
        gv.nodeUtils.monitorNode(
            this.attackedAnimation,
            null,
            cc.p(isoPos.x, isoPos.y)
        )
    },

    getAnimatedPathList: function() {
        return [];
    },

    getInfo: function() {

    },

    getTownHallLevelRequired: function() {
        return this.getConfig()["townHallLevelRequired"];
    },

    getBuildingActionTime: function() {
        return this.getUpgradeTime();
    },

    getAnimatedSpriteScale: function() {
        return 1;
    },

    getBuildingActionResource: function() {
        return this.getUpgradeResource();
    },

    getUpgradeTime: function() {
        var newConfig = gv.dataWrapper.getBuildingConfig(this.getAcronym(), this.level + 1);
        return newConfig["buildTime"];
    },

    getUpgradeResource: function() {
        let newConfig = gv.dataWrapper.getBuildingConfig(this.getAcronym(), this.level + 1);
        let resourceType = res.ResourceType;
        let result = {};
        for(let key in resourceType) {
            if (resourceType.hasOwnProperty(key) && newConfig.hasOwnProperty(resourceType[key]) && newConfig[resourceType[key]] != 0) {
                result[resourceType[key]] = newConfig[resourceType[key]];
            }
        }
        return result;
    },

    getConfig: function() {
        return gv.dataWrapper.getBuildingConfig(this.getAcronym(), Math.max(this.level, 1));
    },

    onFinishBuildingAction: function() {
        gv.requestManager.onFinishUpgradeBuilding(this.getId());
    },

    finishBuildingAction: function() {
        this._super();
        if (this.canBeUpgrade()) {
            this.upgradingSprite.setLocalZOrder(res.MapUI.zPosition.invisible);
            gv.mapUtils.createBuildingUpgradeEffect(gv.mapLayer, gv.isometricUtils.tilePosToIso(cc.p(this.x, this.y)));
        }
        this.level += 1;
        gv.objectManager.removeObject(this);
        this.initSprite();
        gv.objectManager.addObject(this, false);
        this.setPosition(cc.p(this.x, this.y));
    },

    getResPath: function() {
        var level = this.level;
        return this._super() + "/" + this.getAcronym() + "_" + Math.min(Math.max(this.level, 1), this.getMaxResLevel()).toString();
    },

    getAction: function() {
        var result = this._super();
        if (!this.isInBuildingAction && this.canBeUpgrade() && this.level < this.maxLevel)
            result.push(res.MapUI.action.type.upgrade.name);
        if (this.isInBuildingAction) {
            result.push(res.MapUI.action.type.cancel.name);
        }
        return result;
    },

    cancelBuildingAction: function() {
        if (!this.isInBuildingAction)
            return;
        this.progressBar.setLocalZOrder(res.MapUI.zPosition.invisible);
        this.progressBackground.setLocalZOrder(res.MapUI.zPosition.invisible);
        this.upgradingSprite.setLocalZOrder(res.MapUI.zPosition.invisible);
        this.progressTimer.setLocalZOrder(res.MapUI.zPosition.invisible);
        this.isInBuildingAction = false;
        this.startActionTimestamp = 0;
    },

    getSpriteList: function() {
        var result = this._super();
        if (this.canBeUpgrade()) {
            result.push(this.upgradingSprite);
        }
        result.push(this.healthBar);
        result.push(this.healthBarBackground);
        result.push(this.attackedAnimation);
        return result;
    },

    getLevelString: function() {
        return "Cấp " + Math.max(1, this.level.toString());
    },

    isBuilding: function() {
        return true;
    },

    canBeUpgrade: function () {
        return true;
    },

    getLevel: function() {
        return this.level;
    },

    getMaximumHitpoints: function() {
        let config = this.getConfig();
        return config["hitpoints"];
    },

    getAttributeList: function() {
        return {
            hitpoints: this.getMaximumHitpoints()
        };
    },

    getDescription: function () {

    },

    getGoldCapacity: function() {
        let config = this.getConfig();
        let res = config["capacityGold"];
        if (res == null)
            return 0;
        else
            return res;
    },

    getElixirCapacity: function() {
        let config = this.getConfig();
        let res = config["capacityElixir"];
        if (res == null)
            return 0;
        else
            return res;
    },

    getDarkElixirCapacity: function() {
        let config = this.getConfig();
        let res = config["capacityDarkElixir"];
        if (res == null)
            return 0;
        else
            return res;
    },

    // sprite path for destroyed building
    getJunkBuildingPath: function() {
        let result = [res.BattleUI.effect.junkConstructs0, res.BattleUI.effect.junkConstructs1];
        return result[Math.floor(Math.random() * 2)];
    }

});