var Game = require('Game');
var Types = require('Types');
var Utils = require('Utils');
var ActorPlayingState = Types.ActorPlayingState;

cc.Class({
    extends: cc.Component,

    properties: {
        playerInfo: cc.Node,
        stakeOnTable: cc.Node,
        cardInfo: cc.Node,
        cardPrefab: cc.Prefab,
        anchorCards: cc.Node,
        spPlayerName: cc.Sprite,
        labelPlayerName: cc.Label,
        labelTotalStake: cc.Label,
        spPlayerPhoto: cc.Sprite,
        callCounter: cc.ProgressBar,
        labelStakeOnTable: cc.Label,
        spChips: {
            default: [],
            type: cc.Sprite
        },
        cardsArray: {
            default: [],
            type:cc.SpriteFrame
        },
        player1CardsArray:{
          default: [],
          type:cc.SpriteFrame
        },
        player2CardsArray:{
          default: [],
          type:cc.SpriteFrame
        },
        labelCardInfo: cc.Label,
        spCardInfo: cc.Sprite,
        animFX: cc.Node,
        cardSpace: 0
    },

    onLoad: function () {
    },

    init: function ( playerInfo, playerInfoPos, stakePos, turnDuration, switchSide ) {
        // actor
        this.actor = this.getComponent('Actor');

        // nodes
        this.isCounting = false;
        this.counterTimer = 0;
        this.turnDuration = turnDuration;

        this.playerInfo.position = playerInfoPos;
        this.stakeOnTable.position = stakePos;
        this.labelPlayerName.string = playerInfo.name;
        this.updateTotalStake(playerInfo.gold);
        var photoIdx = playerInfo.photoIdx % 5;
        // this.spPlayerPhoto.spriteFrame = Game.instance.assetMng.playerPhotos[photoIdx];
        // fx
        // this.animFX = this.animFX.getComponent('FXPlayer');
        // this.animFX.init();
        // this.animFX.show(false);
        
        this.cardInfo.active = false;

        // switch side
        if (switchSide) {
            this.spCardInfo.getComponent('SideSwitcher').switchSide();
            this.spPlayerName.getComponent('SideSwitcher').switchSide();
        }
    },

    update: function (dt) {
        if (this.isCounting) {
            this.callCounter.progress = this.counterTimer/this.turnDuration;
            this.counterTimer += dt;
            if (this.counterTimer >= this.turnDuration) {
                this.isCounting = false;
                this.callCounter.progress = 1;
            }
        }
    },

    initDealer: function () {
        // actor
        this.actor = this.getComponent('Actor');
        // fx
        this.animFX = this.animFX.getComponent('FXPlayer');
        this.animFX.init();
        this.animFX.show(false);
    },

    updateTotalStake: function (num) {
        this.labelTotalStake.string = '$' + num;
    },

    startCountdown: function() {
        if (this.callCounter) {
            this.isCounting = true;
            this.counterTimer = 0;
        }
    },

    resetCountdown: function() {
        if (this.callCounter) {
            this.isCounting = false;
            this.counterTimer = 0;
            this.callCounter.progress = 0;
        }
    },

    playBlackJackFX: function () {
        this.animFX.playFX('blackjack');
    },

    playBustFX: function () {
        this.animFX.playFX('bust');
    },

    onDeal: function (card, show) {
       
        this.cardsArray.push(card);

        this.cardsArray.sort(this.compare('point'));
    },
    
    onDeal1: function(card,show){
        this.player1CardsArray.push(card);
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.anchorCards.addChild(newCard.node);
            newCard.init(card);
            // newCard.tag=i;
            // cc.log('tag'+newCard.tag);
            newCard.reveal(show);
            var startPos = cc.p(0, 0);
            var index = this.actor.holeCard.length - 1;
            cc.log('count'+index);
            this.labelCardInfo.string = index;
            // var endPos = cc.p(30 * 18, 0);
            // newCard.node.setPosition(startPos);
            // var endPosX = endPos.x;
            // // newCard.cardInfo.setPosition(endPosX+50,0);

            // // var moveAction = cc.moveTo(0.5, endPos);
            // var callback = cc.callFunc(this._onDealEnd, this);
            // newCard.node.runAction(cc.sequence(moveAction, callback));
    },
    
    onDeal2: function(card,show){
        this.player2CardsArray.push(card);
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.anchorCards.addChild(newCard.node);
            newCard.init(card);
            // newCard.tag=i;
            // cc.log('tag'+newCard.tag);
            newCard.reveal(show);
            var startPos = cc.p(0, 0);
            var index = this.actor.holeCard.length - 1;
            cc.log('player2牌的多少'+index);
            this.labelCardInfo.string = index+1;
            var endPos = cc.p(30 * 2, 0);
            newCard.node.setPosition(startPos);
            var endPosX = endPos.x;
            this._updatePointPos(endPosX);

            // var moveAction = cc.moveTo(0.5, endPos);
            var callback = cc.callFunc(this._onDealEnd, this);
            // newCard.node.runAction(cc.sequence(moveAction, callback));
    },
    
    upDataInfoPosition: function(){
            var endPos = cc.p(30 * 2, 0);
            // newCard.node.setPosition(startPos);
            var endPosX = endPos.x;
            this._updatePointPos(endPosX);
    },
    
   compare: function(propertyName) { 
        return function (object1, object2) { 
            var value1 = object1[propertyName]; 
            var value2 = object2[propertyName]; 
            if (value2 < value1) { 
                return -1; 
            } 
            else if (value2 > value1) { 
                return 1; 
            } 
            else { 
                return 0; 
            } 
        } 
    },
    
    showCards: function(){
         
        for(var i=0;i<this.cardsArray.length;i++){
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.anchorCards.addChild(newCard.node);
            newCard.init(this.cardsArray[i]);
            newCard.tag=i;
            // cc.log('tag'+newCard.tag);
            newCard.reveal(true);
            var startPos = cc.p(0, 0);
            var index = this.actor.cards.length - 1;
            cc.log('牌的多少'+index);
            this.labelCardInfo.string = index+1;
            var endPos = cc.p(30 * i, 0);
            newCard.node.setPosition(startPos);
            var endPosX = endPos.x;
            // cc.log('移动距离'+endPosX);
            this._updatePointPos(endPosX);

            var moveAction = cc.moveTo(0.5, endPos);
            var callback = cc.callFunc(this._onDealEnd, this);
            newCard.node.runAction(cc.sequence(moveAction, callback));
        }
    },
    
    willPutCard: function(){
        
    },
    
    _onDealEnd: function(target) {
        this.resetCountdown();
        if(this.actor.state === ActorPlayingState.Normal) {
            this.startCountdown();
        }
        this.updatePoint();
        // this._updatePointPos(pointX);
    },

    onReset: function () {
        this.cardInfo.active = false;

        this.anchorCards.removeAllChildren();

        this._resetChips();
    },

    onRevealHoldCard: function () {
        var card = cc.find('cardPrefab', this.anchorCards).getComponent('Card');
        card.reveal(true);
        this.updateState();
    },

    updatePoint: function () {
        this.cardInfo.active = true;
        // this.labelCardInfo.string = this.actor.cards.length;

        switch (this.actor.hand) {
            case Types.Hand.BlackJack:
                this.animFX.show(true);
                this.animFX.playFX('blackjack');
                break;
            case Types.Hand.FiveCard:
                // TODO
                break;
        }
    },

    _updatePointPos: function (xPos) {
        this.cardInfo.setPosition(xPos + 100, 0);
    },

    showStakeChips: function(stake) {
        var chips = this.spChips;
        var count = 0;
        if (stake > 50000) {
            count = 5;
        } else if (stake > 25000) {
            count = 4;
        } else if (stake > 10000) {
            count = 3;
        } else if (stake > 5000) {
            count = 2;
        } else if (stake > 0) {
            count = 1;
        }
        for (var i = 0; i < count; ++i) {
            chips[i].enabled = true;
        }
    },

    _resetChips: function () {
        for (var i = 0; i < this.spChips.length; ++i) {
            this.spChips.enabled = false;
        }
    },

    updateState: function () {
        switch (this.actor.state) {
            case ActorPlayingState.Normal:
                this.cardInfo.active = true;
                this.spCardInfo.spriteFrame = Game.instance.assetMng.texCardInfo;
                this.updatePoint();
                break;
            case ActorPlayingState.Bust:
                var min = Utils.getMinMaxPoint(this.actor.cards).min;
                this.labelCardInfo.string = '爆牌(' + min + ')';
                this.spCardInfo.spriteFrame = Game.instance.assetMng.texBust;
                this.cardInfo.active = true;
                this.animFX.show(true);
                this.animFX.playFX('bust');
                this.resetCountdown();
                break;
            case ActorPlayingState.Stand:
                var max = Utils.getMinMaxPoint(this.actor.cards).max;
                this.labelCardInfo.string = '停牌(' + max + ')';
                this.spCardInfo.spriteFrame = Game.instance.assetMng.texCardInfo;
                this.resetCountdown();
                // this.updatePoint();
                break;
        }
    },
});
