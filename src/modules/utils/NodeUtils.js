
var NodeUtils = cc.Class.extend({
    // pass string if node is a label
    monitorNode: function(node, zOrder, position) {
        if (node == null)
            return;
        if (zOrder != null) {
            node.setLocalZOrder(zOrder);
        }
        if (position != null) {
            node.setPosition(cc.p(position.x, position.y));
        }
    },

    monitorLabel: function(label, zOrder, position, string) {
        if (label == null)
            return;
        this.monitorNode(label, zOrder, position);
        if (string != null) {
            label.setString(string);
        }
    },

    monitorButton: function(button, zOrder, position, enabled) {
        if (button == null)
            return;
        this.monitorNode(button, zOrder, position);
        if (enabled != null) {
            button.setEnabled(enabled);
        }
    },

    createAnimatedSpriteFromPathList: function(pathList, durationPerFrame, tag) {
        let animation = new cc.Animation();
        for(let i = 0; i < pathList.length; i++) {
            //cc.log(path);
            animation.addSpriteFrameWithFile(pathList[i]);
        }
        animation.setDelayPerUnit(durationPerFrame);
        let action = cc.repeatForever(cc.animate(animation));
        if (tag != null) {
            action.setTag(tag);
        }
        let sprite = new cc.Sprite(pathList[0]);
        sprite.runAction(action);
        return sprite;
    },

    createEffectSpriteFromPathList: function(pathList) {
        let animation = new cc.Animation();
        let sprite = new cc.Sprite(pathList[0]);
        for(let i = 0; i < pathList.length; i++) {
            //cc.log(path);
            animation.addSpriteFrameWithFile(pathList[i]);
        }
        animation.setDelayPerUnit(0.1);
        let action = cc.animate(animation);
        let sequence = cc.Sequence.create(action, cc.RemoveSelf.create());
        sprite.runAction(sequence);
        return sprite;
    },

    createAnimatedAction: function(pathList, durationPerFrame) {
        let action = function() {
            let animation = new cc.Animation();
            //cc.log("path list:", JSON.stringify(pathList));
            for (let i = 0; i < pathList.length; i++) {
                animation.addSpriteFrameWithFile(pathList[i]);
            }
            animation.setDelayPerUnit(durationPerFrame);
            return cc.animate(animation);
        };
        return action;
    },

    createAnimationFromPathList: function(pathList, durationPerFrame) {
        let animation = new cc.Animation();
        //cc.log("path list:", JSON.stringify(pathList));
        for (let i = 0; i < pathList.length; i++) {
            animation.addSpriteFrameWithFile(pathList[i]);
        }
        animation.setDelayPerUnit(durationPerFrame);
        return cc.animate(animation);
    }

});