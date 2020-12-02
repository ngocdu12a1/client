var TrainManager = cc.Layer.extend({
    _node: null,
    _trainStatus: true,
    _currentDisplay: null,
    _barrackList: [],
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        this._barrackList = [];
        // this.addBarrack(100, 1);
        // this.addBarrack(62, 2);
        // this.addBarrack(100, 6);
    },
    addBarrack:function(id, level){
        var newBarrackNumber = this._barrackList.length + 1;
        var existed = false;
        this._barrackList.forEach(function(barrack){
            if (barrack._id == id){
                barrack.updateLevel(level);
                existed = true;
            }
        });
        // cc.log(existed);
        if (!existed){
            var newBarrack = new TrainGUI(id, level, newBarrackNumber);
            this._barrackList.push(newBarrack);
            gv.game_lobby.addChild(newBarrack);
        }
        // cc.log(JSON.stringify(this._barrackList));
    },
    setTrainStatus: function(status){
        this._trainStatus = status;
    },
    getBarrack:function(index){
        return this._barrackList[index];
    },
    getBarrackList:function(){
        return this._barrackList;
    },
    getTotalTrainingTroop: function(){
        var result = 0;
        this._barrackList.forEach(function (barrack) {
            result += barrack.getTrainingTroop();
        });
        return result;
    },
    clearTrainList: function(){

    },

    getTrainStatus: function(){
        return this._trainStatus;
    },
    handleGetTrainInfoResponse: function(trainingTroops){
        var self = this;
        //cc.log(JSON.stringify(trainingTroops));
        trainingTroops.forEach(function(bar){
            var id = bar.id;
            var timestamp = bar.timestamp;
            var queue = bar.troops;
            for (var i = 0; i < self._barrackList.length; i++){
                var barrack = self._barrackList[i];
                if (barrack._id == id){
                    barrack.addTroopToBarrack(queue, timestamp);
                    return;
                }
            }
            //var barrack = self._barrackList.filter(function(barr){
            //    return barr._id == id;
            //});
            // _barrackList[index]
            //self.getBarrack(id).addTroopToBarrack(queue, timestamp);
            //cc.log("barrack " + barrack);
            // cc.log(JSON.stringify(barrack));
            //try{
            //    barrack.addTroopToBarrack(queue, timestamp);
            //} catch (e){
            //    cc.log(e);
            //}
        });
    },
    handleTrainResponse: function(type, id){
        //var self = this;
        //var barrack = this._barrackList.filter(function(barrack){
        //    return barrack._id == id;
        //});
        //barrack.addTroopByName(type);
    },
    handleSkipTroopResponse: function(barrackID, armyCampID, timestamp){
        //var barrack = self._barrackList.filter(function(barrack){
        //    return barrack._id == barrackID;
        //});
        //barrack.skipTroop();
    },
    handleCancelTroopResponse: function(type, id){
        
    },
    handleTrainTroopFinishResponse: function(barrackID, armyCampID, timestamp){
        
    }
});