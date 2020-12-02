var TroopIcon = cc.Layer.extend({
    _sprite: null,
    _button: null,
    _name: null,
    _label: null,
    _barrackId: null,
    _barrackX: null,
    _barrackY: null,
    _campId: null,
    _trainTime: 0,
    _trainTimeTmp: 0,
    _totalTime: 0,
    _number: 1,
    _space: 0,
    _config: null,
    ctor:function(name, barrackId, barrackX, barrackY){
        this._super();
        this._name = name;
        this._barrackId = barrackId;
        this._barrackX = barrackX;
        this._barrackY = barrackY;
        this.getConfig();
        this.init();
    },
    init:function(){
        var self = this;
        var path = res.troop.path + this._name + ".png";
        //back ground
        this._button = new ccui.Button(res.troop.smallIconBackground, res.troop.smallIconBackground, res.troop.smallIconBackground);
        this._button = gv.animatedButton(this._button, false, function(){
            testnetwork.connector.sendCancelTroop(self._name, self._barrackId);
            self.decreaseNumber();
        });
        this.addChild(this._button);
        //sprite
        this._sprite = new cc.Sprite(path);
        this._button.addChild(this._sprite);
        this._sprite.setPosition(cc.p(this._button.width/2, this._button.height/2));
        //cancel button
        var cancelButton = new cc.Sprite(res.troop.cancel);
        this._button.addChild(cancelButton);
        cancelButton.setPosition(cc.p(this._button.width - cancelButton.width/9, this._button.height - cancelButton.height/9));

        //label
        this._label = new cc.LabelBMFont("", res.font.soji12);
        this.displayNumber();
        this._button.addChild(this._label);
        this._label.setPosition(cc.p(this._label.width/2, this._button.height - this._label.height/2));
        //get train time
        this._trainTime = this.getTrainTime();
        this._trainTimeTmp = this._trainTime;
        this._totalTime = this._trainTime * (this._number - 1) + this._trainTimeTmp;

        //get housing space
        this._space = this.getHousingSpaceConfig();
    },
    setTrainTimeTmp: function(time){
        this._trainTimeTmp = time;
        this._totalTime = this._trainTime * (this._number - 1) + this._trainTimeTmp;
    },
    getName:function(){
        return this._name;
    },
    getNumber: function(){
        return this._number;
    },
    getTrainTime:function(){
        return this._config.trainingTime;
    },
    getTotalTrainTime:function(){
        return this._totalTime;
    },
    getHousingSpaceConfig:function(){
        return this._config.housingSpace;
    },
    getHousingSpace:function(){
        return this._space;
    },
    getConfig:function(){
        this._config = gv.dataWrapper.getTroopBaseConfig(this._name);
    },
    decreaseTrainTime:function(speed){
        if (this._trainTimeTmp != 0)
            this._totalTime -= speed;
        this._trainTimeTmp -= speed;
        if (this._trainTimeTmp < 0) this._trainTimeTmp = 0;
        if (this._totalTime < 0) this._totalTime = 0;
        if (Math.floor(this._trainTimeTmp) == 0){
            if (gv.trainManager.getTrainStatus()){
                this._trainTimeTmp = this._trainTime;
                gv.troopManager.addTotalTroop(this._name);
                var listCamp = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.ArmyCamp.name);
                var campIndex = Math.floor(Math.random() * listCamp.length);
                var armyCampId = listCamp[campIndex].getId();
                var timestamp = Math.floor(gv.timeUtils.getCurrentTimeMillis()/ 1000);
                testnetwork.connector.sendTrainTroopFinish(this._barrackId, armyCampId, timestamp);
                testnetwork.connector.sendResource();
                this.addTroopToMap(this._name, armyCampId);
                this.decreaseNumber();
            }
            else {
                this._trainTimeTmp = 0;
            }
        }
    },
    addTroopToMap:function(name, campId){
        var troop = new Troop(name, 1, this._barrackX, this._barrackY);
        troop.addToMap();
        var campPosition = gv.resourceManager.getArmyCampListPosition();
        //cc.log(JSON.stringify(campPosition));
        // var pos = Math.floor(Math.random() * campPosition.length);
        //cc.log(this._campId);
        this._campId = campId;
        troop.followBuildingById(this._campId);
        // troop.runTo(campPosition[pos].x, troop._y);
        //cc.log(campPosition[pos].x + " " + campPosition[pos].y);
        //troop.runTo(campPosition[pos].x , campPosition[pos].y );
    },
    increaseNumber:function(){
        this._number++;
        this._totalTime += this._trainTime;
        this._space += this.getHousingSpaceConfig();
        this.displayNumber();
    },
    decreaseNumber:function(){
        this._number--;
        this._totalTime = this._trainTime * this._number;
        this._trainTimeTmp = this._trainTime;
        this._space -= this.getHousingSpaceConfig();
        this.displayNumber();
        if (this._number == 0){
            this.removeAllChildren();
        }
    },
    displayNumber:function(){
        var label = "x" + this._number;
        this._label.setString(label);
    }
});

