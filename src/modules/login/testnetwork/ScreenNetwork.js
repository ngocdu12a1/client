/**
 * Created by GSN on 7/9/2015.
 */
var Direction =
{
    UP:1,
    DOWN:2,
    LEFT:3,
    RIGHT:4
};

var MAP_SIZE = 8;
var TILE_SIZE = 64;
var ScreenNetwork = cc.Layer.extend({
    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();

        var yBtn = size.height/3;
        this.nodeUI = new cc.Node();
        this.addChild(this.nodeUI);

        var btnLogin = gv.commonButton(200, 64, size.width/4, yBtn,"Login");
        this.nodeUI.addChild(btnLogin);
        btnLogin.addClickEventListener(this.onSelectLogin.bind(this));

        var btnDisconnect = gv.commonButton(200, 64, size.width/2, yBtn,"Disconnect");
        this.nodeUI.addChild(btnDisconnect);
        btnDisconnect.addClickEventListener(this.onSelectDisconnect.bind(this));

        var btnReconnect = gv.commonButton(200, 64, 3*size.width/4, yBtn,"Reconnect");
        this.nodeUI.addChild(btnReconnect);
        btnReconnect.addClickEventListener(this.onSelectReconnect.bind(this));

        this.lblLog = gv.commonText(fr.Localization.text("..."), size.width*0.5, size.height*0.05);
        this.addChild(this.lblLog);

        this.initGame();
    },
    initGame:function()
    {
        var size = cc.director.getVisibleSize();

        this._gameNode = new cc.Node();
        this._gameNode.setPosition(cc.p(size.width*0.5 - MAP_SIZE*TILE_SIZE/2, size.height*0.5 - MAP_SIZE*TILE_SIZE/2));
        this._gameNode.setVisible(false);
        this.addChild(this._gameNode);

        //
        this.tileImgs = [];
        for( var i = 0; i < MAP_SIZE; i++) {
            this.tileImgs[i] = [];
            for (var j = 0; j < MAP_SIZE; j++) {
                var tileSprite = new cc.Sprite('res/game/tile.png');
                tileSprite.setPosition(this.getPositionFromTilePos(i, j));
                this._gameNode.addChild(tileSprite);
                this.tileImgs[i][j] = tileSprite;
            }
        }
        //
        this.character = fr.createAnimationById(resAniId.chipu,this);
        //doi mau, yeu cau phai co file shader, nhung bone co ten bat dau tu color_ se bi doi mau
        this.character.setBaseColor(255,0,0);
        //chinh toc do play animation
        this.character.getAnimation().setTimeScale(0.5);
        this._gameNode.addChild(this.character);
        //play animation gotoAndPlay(animationName, fadeInTime, duration, playTimes)
        this.character.getAnimation().gotoAndPlay("idle_0_",-1);

        this.reset();

        this._gameController = new cc.Node();
        this._gameController.setPosition(cc.p(100, 100));
        this._gameController.setVisible(false);
        this.addChild(this._gameController);

        var btnReset = gv.commonButton(128, 64, 0, 164,"Reset");
        this._gameController.addChild(btnReset);
        btnReset.addClickEventListener(function()
        {
            testnetwork.connector.sendResetMap();
        }.bind(this));

        var btnLeft = gv.commonButton(64, 64, -64, 0,"<");
        this._gameController.addChild(btnLeft);
        btnLeft.addClickEventListener(function()
        {
            this.sendMove(this.character.tileX - 1, this.character.tileY);
        }.bind(this));

        var btnRight = gv.commonButton(64, 64, 64, 0,">");
        this._gameController.addChild(btnRight);
        btnRight.addClickEventListener(function()
        {
            this.sendMove(this.character.tileX + 1, this.character.tileY);
        }.bind(this));
        var btnUp = gv.commonButton(64, 64, 0, 64,"<");
        btnUp.setRotation(90);
        this._gameController.addChild(btnUp);
        btnUp.addClickEventListener(function()
        {
            this.sendMove(this.character.tileX, this.character.tileY + 1);
        }.bind(this));
        var btnDown = gv.commonButton(64, 64, 0, -64,">");
        btnDown.setRotation(90);
        this._gameController.addChild(btnDown);
        btnDown.addClickEventListener(function()
        {
            this.sendMove(this.character.tileX, this.character.tileY  -1);
        }.bind(this));

    },
    reset:function()
    {
        for( var i = 0; i < MAP_SIZE; i++) {
            for (var j = 0; j < MAP_SIZE; j++) {
                this.setTileAvailable(i, j);
            }
        }
        this.character.setPosition(this.getPositionFromTilePos(0,0));
        this.setTileUnavailable(0,0);
        this.character.tileX = 0;
        this.character.tileY = 0;
    },
    setTileUnavailable:function(x, y)
    {
        this.tileImgs[x][y].setColor(cc.color.GRAY);
    },
    setTileAvailable:function(x, y)
    {
        this.tileImgs[x][y].setColor(cc.color.WHITE);
    },
    getPositionFromTilePos:function(x, y)
    {
        return cc.p(TILE_SIZE/2 + x*TILE_SIZE, TILE_SIZE/2 + y*TILE_SIZE);
    },
    onSelectBack:function(sender)
    {
        fr.view(ScreenMenu);
    },
    onSelectLogin:function(sender)
    {
        this.lblLog.setString("Start Connect!");
        gv.gameClient.connect();
    },
    onSelectDisconnect:function(sender)
    {
        this.lblLog.setString("Coming soon!");
    },
    onSelectReconnect:function(sender)
    {
        this.lblLog.setString("Coming soon!");
    },
    onConnectSuccess:function()
    {
        this.lblLog.setString("Connect Success!");
    },
    onConnectFail:function(text)
    {
        this.lblLog.setString("Connect fail: " + text);
    },
    onFinishLogin:function()
    {
        this._gameController.setVisible(true);
        this._gameNode.setVisible(true);
        this.nodeUI.setVisible(false);
    },
    updateMove:function(isCanMove, x, y)
    {
        if(isCanMove)
        {
            this.characterMoveTo(x, y);
        }else
        {
            this.lblLog.setString("Can't Move!");
        }
    },
    characterMoveTo:function(x, y)
    {
        cc.log("characterMoveTo", x, y);
        this._isMoving = true;
        var callback = cc.callFunc(this.characterMoveFinished, this);
        var move = cc.moveTo(0.2, this.getPositionFromTilePos(x, y)).easing(cc.easeSineIn());
        var sequence = cc.sequence(move, callback);
        this.character.runAction(sequence);
        this.character.tileX = x;
        this.character.tileY = y;
    },
    characterMoveFinished:function()
    {
        this._isMoving = false;
        this.setTileUnavailable(this.character.tileX, this.character.tileY);
    },
    updateMap:function(mapInfo)
    {
        for( var i = 0; i < MAP_SIZE; i++) {
            for (var j = 0; j < MAP_SIZE; j++) {
                if(mapInfo.mapState[i][j])
                {
                    this.setTileUnavailable(i,j);
                }else
                {
                    this.setTileAvailable(i, j);
                }
            }
        }
        this.character.setPosition(this.getPositionFromTilePos(mapInfo.x,mapInfo.y));
        this.character.tileX = mapInfo.x;
        this.character.tileY = mapInfo.y;
    },
    sendMove:function(x, y)
    {
        if(this._isMoving)
        {
            this.lblLog.setString("Moving!");
            return;
        }
        testnetwork.connector.sendMove(x, y);
    }

});