/**
 * Created by Fersher_LOCAL on 7/20/2020.
 */


var ArcherTower = DefenceBuilding.extend({
    ctor: function(obj){
        this._super(obj);
    },

    initSprite: function() {
        this._super();
        this.getIdleSprite().setAnchorPoint(cc.p(0.5, -0.28));
        this.getAnimatedSprite().setAnchorPoint(cc.p(0.5, 0.2));
    },

    getAttackLen: function() {
        return res.MapUI.buildings.type.ArcherTower.attackLen;
    },

    getAnimatedPathList: function() {
        return res.MapUI.buildings.type.ArcherTower.animated;
    },

    getMaxResLevel: function() {
        return 9;
    },

    getAcronym: function() {
        return res.MapUI.buildings.type.ArcherTower.name;
    },

    getInfo: function() {
        return "Đây là chòi canh, nơi các cung thủ của chúng ta canh gác ngày đêm, họ không bỏ qua bất kỳ thứ gì chuyển động, dù chỉ là một con ruồi";
    },

    getNameString: function() {
        return "Chòi canh";
    },

    getDefenceType: function() {
        return res.BattleUI.defenceType.archerTower;
    }
    
});

