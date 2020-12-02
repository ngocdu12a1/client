/**
 * Created by KienVN on 9/29/2017.
 */
const centerX = cc.winSize.width/2;
const centerY = cc.winSize.height/2;

var res = res||{};
res.base = {};
res.shop = {};
res.base.button = {};
res.shop.button = {};
res.shopFrameName = {};
res.trainTroop = {};
res.troop = {};
res.font = {};
res.code = {};
res.name = {};
//FONT
res.font.soji20 = "fonts/soji_20.fnt";
res.font.soji16 = "fonts/soji_16.fnt";
res.font.soji12 = "fonts/soji_12.fnt";
//IMG
res.base.img_btn_disable =  "Default/Button_Disable.png";
res.base.img_btn_press = "Default/Button_Disable.png";
res.base.img_btn_normal = "Default/Button_Normal.png";

res.lobby = "game/shopGUI/Lobby.json";
res.shop.ui = "game/shopGUI/ShopGUI.json";
res.shopFrame = "game/shopGUI/ShopFrame.json";
res.shop.item = "game/shopGUI/ShopItem.json";
res.trainTroop.ui = "game/trainTroopGUI/TrainGUI.json";
res.trainTroop.manager = "game/trainTroopGUI/TrainManager.json";

res.shop.itemIcon = "res/game/shopGUI/items/";

//login
res.login = "game/LoginScene/LoginScene.json";

//main gui
res.game_lobby = "game/Lobby.json";

//button name
res.base.button.close = "closeButton";
res.base.button.back = "backButton";
res.shop.button.icon ="shopButton";
res.shop.button.buyRes = "shop_buyResButton";
res.shop.button.res = "shop_resButton";
res.shop.button.dc = "shop_dcButton";
res.shop.button.shield = "shop_shieldButton";
res.shop.button.defense = "shop_defenseButton";
res.shop.button.army = "shop_armyButton";

//shop
res.shop.goldIcon = "res/game/shopGUI/icon_gold_bar.png";
res.shop.elixirIcon = "res/game/shopGUI/icon_elixir_bar.png";
res.shop.g = "res/game/shopGUI/g.png";
res.maximumBuildingQuantity = 5;

//shopFrame name
res.shopFrameName.buyRes = "buyRes";
res.shopFrameName.res = "res";
res.shopFrameName.dc = "dc";
res.shopFrameName.shield = "shield";
res.shopFrameName.defense = "defense";
res.shopFrameName.army = "army";

//shop item code
res.code.BDH_1 = "BDH_1";
res.code.RES_1 = "RES_1";
res.code.RES_2 = "RES_2";
res.code.RES_3 = "RES_3";
res.code.STO_1 = "STO_1";
res.code.STO_2 = "STO_2";
res.code.STO_3 = "STO_3";

res.code.AMC_1 = "AMC_1";
res.code.BAR_1 = "BAR_1";
res.code.LAB_1 = "LAB_1";

res.code.WAL_1 = "WAL_1";
res.code.DEF_1 = "DEF_1";
res.code.DEF_2 = "DEF_2";
res.code.DEF_3 = "DEF_3";
res.code.DEF_4 = "DEF_4";
res.code.DEF_5 = "DEF_5";
res.code.DEF_7 = "DEF_7";
res.code.DEF_8 = "DEF_8";
res.code.DEF_9 = "DEF_9";
res.code.DEF_12 = "DEF_12";
res.code.TRA_1 = "TRA_1";
res.code.TRA_2 = "TRA_2";
res.code.TRA_3 = "TRA_3";
res.code.TRA_4 = "TRA_4";

// //shop item name
res.name.BDH_1 = "Nhà thợ xây";
res.name.RES_1 = "Mỏ vàng";
res.name.RES_2 = "Mỏ dầu";
res.name.RES_3 = "Mỏ dầu đen";
res.name.STO_1 = "Kho vàng";
res.name.STO_2 = "Kho dầu";
res.name.STO_3 = "Kho dầu đen";

res.name.AMC_1 = "Trại lính";
res.name.BAR_1 = "Nhà lính";
res.name.LAB_1 = "Nhà nghiên cứu";

res.name.WAL_1 = "Tường";
res.name.DEF_1 = "Pháo";
res.name.DEF_2 = "Chòi cung";
res.name.DEF_3 = "Máy bắn đá";
res.name.DEF_4 = "Chòi phép";
res.name.DEF_5 = "Pháo cao xạ";
res.name.DEF_7 = "Thần tiễn";
res.name.DEF_8 = "Thấp sấm sét";
res.name.DEF_9 = "Tháp ánh sáng";
res.name.DEF_12 = "Pháo rồng";
res.name.TRA_1 = "Bom";
res.name.TRA_2 = "Nắm đấm";
res.name.TRA_3 = "Kho thuốc súng";
res.name.TRA_4 = "Mìn phòng không";

//troop name
res.troop.arm1 = "ARM_1";
res.troop.arm2 = "ARM_2";
res.troop.arm4 = "ARM_4";
res.troop.arm6 = "ARM_6";
res.troop.path = "res/game/trainTroopGUI/small_icons/";
res.troop.pathBattle = "res/game/BattleGUI/troopIcon/";
res.troop.smallIconBackground = "game/trainTroopGUI/small_icons/slot.png";
res.troop.cancel = "game/trainTroopGUI/small_icons/cancel.png";
res.troop.lobbyIcon = "game/trainTroopGUI/icon.png";
res.troop.animation = "game/Troops/";
res.troop.infoJSON = "game/trainTroopGUI/info_popup/InfoPopup.json";
res.troop.iconPrefix = "res/game/trainTroopGUI/info_popup/";
res.troop.healthBarBackground = "res/game/Troops/black_hp_bar.png";
res.troop.healthBar = "res/game/Troops/ally_heal_bar.png";