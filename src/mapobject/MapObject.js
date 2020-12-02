/**
 * Created by Fersher_LOCAL on 6/22/2020.
 */

var MapObject = cc.Class.extend({
    width: null,
    height: null,
    x: null,
    y: null,
    actionTime: null,
    startActionTimestamp: null,
    id: null,
    spriteList: null,
    grassSprite: null,
    upgradingSprite: null,
    animatedSprite: null,
    progressTimer: null,
    isInBuildingAction: null,

    ctor:function(obj) {
        this.setId(obj.id);
        this.configAttributes();
        this.initSprite();
        this.setPosition(cc.p(obj.posX, obj.posY));
        this.startActionTimestamp = obj.startActionTimestamp;
    },

    configAttributes: function() {
        let data = this.getConfig();
        this.width = data["width"];
        this.height = data["height"];
    },

    initSprite: function() {
        this.spriteList = gv.objectUtils.getIdleSprite(
            this.getResPath(),
            this.width,
            this.height,
            this.getIdleList()
        );
        this.grassSprite = gv.objectUtils.getGrassSprite(this.width, this.isBuilding());
        if (this.level != null) {
        }
        this.progressTimer = gv.objectUtils.createProgressTimer();
        let progressBar = gv.objectUtils.createProgressBar();
        this.progressBar = progressBar.bar;
        this.progressBackground = progressBar.barBG;
    },

    setPosition: function(p) {
        this.x = p.x;
        this.y = p.y;
        let sprite = this.getIdleSprite();
        let grassSprite = this.grassSprite;
        let animatedSprite = this.animatedSprite;
        let tilePos = cc.p(this.x, this.y);
        let isoPos = gv.isometricUtils.tilePosToIso(tilePos);
        let progressBar = this.progressBar;
        let progressBackground = this.progressBackground;
        let progressTimer = this.progressTimer;


        gv.nodeUtils.monitorNode(sprite, gv.objectUtils.getObjectZOrder(cc.p(this.x + Math.ceil(this.width / 2) - 1, this.y + Math.ceil(this.height / 2) - 1)), cc.p(isoPos.x, isoPos.y));

        gv.nodeUtils.monitorNode(grassSprite, null, cc.p(isoPos.x, isoPos.y));
        if (animatedSprite != null) {
            gv.nodeUtils.monitorNode(
                animatedSprite,
                gv.objectUtils.getObjectZOrder(cc.p(this.x + Math.ceil(this.width / 2) - 1, this.y + Math.ceil(this.height / 2) - 1)),
                cc.p(isoPos.x, isoPos.y)
            );
        }
        if (this.isInBuildingAction) {
            gv.nodeUtils.monitorNode(
                progressTimer,
                null,
                cc.p(grassSprite.x, grassSprite.y + grassSprite.height * grassSprite.getScale())
            );
            gv.nodeUtils.monitorNode(
                progressBackground,
                null,
                cc.p(grassSprite.x, progressTimer.y)
            );
            gv.nodeUtils.monitorNode(
                progressBar,
                null,
                cc.p(progressBackground.x - progressBackground.width / 2, progressTimer.y)
            )
        }
    },

    getAnimatedSprite: function() {
        return this.animatedSprite;
    },

    getGrassSprite: function() {
        return this.grassSprite;
    },

    getIdleSprite: function() {
        return this.spriteList["1"];
    },

    setId: function(id) {
        this.id = id;
    },

    getId: function() {
        return this.id;
    },

    getBuildingActionTime: function() {
        return 0;
    },

    getBuildingActionResource: function() {
        return {};
    },

    getConfig: function() {
    },

    getResPath: function() {
        return this.getAcronym();
    },

    getAcronym: function() {},

    getTileRect: function() {
        //cc.log(this.x.toString(), this.width.toString());
        return cc.rect(this.x, this.y, this.width, this.height);
    },

    //upgrade if building, remove if obstacle
    startBuildingAction: function(startActionTimestamp) {
        this.startActionTimestamp = startActionTimestamp;

        let actionTime = this.getBuildingActionTime();
        let remainingTime = gv.timeUtils.getRemainingTime(startActionTimestamp + actionTime);
        if (startActionTimestamp == 0) {
            return;
        }
        if (remainingTime < 0) {
            this.onFinishBuildingAction();
            return;
        }
        this.isInBuildingAction = true;
        this.progressTimer.setLocalZOrder(res.MapUI.zPosition.arrow);
        this.progressBackground.setLocalZOrder(res.MapUI.zPosition.progressBackground);
        this.progressBar.setLocalZOrder(res.MapUI.zPosition.progressBar);
        this.setPosition(cc.p(this.x, this.y));

        let parent = this.progressTimer.getParent();
        let thisPointer = this;
        let countDownAction = function () {
            let remainingTime = gv.timeUtils.getRemainingTime(thisPointer.startActionTimestamp + actionTime);
            remainingTime = Math.min(remainingTime, actionTime);
            // cc.log("RemainingTime:", remainingTime.toString());
            if (!thisPointer.isInBuildingAction) {
                return;
            }
            if (remainingTime <= 0) {
                thisPointer.onFinishBuildingAction();
                return;
            }
            thisPointer.progressTimer.setString(gv.timeUtils.getFormattedTime(remainingTime));
            thisPointer.progressBar.setScale(1 - remainingTime / actionTime, 1);
            parent.scheduleOnce(function() {
                countDownAction();
            }, 1);
        };
        parent.scheduleOnce(function() {
            countDownAction();
        }, 0)
    },

    finishBuildingAction: function() {
        if (!this.isInBuildingAction)
            return;
        this.progressTimer.setLocalZOrder(res.MapUI.zPosition.invisible);
        this.isInBuildingAction = false;
        this.startActionTimestamp = 0;
    },

    getSpriteList: function() {
        let result = [];
        for(let id in this.spriteList) {
            if (this.spriteList.hasOwnProperty(id))
                result.push(this.spriteList[id]);
        }
        result.push(this.grassSprite);
        result.push(this.progressTimer);
        result.push(this.progressBar);
        result.push(this.progressBackground);
        if (this.animatedSprite != null) {
            result.push(this.animatedSprite);
        }
        return result;
    },

    onFinishBuildingAction: function() {

    },

    getNameStringPosition: function() {
        if (!this.isInBuildingAction)
            return cc.p(this.grassSprite.x, this.grassSprite.y + this.grassSprite.height * this.grassSprite.getScale());
        else
            return cc.p(
                this.grassSprite.x,
                this.grassSprite.y + this.grassSprite.height * this.grassSprite.getScale() + res.MapUI.fixedVariables.headerShiftWhileUpgrading
            );
    },

    runFocusAnimation: function() {
        for(let i in this.spriteList) {
            if (this.spriteList.hasOwnProperty(i)) {
                this.spriteList[i].stopAllActions();
                let scaleUp = cc.ScaleTo.create(0.1, 1.1);
                let scaleDown = cc.ScaleTo.create(0.1, 1);
                let seq = cc.Sequence.create(scaleUp, scaleDown);
                let darkTint = cc.TintBy.create(0.5, -63, -63, -63);
                let brightTint = cc.TintBy.create(0.5, 63, 63, 63);
                let tintSeq = cc.repeatForever(cc.Sequence.create(darkTint, brightTint));
                this.spriteList[i].runAction(seq);
                this.spriteList[i].runAction(tintSeq);
            }
        }
    },

    disableFocusAnimation: function() {
        for(let i in this.spriteList) {
            if (this.spriteList.hasOwnProperty(i)) {
                this.spriteList[i].stopAllActions();
                this.spriteList[i].setColor(cc.color(255, 255, 255, 1));
            }
        }
        //let tint = cc.TintBy.create(0.1, 255, 255, 255);
        //this.getIdleSprite().runAction(tint);
    },

    getAction: function() {
        let result = [res.MapUI.action.type.info.name];
        if (this.isInBuildingAction) {
            result.push(res.MapUI.action.type.quick_finish.name);
        }
        return result;
    },

    getLevelString: function() {
        return "";
    },

    getNameString: function() {
        return this.getAcronym();
    },

    getLevel: function() {
        return this.level;
    },

    isBuilding: function() {
        return false;
    },

    getIdleList: function() {
        return {"1": "image0000.png"}
    },

    getRemainingBuildingActionTime: function() {
        let actionTime = this.getBuildingActionTime();
        return gv.timeUtils.getRemainingTime(actionTime + this.startActionTimestamp);
    },

    getMaxResLevel: function() {
        return 100;
    },

    getAnimatedDurationPerFrame: function() {
        return 0.1;
    },

    getCenterIsoPos: function() {
        let grassSprite = this.getGrassSprite();
        return cc.p(grassSprite.x, grassSprite.y + grassSprite.height / 2 * grassSprite.getScaleX());
    },

    isWall: function() {
        return false;
    }
});