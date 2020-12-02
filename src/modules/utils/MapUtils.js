/**
 * Created by Fersher_LOCAL on 6/25/2020.
 */

var MapUtils = cc.Class.extend({

    getEuclideanDistance: function (p1, p2) {
        let diffX = p1.x - p2.x;
        let diffY = p1.y - p2.y;
        return Math.sqrt(diffX * diffX + diffY * diffY);
    },

    getTileManhattanDistance: function(p1, p2) {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    },

    getDirection: function(p1, p2) {
        let diffX = p2.x - p1.x;
        let diffY = p2.y - p1.y;
        let len = Math.sqrt(diffX * diffX + diffY * diffY);
        let angle = Math.atan(Math.abs(diffY / diffX)) * (180 / Math.PI);
        angle = (angle + 360) % 360;
        switch (true) {
            case (diffX >= 0 && diffY >= 0):
                break;
            case (diffX <= 0 && diffY >= 0):
                angle = 180 - angle;
                break;
            case (diffX <= 0 && diffY <= 0):
                angle += 180;
                break;
            case (diffX >= 0 && diffY <= 0):
                angle = 360 - angle;
                break;
        }
        switch(true) {
            case (angle >= 23 && angle < 68):
                return res.Direction.NORTHEAST;
            case (angle >= 68 && angle < 113):
                return res.Direction.NORTH;
            case (angle >= 113 && angle < 158):
                return res.Direction.NORTHWEST;
            case (angle >= 158 && angle < 203):
                return res.Direction.WEST;
            case (angle >= 203 && angle < 248):
                return res.Direction.SOUTHWEST;
            case (angle >= 248 && angle < 293):
                return res.Direction.SOUTH;
            case (angle >= 293 && angle < 338):
                return res.Direction.SOUTHEAST;
            default :
                return res.Direction.EAST;
        }
    },

    isInRect: function(p, rect) {
        return ((p.x >= rect.x) && (p.x < rect.x + rect.width) && (p.y >= rect.y) && (p.y < rect.y + rect.height));
    },

    createNameLabel: function() {

        let nameString = new cc.LabelBMFont("", "res/fonts/soji_24.fnt");
        nameString.setLocalZOrder(res.MapUI.zPosition.invisible);
        //this.nameString.textAlign(cc.TEXT_ALIGNMENT_CENTER);
        nameString.setAnchorPoint(cc.p(0.5, 0));
        nameString.setColor(cc.color(240, 255, 0, 1));
        return nameString;
    },

    createLevelLabel: function() {
        let levelString = new cc.LabelBMFont("", "res/fonts/soji_20.fnt");
        levelString.setLocalZOrder(res.MapUI.zPosition.invisible);
        //this.levelString.textAlign(cc.TEXT_ALIGNMENT_CENTER);
        levelString.setAnchorPoint(cc.p(0.5, 1));
        levelString.setColor(cc.color(255, 255, 255, 1));
        return levelString;
    },

    createNameAndLevelLabel: function() {
        let nameAndLevelString = new cc.LabelBMFont("MINH", "res/fonts/soji_24.fnt");
        //this.levelString.textAlign(cc.TEXT_ALIGNMENT_CENTER);
        nameAndLevelString.setAnchorPoint(cc.p(0.5, 0));
        nameAndLevelString.setPosition(cc.p(100, 100));
        nameAndLevelString.setColor(cc.color(255, 255, 255, 1));
        return nameAndLevelString;
    },

    createArrowSprite: function() {
        let path = res.MapUI.background.path;
        let arrowSprite = {};
        for(let i = 1; i <= res.MapUI.maxObjectSize.width; i++) {
            arrowSprite[i] = new cc.Sprite(path + "/" + res.MapUI.background.name.arrow + i.toString() + ".png");
            arrowSprite[i].setAnchorPoint(cc.p(0.5, 0));
            arrowSprite[i].setLocalZOrder(res.MapUI.zPosition.invisible);
        }
        return arrowSprite;
    },

    createGreenSprite: function() {

        let path = res.MapUI.background.path;
        let greenSprite = {};
        for(let i = 1; i <= res.MapUI.maxObjectSize.width; i++) {
            greenSprite[i] = new cc.Sprite(path + "/" + res.MapUI.background.name.greenred + i.toString() + ".png");
            greenSprite[i].setLocalZOrder(res.MapUI.zPosition.invisible);
            greenSprite[i].setAnchorPoint(cc.p(0.5, 0));
            greenSprite[i].setScale(res.MapUI.background.scale.grass);
        }
        return greenSprite;
    },

    createRedSprite: function() {

        let path = res.MapUI.background.path;
        let redSprite = {};
        for(let i = 1; i <= res.MapUI.maxObjectSize.width; i++) {
            redSprite[i] = new cc.Sprite(path + "/" + res.MapUI.background.name.red + i.toString() + ".png");
            redSprite[i].setScale(res.MapUI.background.scale.grass);
            redSprite[i].setLocalZOrder(res.MapUI.zPosition.invisible);
            redSprite[i].setAnchorPoint(cc.p(0.5, 0));
        }
        return redSprite;
    },

    createBuildingActionButton: function() {

        let buildingActionButton = {};
        let buildingAction = res.MapUI.action.type;
        for (let key in buildingAction) {
            if (buildingAction.hasOwnProperty(key)) {
                let resPath = res.MapUI.action.path + "/" + buildingAction[key].path;
                // cc.log(resPath);
                let button = ccui.Button(resPath);
                button = gv.animatedButton(button, false, function(){

                });
                button.setAnchorPoint(0.5, 1);
                button.setPosition(cc.p(0, 0));
                buildingActionButton[key] = button;
                let description = new cc.LabelBMFont(buildingAction[key].vname, "res/fonts/soji_16.fnt");
                button.addChild(description);
                description.setColor(cc.color(255, 255, 255, 1));
                description.setPosition(cc.p(0, 0));
                description.setAnchorPoint(cc.p(0, 0));
            }
        }
        return buildingActionButton;
    },

    createBuildingBuildActionButton: function() {
        let buildingBuildAction = res.MapUI.action.buildAction.type;
        let buildingBuildActionButton = {};
        for (let key in buildingBuildAction) {
            if (buildingBuildAction.hasOwnProperty(key)) {
                let resPath = res.MapUI.action.path + "/" + buildingBuildAction[key].path;
                 //cc.log(resPath);
                let button = ccui.Button(resPath);
                button = gv.animatedButton(button, false, function(){

                });
                if (key == res.MapUI.action.buildAction.type.accept.name) {
                    button.setAnchorPoint(1, 0.5);
                    button.callback = function() {
                        gv.objectManager.acceptBuild();
                    }
                } else {
                    button.setAnchorPoint(0, 0.5);
                    button.callback = function() {
                        gv.objectManager.cancelBuild();
                    }
                }
                button.setEnabled(false);
                button.setLocalZOrder(res.MapUI.zPosition.invisible);
                button.setPosition(cc.p(-button.width, -button.height));
                buildingBuildActionButton[key] = button;
            }
        }
        return buildingBuildActionButton;
    },

    createBuildingUpgradeEffect: function(screen, p) {
        let resPath = res.MapUI.buildings.effectPath + "/" + res.MapUI.buildings.effect.levelUp.path;
        let pathList = [];
        for(let i = 0; i < res.MapUI.buildings.effect.levelUp.animatedList.length; i++) {
            let path = resPath + "/" + res.MapUI.buildings.effect.levelUp.animatedList[i];
            pathList.push(path);
        }
        let sprite = gv.nodeUtils.createEffectSpriteFromPathList(pathList);
        let anchorPoint = cc.p(0.5, 0);
        sprite.setAnchorPoint(anchorPoint);
        sprite.setLocalZOrder(res.MapUI.zPosition.arrow);
        sprite.setPosition(cc.p(p.x, p.y));
        screen.addChild(sprite);
    },

    createBuildingExplosionEffect: function(screen, p) {
        let resPath = res.BattleUI.effect.buildingExplosion.path;
        let pathList = [];
        for(let i = 0; i < res.BattleUI.effect.buildingExplosion.length; i++) {
            let path = "";
            if (i >= 10)
                path = resPath + "/" + i.toString() + ".png";
            else
                path = resPath + "/0" + i.toString() + ".png";
            pathList.push(path);
        }
        let sprite = gv.nodeUtils.createEffectSpriteFromPathList(pathList);
        let anchorPoint = cc.p(0.5, 0);
        sprite.setAnchorPoint(anchorPoint);
        sprite.setLocalZOrder(res.MapUI.zPosition.arrow);
        sprite.setPosition(cc.p(p.x, p.y));
        screen.addChild(sprite);
    },

    createCannonHitEffect: function(screen, p) {
        let resPath = res.BattleUI.effect.cannonHit.path;
        let pathList = [];
        for(let i = 0; i < res.BattleUI.effect.cannonHit.length; i++) {
            let path = "";
            if (i >= 10)
                path = resPath + "/" + i.toString() + ".png";
            else
                path = resPath + "/0" + i.toString() + ".png";
            pathList.push(path);
        }
        let sprite = gv.nodeUtils.createEffectSpriteFromPathList(pathList);
        let anchorPoint = cc.p(0.5, 0.5);
        sprite.setAnchorPoint(anchorPoint);
        sprite.setLocalZOrder(res.MapUI.zPosition.arrow);
        sprite.setPosition(cc.p(p.x, p.y));
        screen.addChild(sprite);
    },

    createMortarHitEffect: function(screen, p) {
        let resPath = res.BattleUI.effect.mortarBulletExplosion.path;
        let pathList = [];
        for(let i = 0; i < res.BattleUI.effect.mortarBulletExplosion.length; i++) {
            let path = "";
            if (i >= 10)
                path = resPath + "/" + i.toString() + ".png";
            else
                path = resPath + "/0" + i.toString() + ".png";
            pathList.push(path);
        }
        let sprite = gv.nodeUtils.createEffectSpriteFromPathList(pathList);
        let anchorPoint = cc.p(0.5, 0.5);
        sprite.setAnchorPoint(anchorPoint);
        sprite.setLocalZOrder(res.MapUI.zPosition.arrow);
        sprite.setPosition(cc.p(p.x, p.y));
        screen.addChild(sprite);
    },

    createCannonFireEffect: function(screen, p) {
        let resPath = res.BattleUI.effect.cannonFire.path;
        let pathList = [];
        for(let i = 0; i < res.BattleUI.effect.cannonFire.length; i++) {
            let path = "";
            if (i >= 10)
                path = resPath + "/" + i.toString() + ".png";
            else
                path = resPath + "/0" + i.toString() + ".png";
            pathList.push(path);
        }
        let sprite = gv.nodeUtils.createEffectSpriteFromPathList(pathList);
        let anchorPoint = cc.p(0.5, 0.5);
        sprite.setAnchorPoint(anchorPoint);
        sprite.setLocalZOrder(res.MapUI.zPosition.arrow);
        sprite.setPosition(cc.p(p.x, p.y));
        screen.addChild(sprite);
    },

    createRequiredResourceBar: function(type, quantity) {
        let path = res.MapUI.upgradeGUIPath.path;
        switch (type) {
            case res.ResourceType.gold:
                path = path + "/" + res.MapUI.upgradeGUIPath.type.gold_required;
                break;
            case res.ResourceType.elixir:
                path = path + "/" + res.MapUI.upgradeGUIPath.type.elixir_required;
                break;
            case res.ResourceType.darkElixir:
                path = path + "/" + res.MapUI.upgradeGUIPath.type.darkElixir_required;
                break;
            case res.ResourceType.coin:
                path = path + "/" + res.MapUI.upgradeGUIPath.type.coin_required;
                break;
        }
        let icon = new cc.Sprite(path);
        let quantityString = new cc.LabelBMFont(quantity.toString(), "res/fonts/soji_12.fnt");
        quantityString.setPosition(cc.p(-100, -100));
        quantityString.setColor(cc.color(255, 255, 255, 1));
        quantityString.addChild(icon);
        icon.setAnchorPoint(cc.p(0, 0));
        icon.setPosition(cc.p((quantityString.width + icon.width) / 2, 0));
        quantityString.updateAnchorPoint = function() {
            quantityString.setAnchorPoint(cc.p(((quantityString.width + icon.width) / 2) / quantityString.width, 1));
            icon.setPosition(cc.p(quantityString.width, 0));
        };
        quantityString.updateAnchorPoint();
        return quantityString;
    },

    createJunkBuildingSprite: function(resName, pos, zOrder) {
        let resPath = res.BattleUI.effect.path + "/" + resName;
        let sprite = new cc.Sprite(resPath);
        sprite.setAnchorPoint(cc.p(0.5, 0));
        sprite.setPosition(cc.p(pos.x, pos.y));
        sprite.setLocalZOrder(zOrder);
        return sprite;
    },

    createBuildingAttributeSprite: function(type) {
        //cc.log(type);
        let path = res.MapUI.buildingAttribute.path + "/" + res.MapUI.buildingAttribute[type].iconPath;
        let sprite = new cc.Sprite(path);
        //cc.log(path);
        return sprite;
    },

    createBullet: function(defType) {
        switch (defType) {
            case res.BattleUI.defenceType.cannon:
                return this.createCannonBullet();
            case res.BattleUI.defenceType.archerTower:
                break;
            case res.BattleUI.defenceType.mortar:
                return this.createMortarBullet();
        }
    },

    createMortarBullet: function() {
        let resPath = res.BattleUI.effect.mortarBulletNormal.path ;
        let sprite = gv.poolObjects.get(cc.Sprite, resPath + "/00.png");
        let pathList = [];
        for (let i = 0; i < res.BattleUI.effect.mortarBulletNormal.length; i++) {
            let path = "";
            if (i >= 10)
                path = resPath + "/" + i.toString() + ".png";
            else
                path = resPath + "/0" + i.toString() + ".png";
            pathList.push(path);
        }
        let action = gv.nodeUtils.createAnimationFromPathList(pathList, 0.1);
        action.repeatForever();

        sprite.runAction(action);
        return sprite;
    },

    createCannonBullet: function() {
        let path = res.BattleUI.effect.path + "/" + res.BattleUI.effect.cannonBullet;
        let sprite = gv.poolObjects.get(cc.Sprite, path);

        sprite.setLocalZOrder(res.MapUI.zPosition.arrow);
        return sprite;
    },

    getBulletOffsetByDirection: function(defType, direction) {


        let offset = {};
        switch (direction) {
            case res.Direction.EAST:
                offset = res.BattleUI.effect.bulletOffset.EAST;
                break;
            case res.Direction.SOUTH:
                offset = res.BattleUI.effect.bulletOffset.SOUTH;
                break;
            case res.Direction.SOUTHEAST:
                offset = res.BattleUI.effect.bulletOffset.SOUTHEAST;
                break;
            case res.Direction.SOUTHWEST:
                offset = res.BattleUI.effect.bulletOffset.SOUTHWEST;
                break;
            case res.Direction.NORTH:
                offset = res.BattleUI.effect.bulletOffset.NORTH;
                break;
            case res.Direction.NORTHEAST:
                offset = res.BattleUI.effect.bulletOffset.NORTHEAST;
                break;
            case res.Direction.NORTHWEST:
                offset = res.BattleUI.effect.bulletOffset.NORTHWEST;
                break;
            case res.Direction.WEST:
                offset = res.BattleUI.effect.bulletOffset.WEST;
                break;
        }
        if (defType == res.BattleUI.defenceType.mortar) {
            offset = cc.p(-offset.x, -offset.y);
        }
        let scale = res.BattleUI.effect.bulletOffset.scale;
        return {
            x: offset.x * scale,
            y: offset.y * scale
        }
    },

    getBulletFlyingTick: function(distance, defType) {
        let speed = 100;
        switch (defType) {
            case res.BattleUI.defenceType.cannon:
                speed = res.BattleUI.bulletSpeed.cannon;
                break;
            case res.BattleUI.defenceType.archerTower:
                speed = res.BattleUI.bulletSpeed.archer_arrow;
                break;
            case res.BattleUI.defenceType.mortar:
                speed = res.BattleUI.bulletSpeed.mortar;
                break;
        }
        return Math.ceil(distance / speed / res.BattleUI.timeTick);
    },

    getMortarZInitialVelocity: function(initialZ, flyingTime) {
        let acceleration = -res.BattleUI.bulletSpeed.mortarGravity;
        let time = flyingTime;
        let result = (-initialZ - 1 / 2 * acceleration * time * time) / time;
        return result;
    }

});