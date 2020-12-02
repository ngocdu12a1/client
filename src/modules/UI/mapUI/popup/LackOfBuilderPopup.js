/**
 * Created by Fersher_LOCAL on 7/20/2020.
 */

var LackOfBuilderPopup = cc.Layer.extend({
    isOpen: false,
    objId: null,
    actionType: null,

    ctor: function() {
        this._super();
        this.setLocalZOrder(res.MapUI.zPosition.shopFrame);
        return true;
    },

    isOpening: function() {
        return this.isOpen;
    },

    openPopup: function(actionType, objId) {
        this.removeAllChildren();
        let self = this;
        this.isOpen = true;
        this.actionType = actionType;
        this.objId = objId;

        this._node = new gv.PopupUI(res.MapUI.lackOfBuilderPopup);

        let cancelButton = this._node.getElementByName("cancelButton");
        cancelButton = gv.animatedButton(cancelButton, true, function () {
            self.isOpen = false;
            self._node.close();
        });

        let acceptButton = this._node.getElementByName("acceptButton");

        let chosenBuilderHut = gv.resourceManager.getLeastRemainingTimeBuilderHut();
        let coinRequiredQuantity =  gv.resourceUtils.timeToCoin(chosenBuilderHut.remainingTime);
        let coinRequired = gv.mapUtils.createRequiredResourceBar(res.ResourceType.coin, coinRequiredQuantity.toString());
        if (coinRequiredQuantity > gv.resourceManager.getTotalResource(res.ResourceType.coin)) {
            coinRequired.setColor(cc.color(255, 0, 0, 1));
            acceptButton = gv.animatedButton(acceptButton, false, function() {

            });
        } else {
            acceptButton = gv.animatedButton(acceptButton, true, function () {
                switch (chosenBuilderHut.targetIsBuilding) {
                    case true:
                        gv.requestManager.sendQuickFinishRequest(chosenBuilderHut.targetId, true, Math.round(gv.timeUtils.getCurrentTimeMillis() / 1000));
                        break;
                    case false:
                        gv.requestManager.sendQuickFinishRequest(chosenBuilderHut.targetId, false, Math.round(gv.timeUtils.getCurrentTimeMillis() / 1000));
                        break;
                }
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
        });
    },

    onEnter : function() {
        this._super();
    },

    onRemove: function() {
        cc.unloadAllAnimationData(this);
    }
});
