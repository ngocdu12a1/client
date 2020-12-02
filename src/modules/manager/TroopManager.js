var TroopManager = cc.Layer.extend({
    _totalTroop: 0,
    _troopList: [{
        type: null,
        x: null,
        y: null
    }],
    ctor:function(){
        this._super();
    },
    addTroop:function(troop){
        this._troopList.push(
            troop
        );
    },
    handleGetTroopResponse: function(troops){
        //cc.log("troop: " + JSON.stringify(troops));
        var self = this;
        troops.forEach(function(amc){
            var id = amc.id;
            var troopList = amc.troopList;
            //cc.log(id + " " + troopList);
            troopList.forEach(function(troop){
                var housingSpace = gv.dataWrapper.getTroopBaseConfig(troop.type).housingSpace;
                self._totalTroop += (troop.amount * housingSpace);
                var pos = gv.objectManager.getObjectIsoPositionById(id);
                for (var i = 0; i < troop.amount; i++){
                    var newTroop = new Troop(troop.type, 1, pos.x, pos.y);
                    newTroop.addToMap();
                    newTroop.followBuildingById(id);
                    self.addTroop(newTroop);
                }
            });
        });
        testnetwork.connector.sendResource();
    },
    addTotalTroop: function(troopType){
        var housingSpace = gv.dataWrapper.getTroopBaseConfig(troopType).housingSpace;

        this._totalTroop += housingSpace;
    },
    getTotalTroop: function(){
        return this._totalTroop;
    }
});