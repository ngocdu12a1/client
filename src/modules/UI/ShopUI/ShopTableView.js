var CustomTableViewCell = cc.TableViewCell.extend({
    draw:function (ctx) {
        this._super(ctx);
    }
});

var ShopTableView = cc.Layer.extend({
    name: null,
    listLength: null,
    nameList: [],
    gold: 0,
    elixir: 0,
    coin: 0,
    ctor:function(name, gold, elixir, coin){
        this._super();
        this.name = name;
        this.gold = gold;
        this.elixir = elixir;
        this.coin = coin;
        var self = this;
        switch (this.name){
            case res.shopFrameName.buyRes:
                self.nameList = ["elixir_10", "elixir_50", "elixir_100", "gold_10", "gold_50", "gold_100"];
                break;
            case res.shopFrameName.res:
                self.nameList = [[res.code.BDH_1, res.name.BDH_1], [res.code.RES_1, res.name.RES_1], [res.code.RES_2, res.name.RES_2], [res.code.RES_3, res.name.RES_3],
                                 [res.code.STO_1, res.name.STO_1], [res.code.STO_2, res.name.STO_2], [res.code.STO_3, res.name.STO_3]];
                break;
            case res.shopFrameName.dc:
                self.nameList = ["DEC_1", "DEC_2", "DEC_3", "DEC_4", "DEC_5", "DEC_6"];
                break;
            case res.shopFrameName.shield:
                self.nameList = ["SHEILD_1", "SHEILD_2", "SHEILD_3"];
                break;
            case res.shopFrameName.army:
                self.nameList = [[res.code.AMC_1, res.name.AMC_1], [res.code.BAR_1, res.name.BAR_1], [res.code.LAB_1, res.name.LAB_1]];
                break;
            case res.shopFrameName.defense:
                self.nameList = [[res.code.WAL_1, res.name.WAL_1], [res.code.DEF_1, res.name.DEF_1], [res.code.DEF_2, res.name.DEF_2], [res.code.DEF_3, res.name.DEF_3],
                                [res.code.TRA_1, res.name.TRA_1], [res.code.TRA_2, res.name.TRA_2], [res.code.TRA_3, res.name.TRA_3], [res.code.TRA_4, res.name.TRA_4],
                                [res.code.DEF_5, res.name.DEF_5], [res.code.DEF_7, res.name.DEF_7], [res.code.DEF_4, res.name.DEF_4],
                                [res.code.DEF_8, res.name.DEF_8], [res.code.DEF_9, res.name.DEF_9], [res.code.DEF_12, res.name.DEF_12],];
                break;
            
        }
        this.listLength = this.nameList.length;
        this.init();
    },

    init:function () {
        var tableView = new cc.TableView(this, cc.size(770, 320));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        tableView.setDelegate(this);
        this.addChild(tableView);
        tableView.reloadData();
    },

    tableCellTouched:function (table, cell) {
        self = this;
        //cc.log(self.nameList[cell.getIdx()]);
    },

    tableCellSizeForIndex:function (table, idx) {
        return cc.size(230, 325);
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();
        var shopItem;
        if (!cell) {
            cell = new CustomTableViewCell();
            shopItem = new ShopItem();
            shopItem.anchorX = 0.5;
            shopItem.anchorY = 0.5;
            shopItem.x = 110;
            shopItem.y = shopItem.height/3.5;
            shopItem.setName("shopItem");
            this.setInfo(shopItem, idx);
            cell.addChild(shopItem);
        } else {
            shopItem = cell.getChildByName("shopItem");
            this.setInfo(shopItem, idx);
        }
        return cell;
    },

    setInfo:function(shopItem, idx){
        var self = this;
        //get title
        var title = shopItem.getNode().getChildByName("title");
        title.setString(" ");

        //get town hall level
        var townHallLevel = gv.resourceManager.getTownHallLevel();
        //reset values
        var node = shopItem.getNode().getChildByName("item");
        var buildTimeTitle = node.getChildByName("buildTime");
        var timeIcon = node.getChildByName("time");
        timeIcon.setVisible(true);

        var label = node.getChildByName("unlockedLabel");
        if (label){
            node.removeChildByName("unlockedLabel");
        }

        var amountTitle = node.getChildByName("amount");
        if (amountTitle){
            amountTitle.setString(" ");
        }

        var infoButton = node.getChildByName("shop_infoButton");
        infoButton = gv.animatedButton(infoButton, false, function(){
        });


        gv.setRGBToSprite(node);

        //set title
        title.setString(this.nameList[idx][1]);

        //sprite
        var fullFilePath = res.shop.itemIcon + this.nameList[idx][0] + ".png";
        var itemIcon = node.getChildByName("itemIcon");
        if (itemIcon){
            node.removeChildByName("itemIcon");
        }        
        itemIcon = new cc.Sprite(fullFilePath);
        itemIcon.setName("itemIcon");
        node.addChild(itemIcon);
        itemIcon.setPosition(cc.p(node.width/2, node.height/2));

        //set button
        var buyButton = node.getChildByName("buyButton");
        buyButton = gv.animatedButton(buyButton, false, function(){
            // cc.log("get " + self.nameList[idx]);
            self.getParent().getParent().getParent().closeAll();
            gv.requestManager.handleBuildBuildingRequest(self.nameList[idx][0]);
        })
        buyButton.setEnabled(true);
        
        var priceLabel = buyButton.getChildByName("price");
        priceLabel.setString(" ");
        priceLabel.color = new cc.color(255, 255, 255);
        var priceIcon = buyButton.getChildByName("priceIcon");
        if(priceIcon){
            priceIcon.removeFromParent();
        }

        //get config
        try {   
            try {
                var conf = gv.dataWrapper.getBuildingConfig(this.nameList[idx][0], townHallLevel);
            } catch (e){
                gv.setGrayScaleToSprite(node);
                buyButton.setEnabled(false);
                gv.setGrayScaleToSprite(buyButton.getChildByName("priceIcon"));
            }

            if (conf == undefined){
                gv.setGrayScaleToSprite(node);
                buyButton.setEnabled(false);
                gv.setGrayScaleToSprite(buyButton.getChildByName("priceIcon"));
            }

            infoButton = gv.animatedButton(infoButton, false, function(){
                var infoPopup = new InfoPopup();
                self.getParent().getParent().addChild(infoPopup);
                infoPopup.openPopup(self.nameList[idx][0], 1, null);
            });

            if (this.nameList[idx][0] == res.MapUI.buildings.type.BuilderHut.name) {
                var buildingQuantity = gv.resourceManager.getBuildingQuantity(res.MapUI.buildings.type.BuilderHut.name);
                conf = gv.dataWrapper.getBuildingConfig(this.nameList[idx][0], buildingQuantity + 1);
                if(buildingQuantity >= res.maximumBuildingQuantity){
                    gv.setGrayScaleToSprite(node);
                    buyButton.setEnabled(false);
                    //gv.setGrayScaleToSprite(buyButton.getChildByName("priceIcon"));
                }
                else {
                    //var priceConf = gv.dataWrapper.getBuildingConfig(this.nameList[idx][0], 1);
                    var coin = conf.coin;
                    this.setPrice(buyButton, priceLabel, coin, res.shop.g, this.coin);
                }
            }
            else if (conf){
                //set level required
                var townHallLevelRequired = conf.townHallLevelRequired;
                
                //set price

                var priceConf = gv.dataWrapper.getBuildingConfig(this.nameList[idx][0], 1);

                var gold = priceConf.gold;
                var elixir = priceConf.elixir;
                var coin = priceConf.coin;
                if (gold > 0){
                    this.setPrice(buyButton, priceLabel, gold, res.shop.goldIcon, this.gold);
                } else if (elixir > 0) {
                    this.setPrice(buyButton, priceLabel, elixir, res.shop.elixirIcon, this.elixir);
                } else if (coin > 0) {
                    this.setPrice(buyButton, priceLabel, coin, res.shop.g, this.coin);
                } else {
                    priceLabel.setString("Miễn phí");
                }

                if (townHallLevel < townHallLevelRequired){
                    //set grayscale
                    gv.setGrayScaleToSprite(node);
                    buyButton.setEnabled(false);
                    try {
                        gv.setGrayScaleToSprite(buyButton.getChildByName("priceIcon"));
                    } catch (e){

                    }

                    //set label
                    var labelContent = "Yêu cầu nhà chính cấp " + townHallLevelRequired;
                    var label = new cc.LabelBMFont(labelContent, res.font.soji12);
                    label.setName("unlockedLabel");
                    label.color = new cc.color(255, 0, 0);
                    node.addChild(label);
                    label.setPosition(cc.p(node.width/2, node.height/4));

                    //set visible
                    timeIcon.setVisible(false);
                    buildTimeTitle.setString(" ");
                } else {
                    //set time
                    var buildTime = conf.buildTime;
                    buildTimeTitle.setString(gv.normalizeTime(buildTime));

                    //set limit
                    var townHallInfo = gv.dataWrapper.getBuildingConfig("TOW_1", townHallLevel);
                    var name = this.nameList[idx][0];
                    var limit = townHallInfo[name];
                    if (limit != undefined){
                        var current = gv.resourceManager.getBuildingQuantity(name);
                        var amount = current + "/" + limit;
                        amountTitle.setString(amount);
                        if (current >= limit){
                            gv.setGrayScaleToSprite(node);
                            buyButton.setEnabled(false);
                            gv.setGrayScaleToSprite(buyButton.getChildByName("priceIcon"));
                        } 
                    } else amountTitle.setString(" ");
                }
                
            } 
        } catch(e){
            // cc.log(e);
        }
    },

    setPrice:function(buyButton, label, price, spritePath, currentFund){
        label.setString(gv.normalizeNumber(price));
        var priceIcon = new cc.Sprite(spritePath);
        if (currentFund < price){
            // cc.log ("current: " + currentFund + " price: " + price );
            label.color = new cc.color(255, 0, 0);
        }
        buyButton.addChild(priceIcon);
        priceIcon.setName("priceIcon");
        priceIcon.anchorX = 1;
        priceIcon.setScale(0.6);
        priceIcon.setPosition(buyButton.width/1.2, buyButton.height/2);
    },

    numberOfCellsInTableView:function (table) {
        return this.listLength;
    },
});