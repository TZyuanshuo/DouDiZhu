cc.Class({
    extends: cc.Component,

    properties: {
        // nodes
        point: cc.Label,
        suit: cc.Sprite,
        mainPic: cc.Sprite,
        cardBG: cc.Sprite,
        tag:cc.Label,
        suitNum:cc.Label,
        val:cc.Label,
        // resources
        redTextColor: cc.Color.WHITE,
        blackTextColor: cc.Color.WHITE,
        texFrontBG: cc.SpriteFrame,
        texBackBG: cc.SpriteFrame,
        texFaces: {
            default: [],
            type: cc.SpriteFrame
        },
        texSuitBig: {
            default: [],
            type: cc.SpriteFrame
        },
        texSuitSmall: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    init: function (card,num) {
        var isFaceCard = card.point > 8 && card.point < 12;
        var isJoker = card.point > 13;
        if (isFaceCard) {
            this.mainPic.spriteFrame = this.texFaces[card.point - 8 - 1];
        }
        else {
            this.mainPic.spriteFrame = this.texSuitBig[card.suit - 1];
        }

        // for jsb
        this.point.string = card.pointName;

        if (card.isRedSuit) {
            this.point.node.color = this.redTextColor;
        }
        else {
            this.point.node.color = this.blackTextColor;
        }
        if(isJoker){
           this.suit.spriteFrame = null;
           this.point.string = null;
       }
        else{
            this.suit.spriteFrame = this.texSuitSmall[card.suit - 1];
        }
        
        this.tag.string = num;
        this.suitNum.string = card.suit;
        // if(card.point>=1 && card.point<=2 || card.point===k || card.point===KK ){
        //     this.val=card.point+13;
        // }else{
        //     this.val=card.point;
        // }
        this.val.string = card.point+2;
    },

    reveal: function (isFaceUp) {
        this.point.node.active = isFaceUp;
        this.suit.node.active = isFaceUp;
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
    },
});
