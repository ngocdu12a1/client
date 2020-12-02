var TroopInfoPopup = cc.Layer.extend({
    _node: null,
    _troopConfig: null,
    _troopBaseConfig: null,
    ctor: function(){
        this._super();
        this._node = new gv.PopupUI(res.troop.infoJSON);
        this.addChild(this._node);
        this.setVisible(false);
        this.setLocalZOrder(res.MapUI.zPosition.shopFrame);
    },

    openInfo: function(type, level){
        var self = this;
        var node = this._node._node;
        this._troopConfig = gv.dataWrapper.getTroopConfig(type, level);
        this._troopBaseConfig = gv.dataWrapper.getTroopBaseConfig(type);

        //load title
        var title = node.getChildByName("title");
        title.setString(res.TroopUI.troopName[type] + " cấp 1");

        //load the exit button
        var closeBtn = this._node.getElementByName(res.base.button.close);
        closeBtn = gv.animatedButton(closeBtn, false, function () {
            self._node.close();
        });

        //load troop
        var troop = node.getChildByName("troop");
        var troopPath = res.troop.iconPrefix + type + "_" + level + ".png";
        
        troop.setTexture(troopPath);
        //load bars
        var attributeList = ["damagePerAttack", "hitpoints", "trainingElixir"];
        var attributeNameList = ["Sát thương: ", "Máu: ", "Giá: "];
        var maxLevel = 9;

        for (var i = 0; i < attributeList.length; i++){
            var currentAttribute = gv.dataWrapper.getTroopConfig(type, 1)[attributeList[i]];
            var maxAttribute = gv.dataWrapper.getTroopConfig(type, maxLevel)[attributeList[i]];

            var attributeBar = node.getChildByName(attributeList[i]);
            var progressBar = attributeBar.getChildByName("progressBar");
            //cc.log (currentAttribute + " " + maxAttribute);
            progressBar.setPercent(currentAttribute / maxAttribute * 100);

            var attributeTitle = attributeBar.getChildByName("barTitle");
            attributeTitle.setString(attributeNameList[i] + currentAttribute);
        }

        //load base attributes
        var baseAttributeList = ["favoriteTarget", "attackRadius", "attackArea", "moveSpeed", "trainingTime", "housingSpace"];
        for (var i = 0; i < baseAttributeList.length; i++){
            var baseAttributeTitle = node.getChildByName(baseAttributeList[i]);
            var baseAttribute = gv.dataWrapper.getTroopBaseConfig(type)[baseAttributeList[i]];

            baseAttributeTitle.setString(self.normalizeAttribute(baseAttribute, baseAttributeList[i]));
        }

        this.setVisible(true);
        this._node.open();

    },
    normalizeAttribute: function(attribute, attributeName){
        var result;
        switch (attributeName){
            case "favoriteTarget":
                if (attribute == "NONE") result = "Tất cả";
                if (attribute == "DEF") result = "Công trình phòng thủ";
                break;
            case "attackRadius":
                if (attribute == 0) result = "Một mục tiêu";
                if (attribute > 0) result = "Nhiều mục tiêu";
                break;
            case "attackArea":
                if (attribute == 1) result = "Dưới đất";
                if (attribute == 3) result = "Dưới đất và trên không";
                break;
            default:
                result = attribute;
                break;
        }
        return result;
    }
});