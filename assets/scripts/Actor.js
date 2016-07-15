var Types = require('Types');
var Utils = require('Utils');
var ActorPlayingState = Types.ActorPlayingState;

cc.Class({
    extends: cc.Component,

    properties: {
        // 所有明牌
        cards: {
            default: [],
            serializable: false,
            visible: false
        },
        // 暗牌，demo 暂存
        holeCard: {
            default: [],
            serializable: false,
            visible: false
        },

        // 手上最接近 21 点的点数（有可能超过 21 点）
        bestPoint: {
            get: function () {
                var minMax = Utils.getMinMaxPoint(this.cards);
                return minMax.max;
                // return this.cards.count;
            }
        },

        // 牌型，不考虑是否爆牌
        hand: {
            get: function () {
                var count = this.cards.length;
                if (this.holeCard) {
                    ++count;
                }
                if (count >= 5) {
                    return Types.Hand.FiveCard;
                }
                if (count === 2 && this.bestPoint === 21) {
                    return Types.Hand.BlackJack;
                }
                return Types.Hand.Normal;
            }
        },

        canReport: {
            get: function () {
                return this.hand !== Types.Hand.Normal;
            },
            visible: false
        },

        renderer: {
            default: null,
            type: cc.Node
        },
        state: {
            default: ActorPlayingState.Normal,
            notify: function (oldState) {
                if (this.state !== oldState) {
                    this.renderer.updateState();
                }
            },
            type: ActorPlayingState,
            serializable: false,
        }
    },

    init: function () {
        this.ready = true;
        this.renderer = this.getComponent('ActorRenderer');
    },

    addCard: function (card) {
        this.cards.push(card);
        this.renderer.onDeal(card, true);

        // var cards = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
        // var cards = this.cards;
        
        // if (Utils.isBust(cards)) {
        //     this.state = ActorPlayingState.Bust;
        // }
    },
    
    showCard: function(){
      this.renderer.showCards();
    },
    
    showCards1: function(){
      this.renderer.showCards1();  
    },
    
    showCards2: function(){
        this.renderer.showCards2();
    },
    
    showCards3: function(){
        this.renderer.showCards3();
    },
    
    addHoleCard: function (card) {
        this.holeCard.push(card);
        this.renderer.onDeal1(card, false);
    },
    
    addHoleCard2: function(card){
        this.holeCard.push(card);
        this.renderer.onDeal2(card,false);
    },
    
    addHoleCard3: function(card){
        this.holeCard.push(card);
        this.renderer.onDeal3(card,false);
    },
    
    addThreeCard:function(card){
        this.cards.push(card);
       this.renderer.combineCard(card,false);  
    },

    stand: function () {
        this.state = ActorPlayingState.Stand;
    },

    upDataPostion:function(){
      this.renderer.upDataInfoPosition();  
    },

    revealHoldCard: function () {
        if (this.holeCard) {
            this.cards.unshift(this.holeCard);
            this.holeCard = null;
            this.renderer.onRevealHoldCard();
        }
    },
    
    putCard:function(){
      this.renderer.putCards();
    },
    
    putCard2: function(result){
        this.renderer.putCards2(result);
    },

    // revealNormalCard: function() {
    //     this.onRevealNormalCard();
    // },
    
    // showPutCard:function(){
    //   this.renderer.showPutCard();
    // },

    report: function () {
        this.state = ActorPlayingState.Report;
    },
    
    willPutCards: function(card){
        this.renderer.addPutCard(card);
    },
    
    release: function(card){
        this.renderer.release(card);
    },
    
    reset: function () {
        this.cards = [];
        this.holeCard = null;
        this.reported = false;
        this.state = ActorPlayingState.Normal;
        this.renderer.onReset();
    }
});
