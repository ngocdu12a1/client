/**
 * Created by Fersher_LOCAL on 7/20/2020.
 */


var LackOfResPopup = cc.Layer.extend({
    isOpen: false,
    objId: null,
    actionType: null,

    ctor: function() {
        this._super();
        this.setLocalZOrder(res.MapUI.zPosition.shopFrame);
        return true;
    },

    openPopup: function(actionType, objId, resourcesList) {
        this.removeAllChildren();
        let self = this;
        this.isOpen = true;
        this.actionType = actionType;
        this.objId = objId;
        this._node = new gv.PopupUI(res.MapUI.lackOfResPopup);

        let text = this._node.getElementByName("text");
        let startY = text.y - 10;
        for(let key in resourcesList) {
            if (resourcesList.hasOwnProperty(key)) {
                let sprite = gv.mapUtils.createRequiredResourceBar(key, resourcesList[key]);
                sprite.setPosition(cc.p(text.x, startY));
                sprite.setColor(cc.color(255, 0, 0, 1));
                this._node.addNewChild(sprite);
                startY = sprite.y - sprite.height;
            }
        }


        let cancelButton = this._node.getElementByName("cancelButton");
        cancelButton = gv.animatedButton(cancelButton, true, function () {
            self.isOpen = false;
            self._node.close();
        });

        let coinRequiredQuantity =  gv.resourceUtils.resourceToCoin(resourcesList);
        let acceptButton = this._node.getElementByName("acceptButton");


        let coinRequired = gv.mapUtils.createRequiredResourceBar(res.ResourceType.coin, coinRequiredQuantity.toString());
        if (coinRequiredQuantity > gv.resourceManager.getTotalResource(res.ResourceType.coin)) {
            coinRequired.setColor(cc.color(255, 0, 0, 1));
            acceptButton = gv.animatedButton(acceptButton, false, function() {
            });
        } else {
            acceptButton = gv.animatedButton(acceptButton, true, function() {
                let gold = resourcesList[res.ResourceType.gold];
                if (gold == null)
                    gold = 0;
                let elixir = resourcesList[res.ResourceType.elixir];
                if (elixir == null)
                    elixir = 0;
                let darkElixir = resourcesList[res.ResourceType.darkElixir];
                if (darkElixir == null)
                    darkElixir = 0;
                gv.requestManager.sendUpdateResourceRequest(gold, elixir, darkElixir, -coinRequiredQuantity);
            });

        }
        coinRequired.setPosition(cc.p(acceptButton.x, acceptButton.y + 10));
        this._node.addNewChild(coinRequired);

        this._node.open();
        this.addChild(this._node);
    },

    closePopup: function() {
        if (!this.isOpen)
            return;
        let self = this;
        self.isOpen = false;
        this._node.close(function() {
            self.scheduleOnce(function() {
                gv.requestManager.handleLackOfPopupResponse(self.actionType, self.objId);
            }, 0.2);
            //gv.requestManager.handleLackOfPopupResponse(self.actionType, self.objId);
        });
    },

    onEnter : function() {
        this._super();
    },

    onRemove: function() {
        cc.unloadAllAnimationData(this);
    }
});
