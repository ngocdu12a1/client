var fr = fr||{}

fr.view = function(Screen, transitionTime)
{
    var layer = new Screen();
    layer.setName("screen");
    var scene = new cc.Scene();
    scene.addChild(layer);
    if(!transitionTime)
    {
        transitionTime = 1.2;
    }
    cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
};
fr.getCurrentScreen = function()
{
    return cc.director.getRunningScene().getChildByName("screen");
};

fr.viewMultiples = function(screens, transitionTime){
    let scene = new cc.Scene();
    for (var i = 0; i < screens.length; i++){
        let layer = new screens[i];
        let layerName = "screen" + i;
        layer.setName(layerName);
        scene.addChild(layer);
    }
    if(!transitionTime)
    {
        transitionTime = 1.2;
    }
    cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
};

gv.viewMainScreen =  function() {
    gv.trainManager = new TrainManager();
    testnetwork.connector.sendGetTimestampRequest();
    gv.troopManager = new TroopManager();
    gv.objectManager = new ObjectManager();
    var screens = [MapUI, BuildingActionLayer, Lobby];
    fr.viewMultiples(screens);
};