var TrainGUI = cc.Layer.extend({
    _trainingTroop: 0,
    _barrackNumber: 1,
    _id: 1,
    _level: 1,
    _node: null,
    _troopTypeList: [
        res.troop.arm1,
        res.troop.arm2,
        res.troop.arm4,
        res.troop.arm6
    ],
    _queueDisplay: null,
    _queuePos: [{x: 503, y: 355}, {x: 403, y: 355}, {x: 333, y: 355}, {x: 263, y: 355}],
    _troopQueue: [],
    _totalTrainTime: 0,
    _totalTrainTimeLabel: null,
    _progress: null,
    _timeRemaining: null,
    _queueLength: null,
    _infoPopup: null,
    // _totalSpace: null,
    _config: null,
    _instantButton: null,
    ctor:function(id, level, barrackNumber){
        this._super();
        this._id = id;
        this._level = level;
        this._barrackNumber = barrackNumber;
        this._infoPopup = new TroopInfoPopup();
        this.addChild(this._infoPopup);
        // this._totalSpace = totalSpace;
        this.init();
        gv.trainManager.setTrainStatus(false);
        this.scheduleUpdate();
    },
    init:function(){
        // this.removeAllChildren();
        var self = this;
        //load the scene
        this._node = new gv.PopupUI(res.trainTroop.ui);

        //load title
        this._config = gv.dataWrapper.getBuildingConfig("BAR_1", this._level);
        this._queueLength = this._config.queueLength;
        this.setTitle(0, self._queueLength);

        //load close button
        var closeButton = this._node.getElementByName("closeButton");
        closeButton = gv.animatedButton(closeButton, false, function(){
            self._node.close();
            //self.getParent()._node.close();
            // self.unscheduleUpdate();
        });

        //load previous button
        var previousButton = this._node.getElementByName("previousButton");
        previousButton = gv.animatedButton(previousButton, false, function(){
            var prev = gv.trainManager.getBarrack(self._barrackNumber - 2);
            if (prev){
                //self._node.close();
                //prev.openTrainGUI();
                prev._node.appear();
                self._node.disappear();
            }
            //self.getParent()._node.close();
            // self.unscheduleUpdate();
        });

        //load next button
        var nextButton = this._node.getElementByName("nextButton");
        nextButton = gv.animatedButton(nextButton, false, function(){
            var next = gv.trainManager.getBarrack(self._barrackNumber);
            if (next){
                //self._node.close();
                //next.openTrainGUI();
                next._node.appear();
                self._node.disappear();
            }
            //self.getParent()._node.close();
            // self.unscheduleUpdate();
        });


        //load troop button
        var troopTypeListLength = this._troopTypeList.length;
        for (var i = 0; i < troopTypeListLength; i++){
            var slotName = self._troopTypeList[i];
            self.initTroopBtn(slotName);
        }

        //load queue
        this._queueDisplay = this._node.getElementByName("queue");
        //load instant button
        this._instantButton = this._queueDisplay.getChildByName("instant");
        this._instantButton = gv.animatedButton(this._instantButton, false, function(){
            //cc.log("done now");

            var troop = self._troopQueue[0];
            var listCamp = gv.objectManager.getListObjectByType(res.MapUI.buildings.type.ArmyCamp.name);
            var campIndex = Math.floor(Math.random() * listCamp.length);
            var armyCampId = listCamp[campIndex].getId();
            var timestamp = Math.floor(gv.timeUtils.getCurrentTimeMillis()/ 1000);
            //cc.log("time stamp " + timestamp);
            testnetwork.connector.sendSkipTroop(self._id, armyCampId, timestamp);
            testnetwork.connector.sendResource();
            self.skipTroop(armyCampId);
        });
        this._queueDisplay.setVisible(false);

        //load total train time label
        this._totalTrainTimeLabel = this._queueDisplay.getChildByName("finishTime");
        this._totalTrainTimeLabel.setString(gv.normalizeTime(self._totalTrainTime));

        var trainBar = this._queueDisplay.getChildByName("trainBar");
        this._progress = trainBar.getChildByName("loadingBar");
        this._timeRemaining = trainBar.getChildByName("timeRemaining");

        this.addChild(this._node);
        this._node.setVisible(false);
    },
    initTroopBtn:function(name){
        var self = this;
        var slot = this._node.getElementByName(name);
        var troopButton = slot.getChildByName(name);

        troopButton = gv.animatedButton(troopButton, false, function(){
            testnetwork.connector.sendTrainTroop(name, self._id);
            self.addTroopByName(name);
        });


        //info button
        var infoButton = slot.getChildByName("infoButton");
        infoButton = gv.animatedButton(infoButton, false, function(){
            self._infoPopup.openInfo(name, 1);
        });

        // comment for testing - do not delete
        var barrackLevelRequired = gv.dataWrapper.getTroopBaseConfig(name).barracksLevelRequired;
        if (this._level < barrackLevelRequired)
            this.disableButton(troopButton, barrackLevelRequired);
        else this.enableButton(troopButton);

    },
    skipTroop: function (campId){
        var troop = this._troopQueue[0];
        if (troop){
            troop.addTroopToMap(troop.getName(), campId);
            gv.troopManager.addTotalTroop(troop.getName());
            troop.decreaseNumber();
        }
    },
    addTroopByName: function(name){
        var self = this;
        var troopInQueue = false;
        this._troopQueue.forEach(function(troop){
            if (troop.getName() === name){
                troop.increaseNumber();
                self._totalTrainTime += troop.getTotalTrainTime();
                // cc.log(troop.getNumber());
                troopInQueue = true;
            }
        });
        if (!troopInQueue) {
            var pos = gv.objectManager.getObjectIsoPositionById(self._id);
            // cc.log(pos.x + " " + pos.y);
            var troop = new TroopIcon(name, this._id, pos.x, pos.y);
            self._troopQueue.push(troop);
            self._node._node.addChild(troop);
            var index = self._troopQueue.length - 1;
            troop.setPosition(cc.p(self._queuePos[index].x, self._queuePos[index].y));
            self._totalTrainTime += troop.getTotalTrainTime();
        }
        this._queueDisplay.setVisible(true);
        this._totalTrainTimeLabel.setString(gv.normalizeTime(self._totalTrainTime));
    },
    addTroopToBarrack: function(troops, timestamp){
        var self = this;
        var currentTimestamp = Math.floor(gv.timeUtils.getCurrentTimeMillis() / 1000);
        var remainingTime = currentTimestamp - timestamp;


        for (var i = 0; i < troops.length; i++){

            var pos = gv.objectManager.getObjectIsoPositionById(self._id);

            var troop = new TroopIcon(troops[i].type, this._id, pos.x, pos.y);
            self._troopQueue.push(troop);
            self._node._node.addChild(troop);
            var index = self._troopQueue.length - 1;
            troop.setPosition(cc.p(self._queuePos[index].x, self._queuePos[index].y));

            if (i == 0){
                var timeLength = gv.dataWrapper.getTroopBaseConfig(troops[i].type).trainingTime;
                if (remainingTime > timeLength) remainingTime = 0;
                troop.setTrainTimeTmp(remainingTime);
                self._totalTrainTime += remainingTime;
            } else {
                //self._totalTrainTime += troop.getTrainTime();
            }

            for (var j = 1; j < troops[i].amount; j ++){
                troop.increaseNumber();
                //self._totalTrainTime += troop.getTrainTime();
            }
            //self._totalTrainTime = troop.getTotalTrainTime();
        }
        if (troops.length > 0){
            this._queueDisplay.setVisible(true);
            this._totalTrainTimeLabel.setString(gv.normalizeTime(self._totalTrainTime));
        }
    },
    updateLevel: function(level){
        this._level = level;
        this.init();
    },
    setTitle:function(housingSpace, limit){
        var background = this._node.getElementByName("background");
        var title = background.getChildByName("title");
        var string = "Nhà lính " + this._barrackNumber + " (" +  housingSpace + "/" + limit + ")";
        title.setString(string);
    },
    openTrainGUI:function(){
        this._node.setVisible(true);
        this._node.open();
    },
    disableButton:function(button, notEnoughBarrackLevel){
        button.setEnabled(false);
        button.getChildren().forEach(function(child){
            child.setGLProgramState(cc.GLProgramState.getOrCreateWithGLProgramName("ShaderUIGrayScale"));
        });
        var costBar = button.getChildByName("costBar");
        var notEnoughLevelRequiredDisplay = button.getChildByName("notEnoughLevelRequired");
        if (notEnoughBarrackLevel > 0) {
            costBar.setVisible(false);
            notEnoughLevelRequiredDisplay.setVisible(true);
            var warningString = notEnoughLevelRequiredDisplay.getChildByName("levelText");
            var warningContent = "Nhà lính cấp " + notEnoughBarrackLevel;
            warningString.setString(warningContent);
        } else {
            gv.setGrayScaleToSprite(costBar);
        }
    },
    enableButton:function(button){
        button.setEnabled(true);
        button.getChildren().forEach(function(child){
            child.setGLProgramState(cc.GLProgramState.getOrCreateWithGLProgramName("ShaderPositionTextureColor_noMVP"));
        });
        var costBar = button.getChildByName("costBar");
        var notEnoughLevelRequiredDisplay = button.getChildByName("notEnoughLevelRequired");
        costBar.setVisible(true);
        notEnoughLevelRequiredDisplay.setVisible(false);
        //var costBar = button.getChildByName("costBar");
        gv.setRGBToSprite(costBar);
    },
    getTrainingTroop: function(){
        return this._trainingTroop;
    },
    update:function(dt){
        var self = this;
        this._troopQueue= this._troopQueue.filter(function(troop){
            return troop.getNumber() > 0;
        });
        if (this._troopQueue.length == 0)
        this._queueDisplay.setVisible(false);
        this._totalTrainTime = 0;
        var totalHousingSpace = 0;
        for (var i = 0; i < this._troopQueue.length; i++){
            var troop = this._troopQueue[i];
            totalHousingSpace += troop.getHousingSpace();
            if (i == 0){
                troop.decreaseTrainTime(dt);
                var percent = Math.floor((troop.getTrainTime() - troop._trainTimeTmp)/troop.getTrainTime() * 100);
                this._progress.setPercent(percent);
                if (gv.trainManager.getTrainStatus())
                    this._timeRemaining.setString(gv.normalizeTime(troop._trainTimeTmp));
                else{
                    if (troop._trainTimeTmp == 0) {
                        this._timeRemaining.setString("Dừng");
                    }
                    else {
                        this._timeRemaining.setString(gv.normalizeTime(troop._trainTimeTmp));
                    }
                }
            }
            self._totalTrainTime += troop.getTotalTrainTime();
            self._totalTrainTimeLabel.setString(gv.normalizeTime(self._totalTrainTime));
            troop.setPosition(cc.p(self._queuePos[i].x, self._queuePos[i].y));
        }
        //disable button
        var troopTypeListLength = this._troopTypeList.length;
        for (var i = 0; i < troopTypeListLength; i++) {
            var troopName = self._troopTypeList[i];
            var troopButton = self._node.getElementByName(troopName).getChildByName(troopName);
            var housingSpace = gv.dataWrapper.getTroopBaseConfig(troopName).housingSpace;
            var barrackLevelRequired = gv.dataWrapper.getTroopBaseConfig(troopName).barracksLevelRequired;
            var trainingElixir = gv.dataWrapper.getTroopConfig(troopName, 1).trainingElixir;
            var userElixir = gv.resourceManager.getTotalResource(res.ResourceType.elixir);
            if (trainingElixir > userElixir){
                self.disableButton(troopButton, 0);
            } else{
                if (totalHousingSpace + housingSpace > self._queueLength) {
                    self.disableButton(troopButton, 0);
                }
                else if(self._level >= barrackLevelRequired){
                    self.enableButton(troopButton);
                }
            }
        }
        //get totalTroop
        var totalTroopAfterTraining = gv.troopManager.getTotalTroop() + gv.trainManager.getTotalTrainingTroop();
        var maxTroop = gv.resourceManager.getTotalTroopCapacity();
        var totalTroopTitle = this._queueDisplay.getChildByName("totalTroop");
        totalTroopTitle.setString(totalTroopAfterTraining + "/" + maxTroop);

        //change training status
        var currentTroopOnMap = gv.troopManager.getTotalTroop();
        if (currentTroopOnMap >= maxTroop)
            gv.trainManager.setTrainStatus(false);
        else gv.trainManager.setTrainStatus(true);

        //disable skip button
        if(!gv.trainManager.getTrainStatus()){
            gv.disableButton(this._instantButton);
        } else {
            gv.enableButton(this._instantButton);
        }
        this._trainingTroop = totalHousingSpace;
        this.setTitle(totalHousingSpace, this._queueLength);
    }
});