var ScreenLogin = cc.Layer.extend({

    txt: null,
    progressBar: null,

    localStorage : cc.sys.localStorage,
    key : "userID",

    ctor:function() {
        this.name = "Login";
        this._super();

        gv.screen_login = this;

        var loginScene = ccs.load(res.login, "res/");
        gv.scaleLayerByVisibleSize(loginScene.node);
        
        this.addChild(loginScene.node);

        this.progressBar = loginScene.node.getChildren()[1];
        this.progressBar.setVisible(false);
        this.setProgressBarPercent(0);

        this.txt = loginScene.node.getChildren()[2].getChildren()[0];

        var btn = loginScene.node.getChildren()[3];
        gv.animatedButton(btn, false, this.onSelectLogin.bind(this));
        

        if (this.localStorage.getItem(this.key) != null)
            this.txt.string = this.localStorage.getItem(this.key);
        else
            this.txt.string = "";
    },

    setProgressBarPercent:function(percent) {
        this.progressBar.getChildren()[0].setPercent(percent);
    },


    onSelectLogin:function(sender)
    {
        if (parseInt(this.txt.string))
        {
            this.localStorage.setItem(this.key, this.txt.string);
            gv.CONSTANT.USERID = parseInt(this.txt.string);
            this.progressBar.setVisible(true);
            gv.gameClient.connect();
        }
    },

    onConnectSuccess:function()
    {
        cc.log("Connect Success!");
    },

    onConnectFail:function(log)
    {
        cc.log(log);
    },

    onFinishLogin:function()
    {
        cc.log("Login Finish!");
        gv.viewMainScreen();
    },

    showMap:function(mapInfo)
    {
        for( var i = 0; i < mapInfo.mapW; i++) {
            var s = '';
            for (var j = 0; j < mapInfo.mapH; j++) {
                if (JSON.stringify(mapInfo.mapGrid[i][j]).length == 1)
                    s = s + "  " + JSON.stringify(mapInfo.mapGrid[i][j]);
                if (JSON.stringify(mapInfo.mapGrid[i][j]).length == 2)
                    s = s + " " + JSON.stringify(mapInfo.mapGrid[i][j]);
            }
            cc.log(s);
        }
    }
})