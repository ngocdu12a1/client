/**
 * Created by Fersher_LOCAL on 7/9/2020.
 */


var ObjectUtils = cc.Class.extend({

    getObjectFromInfo: function(obj) {
        let type = obj.type;
        let resultObj = null;
        let objType = res.MapUI.buildings.type;
        if (type.substring(0, 3) == "OBS") {
            resultObj = new Obstacle(obj);
        } else
            switch (type) {
                case objType.TownHall.name:
                    resultObj = new TownHall(obj);
                    break;
                case objType.GoldMine.name:
                    resultObj = new GoldMine(obj);
                    break;
                case objType.ArmyCamp.name:
                    resultObj = new ArmyCamp(obj);
                    break;
                case objType.BuilderHut.name:
                    resultObj = new BuilderHut(obj);
                    break;
                case objType.Barrack.name:
                    resultObj = new Barrack(obj);
                    break;
                case objType.ElixirCollector.name:
                    resultObj = new ElixirCollector(obj);
                    break;
                case objType.GoldStorage.name:
                    resultObj = new GoldStorage(obj);
                    break;
                case objType.ElixirStorage.name:
                    resultObj = new ElixirStorage(obj);
                    break;
                case objType.DarkElixirCollector.name:
                    resultObj = new DarkElixirCollector(obj);
                    break;
                case objType.DarkElixirStorage.name:
                    resultObj = new DarkElixirStorage(obj);
                    break;
                case objType.Cannon.name:
                    resultObj = new Cannon(obj);
                    break;
                case objType.AirDefense.name:
                    resultObj = new AirDefense(obj);
                    break;
                case objType.ArcherTower.name:
                    resultObj = new ArcherTower(obj);
                    break;
                case objType.Mortar.name:
                    resultObj = new Mortar(obj);
                    break;
                case objType.Wall.name:
                    resultObj = new Wall(obj);
                    break;
            }
        return resultObj;
    },

    getObjectZOrder: function(p) {
        return constantData.MAP_X - p.x + constantData.MAP_Y - p.y;
    },

    getUpgradingSprite: function() {
        let sprite = new cc.Sprite(res.MapUI.buildings.path + "/" + res.MapUI.buildings.effect.upgradingFence.path);
        sprite.setLocalZOrder(res.MapUI.zPosition.invisible);
        sprite.setAnchorPoint(cc.p(0.5, 0));
        return sprite;
    },

    getGrassSprite: function(size, isBuilding) {
        let path = "";
        if (isBuilding)
            path = res.MapUI.background.path + "/" + res.MapUI.background.name.grass + size.toString() + ".png";
        else
            path = res.MapUI.background.path + "/" + res.MapUI.background.name.obsgrass + size.toString() + ".png";
        //cc.log(path);
        let sprite = new cc.Sprite(path);
        sprite.setAnchorPoint(cc.p(0.5, 0));
        sprite.setLocalZOrder(res.MapUI.zPosition.grass);
        sprite.setScale(res.MapUI.background.scale.grass);
        return sprite;
    },

    getIdleSprite: function(objResPath, width, height, extraSprite) {
        let resPath = res.MapUI.buildings.path + "/" + objResPath;
        let result = {};
         // cc.log(path);
        for(let key in extraSprite) {
            if (extraSprite.hasOwnProperty(key)) {
                let path = resPath + "/idle/" + extraSprite[key];
                let sprite = new cc.Sprite(path);
                // cc.log(path);
                let rangeY = height * res.MapUI.grassTileSize.height;
                sprite.setLocalZOrder(res.MapUI.zPosition.invisible);
                let startY = (sprite.height - rangeY) / 2;
                let anchorPoint = cc.p(0.5, startY / sprite.height);
                sprite.setAnchorPoint(anchorPoint);
                result[key] = sprite;
            }
        }
        return result;
    },

    getAnimatedSprite: function(objResPath, animatedList, width, height, durationPerFrame) {
        if (animatedList.length == 0)
            return null;
        let resPath = res.MapUI.buildings.effectPath + "/" + objResPath + "_effect";
        let pathList = [];
        for(let i = 0; i < animatedList.length; i++) {
            let path = resPath + "/" + animatedList[i];
            pathList.push(path);
        }
        let sprite = gv.nodeUtils.createAnimatedSpriteFromPathList(pathList, durationPerFrame, res.MapUI.actionTag.idleAnimated);
        let rangeY = height * res.MapUI.grassTileSize.height;
        let startY = (sprite.height - rangeY) / 2;
        let anchorPoint = cc.p(0.5, startY / sprite.height);
        sprite.setAnchorPoint(anchorPoint);
        return sprite;
    },

    createProgressTimer: function() {
        let progressTimer = new cc.LabelBMFont("", "res/fonts/soji_20.fnt");
        progressTimer.setLocalZOrder(res.MapUI.zPosition.invisible);
        //this.levelString.textAlign(cc.TEXT_ALIGNMENT_CENTER);
        progressTimer.setAnchorPoint(cc.p(0.5, 0));
        progressTimer.setColor(cc.color(255, 255, 255, 1));
        return progressTimer;
    },

    createProgressBar: function() {
        let progressBar = new cc.Sprite(res.MapUI.upgradeGUIPath.path + "/" +res.MapUI.upgradeGUIPath.type.progress_bar);
        let progressBarBG = new cc.Sprite(res.MapUI.upgradeGUIPath.path + "/" + res.MapUI.upgradeGUIPath.type.progress_bar_bg);
        progressBar.setAnchorPoint(cc.p(0, 1));
        progressBarBG.setAnchorPoint(cc.p(0.5, 1));
        return {
            bar: progressBar,
            barBG: progressBarBG
        };
    },

    createBuildingHealthBar: function() {
        let healthBar = new cc.Sprite(res.MapUI.upgradeGUIPath.path + "/" +res.MapUI.upgradeGUIPath.type.health_bar);
        let healthBarBG = new cc.Sprite(res.MapUI.upgradeGUIPath.path + "/" + res.MapUI.upgradeGUIPath.type.health_bar_bg);
        healthBar.setAnchorPoint(cc.p(0, 1));
        healthBarBG.setAnchorPoint(cc.p(0.5, 1));
        return {
            bar: healthBar,
            barBG: healthBarBG
        };
    },

    getStorageNameByResource: function(resType) {
        switch (resType) {
            case res.ResourceType.elixir:
                return res.MapUI.buildings.type.ElixirStorage.name;
            case res.ResourceType.gold:
                return res.MapUI.buildings.type.GoldStorage.name;
        }
    },

    createAnimatedObjectEffect: function(resPath, beginRes, endRes) {
        let path = res.MapUI.buildings.path + "/" + resPath + "/attack01";
        let pathList = [];
        for(let i = beginRes; i <= endRes; i++) {
            let frPath = "";
            if (i < 10)
                frPath = path + "/image000" + i.toString() + ".png";
            else
                frPath = path + "/image00" + i.toString() + ".png";
            pathList.push(frPath);
        }
        let anmAction = gv.nodeUtils.createAnimatedAction(pathList, 0.1);
        return anmAction;
    },

    createAttackHitSprite: function(width, height) {
        let sprite = new cc.Sprite(res.BattleUI.effect.attackHit0.path + "/00.png");
        let rangeY = height * res.MapUI.grassTileSize.height;
        let startY = (sprite.height - rangeY) / 2;
        let anchorPoint = cc.p(0.5, startY / sprite.height);
        sprite.setAnchorPoint(anchorPoint);
        return sprite;
    },

    createAttackHitAnimation: function(order) {
        let ordName = "attackHit" + order.toString();
        let resPath = res.BattleUI.effect[ordName].path;
        let pathList = [];
        let startPath = Math.floor(Math.random() * res.BattleUI.effect[ordName].length);
        for(let j = 0; j < res.BattleUI.effect[ordName].length; j++) {
            let i = (startPath + j) % res.BattleUI.effect[ordName].length;
            let path = "";
            if (i >= 10)
                path = resPath + "/" + i.toString() + ".png";
            else
                path = resPath + "/0" + i.toString() + ".png";
            pathList.push(path);
        }
        return gv.nodeUtils.createAnimationFromPathList(pathList, 0.1);
    }



});
