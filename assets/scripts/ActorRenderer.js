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
        putCardNode: cc.Node,
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
            serializable: false,
            visible: false
        },
        newCardsArray:{
            default:[],
            serializable: false,
            visible: false
        },
        player1CardsArray:{
          default: [],
          type:cc.SpriteFrame
        },
        player2CardsArray:{
          default: [],
          type:cc.SpriteFrame
        },
        putCardsArray:{
          default:[],
          serializable: false,
            visible: false
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
        // cc.log('card.suit:'+card.suit);
        this.cardsArray.sort(this.compare('point'));
    },
    
    onDeal1: function(card,show){
        this.player1CardsArray.push(card);
    },
    
    onDeal2: function(card,show){
        this.player2CardsArray.push(card);
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
        this.labelCardInfo.string = 0;
        for(var i=0;i<this.cardsArray.length;i++){
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.anchorCards.addChild(newCard.node);
            newCard.init(this.cardsArray[i],i);
            // newCard = this.cardsArray[i];
            // cc.log('card.tag'+newCard.tag.string+'card.ponit'+newCard.point.string);
            newCard.reveal(true);
            // this.newCardsArray.push(newCard);
            var startPos = cc.p(0, 0);
            var index = this.cardsArray.length;
            //  this.cardInfo.active=true;
            this.labelCardInfo.string = index;
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
    
    showCards1: function(){
        for(var i=0;i<this.player1CardsArray.length;i++){
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.anchorCards.addChild(newCard.node);
            newCard.init(this.player1CardsArray[i]);
            newCard.reveal(false);
            var startPos = cc.p(0,0);
            var index = this.player1CardsArray.length;
            cc.log('player1牌的多少'+index);
            this.labelCardInfo.string = index;
            var endPos = cc.p(0*i,0);
            newCard.node.setPosition(startPos);
            var endPosX = endPos.x;
            this._updatePointPos(endPosX);
            
            var moveAction = cc.moveTo(0.5, endPos);
            var callback = cc.callFunc(this._onDealEnd, this);
            newCard.node.runAction(cc.sequence(moveAction, callback));
            
        }
    },
    
    showCards2: function(){
          cc.log('player2牌的多少'+this.player2CardsArray.length);
        for(var i=0;i<this.player2CardsArray.length;i++){
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.anchorCards.addChild(newCard.node);
            newCard.init(this.player2CardsArray[i]);
            newCard.reveal(false);
            var startPos = cc.p(0,0);
            var index = this.player2CardsArray.length;
            // cc.log('player2牌的多少'+index);
            
            this.labelCardInfo.string = index;
            var endPos = cc.p(0*i,0);
            newCard.node.setPosition(startPos);
            var endPosX = endPos.x;
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
        this.cardInfo.setPosition(xPos + 50, 0);
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
    
    addPutCard: function(card){
        this.putCardsArray.push(card);
        cc.log('添加的打出的牌'+'point:'+card.point.string+'    tag:'+card.tag.string);
    },
    
    release: function(card){
        for(var i=0;i<this.putCardsArray.length;i++){
            if(card.tag===this.putCardsArray[i].tag){
                this.putCardsArray.splice(i,1);
            }
        }
    },
    
    putCards:function(){
        // this.newCardsArray = [];
        this.newcardsArray = this.cardsArray.slice();
        for(var i=0;i<this.putCardsArray.length;i++){
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            // this.newCardsArray.push(card);
            newCard = this.putCardsArray[i];
            // cc.log('牌的point'+newCard.point.string+'tag'+newCard.tag.string);
            for(var j=0;j<this.cardsArray.length;j++){
                var card = cc.instantiate(this.cardPrefab).getComponent('Card');
                card.init(this.cardsArray[j],j);
                if(newCard.point.string === card.point.string && newCard.suitNum.string===card.suitNum.string){
                    this.player0ShowPutCard();
                    cc.log('删除掉的另一张牌tag:'+newCard.tag.string+'point'+newCard.point.string);
                    cc.log('删除一张牌tag:'+card.tag.string+'point:'+card.point.string);
                    this.cardsArray.splice(j,1);
                    this.cardsArray.sort(this.compare('point'));
                }
            }
        }
        
         this.anchorCards.removeAllChildren();
         this._resetChips();
         this.player0ShowPutCard();
         this.showCards();
         var game=cc.find('Game');
            game = game.getComponent('Game');
            game.btnPlay2(this.putCardsArray);
        this.putCardsArray = [];
         
    },
    
    putCards2:function(card){
        // for(var i=0;i<arr.length;i++){
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        //     // this.newCardsArray.push(card);
            newCard = card;
            // cc.log('牌的point'+newCard.point.string+'tag'+newCard.tag.string);
            for(var j=0;j<this.player2CardsArray.length;j++){
                var card = cc.instantiate(this.cardPrefab).getComponent('Card');
                card.init(this.player2CardsArray[j],j);
                if(newCard.point.string === card.point.string && newCard.suitNum.string===card.suitNum.string){
                    this.player0ShowPutCard();
                    cc.log('删除掉的另一张牌tag:'+newCard.tag.string+'point'+newCard.point.string);
                    cc.log('删除一张牌tag:'+card.tag.string+'point:'+card.point.string);
                    this.player2CardsArray.splice(j,1);
                    cc.log('player2CardsArray.length'+this.player2CardsArray.length);
                    // this.cardsArray.sort(this.compare('point'));
                }
            }
        // }
        
        
    },
    
    player2ShowPutCard: function(arr){
        cc.log('player1的数组的长度'+this.player2CardsArray.length); 
        for(var j=0;j<arr.length;j++){
            var card = cc.instantiate(this.cardPrefab).getComponent('Card');
                // card.init(arr[j],j);
                card=arr[j];
            // cc.log('牌的point'+newCard.point.string+'tag'+newCard.tag.string+'suit'+newCard.suitNum.string);
            // for(var j=0;j<arr.length;j++){
            for(var i=0;i<this.player2CardsArray.length;i++){
                var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
                newCard.init(this.player2CardsArray[i],i);
                
                // cc.log('检测到的牌:'+card.point.string);
                if(newCard.point.string>card.point.string){
                    this.putCards2(newCard);
                    // cc.log('手机超人打出的牌'+newCard.point.string);
                    // var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
                    this.anchorCards.addChild(newCard.node);
                    // newCard.init(this.player2CardsArray[i]);
                    newCard.reveal(true);
                    var endPos = cc.p(-150,0);
                    var index = this.player2CardsArray.length;
                    // cc.log('player2牌的多少'+index);
            
                    // this.labelCardInfo.string = index;
                    var startPos = cc.p(-10*j-150,0);
                    newCard.node.setPosition(startPos);
                    var endPosX = endPos.x;
                    this._updatePointPos(endPosX);
            
                    var moveAction = cc.moveTo(0.5, endPos);
                    var callback = cc.callFunc(this._onDealEnd, this);
                    newCard.node.runAction(cc.sequence(moveAction, callback));
                    
                    break;
                }
            }
        }
        this.anchorCards.removeAllChildren();
         this._resetChips();
         this.showCards2();
        //  this.player2ShowPutCard(arr);
         
        //  var game=cc.find('Game');
        //     game = game.getComponent('Game');
        //     game.btnPlay2(this.putCardsArray);
        
        this.putCardsArray = [];
    },
    
    player0ShowPutCard:function(){
        cc.log('长度'+this.putCardsArray.length);
        for(var i=0;i<this.putCardsArray.length;i++){
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            newCard = this.putCardsArray[i];
            // cc.log('牌的point'+newCard.point.string+'tag'+newCard.tag.string+'suit'+newCard.suitNum.string); 
            for(var j=0;j<this.newcardsArray.length;j++){
                var card = cc.instantiate(this.cardPrefab).getComponent('Card');
                card.init(this.newcardsArray[j],j);
                if(newCard.tag.string === card.tag.string ){
                    var newCard2 = cc.instantiate(this.cardPrefab).getComponent('Card');
                    this.anchorCards.addChild(newCard2.node);
                    newCard2.init(this.newcardsArray[j],j);
                    newCard2.reveal(true);
                    var startPos = cc.p(100, 150);
                    var index = this.newcardsArray.length;
                    var endPos = cc.p(100+(30 * i),150);
                    newCard2.node.setPosition(startPos);
                    var endPosX = endPos.x;
                    this._updatePointPos(endPosX);
                    var moveAction = cc.moveTo(0.5, endPos);
                    var callback = cc.callFunc(this._onDealEnd, this);
                    newCard2.node.runAction(cc.sequence(moveAction, callback));
                }
            }
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
