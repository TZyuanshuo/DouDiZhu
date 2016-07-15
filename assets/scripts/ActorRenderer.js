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
        willPutCards:{
            default:[],
          serializable: false,
            visible: false
        },
        cardType: cc.Node,
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
        // this.resultText = this.getComponent('resultTxt');
        // this.resultText.enabled=false;
        // this.cardType = this.cardType.getComponent('CardType');
        // nodes
        this.game=cc.find('Game');
        this.game=this.game.getComponent('Game');
        this.isCounting = false;
        this.counterTimer = 1;
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
    
    // 更新金币
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
        
    },
    
    onDeal1: function(card,show){
        this.player1CardsArray.push(card);
        this.player1CardsArray.sort(this.compare('point'));
    },
    
    onDeal2: function(card,show){
        this.player2CardsArray.push(card);
        this.player2CardsArray.sort(this.compare('point'));
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
        this.cardsArray.sort(this.compare('point'));
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
            // var button = cc.instantiate(this.cardPrefab).getComponent('ButtonPut');
            // button.upStationX=0;
            this.anchorCards.addChild(newCard.node);
            newCard.init(this.player1CardsArray[i]);
            newCard.reveal(false);
            var startPos = cc.p(0,0);
            var index = this.player1CardsArray.length;
            // cc.log('player1牌的多少'+index);
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
        //   cc.log('player2牌的多少'+this.player2CardsArray.length);
        for(var i=0;i<this.player2CardsArray.length;i++){
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.anchorCards.addChild(newCard.node);
            newCard.init(this.player2CardsArray[i],i);
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
        cc.log('添加的打出的牌'+'point:'+card.point.string+'    tag:'+card.tag.string+'value'+card.val.string);
        this.putCardsArray.sort(this.compare('val'));
    },
    
    release: function(card){
        for(var i=0;i<this.putCardsArray.length;i++){
            if(card.tag===this.putCardsArray[i].tag){
                this.putCardsArray.splice(i,1);
            }
        }
    },
    
    putCards:function(){
        var cardKind = 2;
        var val = 5;
        var go=false;
        var type = this.typeJudge(this.putCardsArray);
        if(this.typeJudge(this.putCardsArray)!=null){
            var result=this.typeJudge(this.putCardsArray);
            cc.log('牌的类型:'+result.cardKind);
            cc.log('牌的值'+result.val);
            cc.log('牌的长度'+result.size);
            
            // if(result.cardKind === cardKind && result.val> val ){
            //     go = true;
            // }else if(cardKind === 13 && result.cardKind === 13 && result.val > val ){
            //     go = true;
            // }else if(result.cardKind === 14){
            //     go = true;
            // }else if(cardKind < 13 && result.cardKind == 13){
            //     go = true;
            // }
            
            go=true;
            
        }
        
        if(go){
             this.game.notShowText();
            this.newCardsArray = [];
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
                        // cc.log('删除掉的另一张牌tag:'+newCard.tag.string+'point'+newCard.point.string);
                        // cc.log('删除一张牌tag:'+card.tag.string+'point:'+card.point.string);
                        this.cardsArray.splice(j,1);
                        this.cardsArray.sort(this.compare('point'));
                    }
                }
            }
        
            this.anchorCards.removeAllChildren();
            this._resetChips();
            this.player0ShowPutCard();
            this.showCard();
            this.willPutCards = this.putCardsArray.slice();
            this.putCardsArray = [];
            this.game.btnPlay2(result);
            }
            else{
                var game=cc.find('Game');
            game = game.getComponent('Game');
            this.game.showText('出的牌不符合类型');
            }
            
            if(this.cardsArray.length===0){
                this.game.showText('赢了');
                this.game.showStart();
            }
        
    },
    
    
    putCards2:function(result){
        this.willPutCards = this.player2CardsArray.slice();
        cc.log('牌的类型:'+result.cardKind);
        cc.log('牌的值'+result.val);
        cc.log('牌的长度'+result.size);
        // cc.log('arr'+arr.length);
        // for(var i=0;i<arr.length;i++){
        //     var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        //     newCard = arr[i];
        //     cc.log('point'+newCard.point.string);
        //     for(var j=0;j<this.player2CardsArray.length;j++){
        //         var card = cc.instantiate(this.cardPrefab).getComponent('Card');
        //         card.init(this.player2CardsArray[j],j);
        //         if(card.point.string>newCard.point.string){
        //             this.newCardsArray.push(card);
        //             this.player2CardsArray.splice(j,1);
        //              this.player2CardsArray.sort(this.compare('point'));
        //              break;
        //         }
        //     }
        // }
        // this.anchorCards.removeAllChildren();
        //  this._resetChips();
        //  this.player2ShowPutCard();
        //  this.showCards2();
        // this.newCardsArray = [];
    },
    
    showCard: function(){
        this.labelCardInfo.string = 0;
        this.cardsArray.sort(this.compare('point'));
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
            newCard.node.setPosition(endPos);
            var endPosX = endPos.x;
            // cc.log('移动距离'+endPosX);
            this._updatePointPos(endPosX);
            
            // var moveAction = cc.moveTo(0.5, endPos);
            // var callback = cc.callFunc(this._onDealEnd, this);
            // newCard.node.runAction(cc.sequence(moveAction, callback));
        }
    },
    
    player2ShowPutCard: function(){
        cc.log('机器人要出的牌'+this.newCardsArray.length);
        for(var i=0;i<this.newCardsArray.length;i++){
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            newCard = this.newCardsArray[i];
            // cc.log('牌的point'+newCard.point.string+'tag'+newCard.tag.string+'suit'+newCard.suitNum.string); 
            for(var j=0;j<this.willPutCards.length;j++){
                var card = cc.instantiate(this.cardPrefab).getComponent('Card');
                card.init(this.willPutCards[j]);
                // card = this.willPutCards[j];
                cc.log('willPutCards.length'+this.willPutCards.length);
                if(newCard.point.string === card.point.string && newCard.suitNum.string===card.suitNum.string){
                    var newCard2 = cc.instantiate(this.cardPrefab).getComponent('Card');
                    this.anchorCards.addChild(newCard2.node);
                    newCard2.init(this.willPutCards[j],j);
                    cc.log('asdf');
                    newCard2.reveal(true);
                    var startPos = cc.p(-150-(30 * this.newCardsArray.length-i), 0);
                    var index = this.willPutCards.length;
                    var endPos = cc.p(-150,0);
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
    
    player0ShowPutCard:function(){
        // cc.log('长度'+this.putCardsArray.length);
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
                    var endPos = cc.p(100+(30 *i),150);
                    newCard2.node.setPosition(endPos);
                    var endPosX = endPos.x;
                    this._updatePointPos(endPosX);
                    // var moveAction = cc.moveTo(0.5, endPos);
                    // var callback = cc.callFunc(this._onDealEnd, this);
                    // newCard2.node.runAction(cc.sequence(moveAction, callback));
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
    
    typeJudge : function(cards){
        var self = this,
        len = cards.length;
    switch (len) {
        case 1:
            return {'cardKind': 1, 'val': cards[0].val.string, 'size': len};
        case 2:
            if(self.isPairs(cards))
                return {'cardKind': 2, 'val': cards[0].val.string, 'size': len};
            else if (self.isKingBomb(cards))
                return {'cardKind': 14, 'val': cards[0].val.string, 'size': len};
            else
                return null;
        case 3:
            if(self.isThree(cards))
                return {'cardKind': 3, 'val': cards[0].val.string, 'size': len};
            else
                return null;
        case 4:
            if(self.isThreeWithOne(cards)){
                return {'cardKind': 4, 'val': self.getMaxVal(cards, 3), 'size': len};
            } else if (self.isBomb(cards)) {
                return {'cardKind': 13, 'val': cards[0].val.string, 'size': len};
            }
            return null;
        default:
            if(self.isProgression(cards))
                return {'cardKind': 6, 'val': cards[0].val.string, 'size': len};
            else if(self.isProgressionPairs(cards))
                return {'cardKind': 7, 'val': cards[0].val.string, 'size': len};
            else if(self.isThreeWithPairs(cards))
                return {'cardKind': 5, 'val': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isPlane(cards))
                return {'cardKind': 8, 'val': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isPlaneWithOne(cards))
                return {'cardKind': 9, 'val': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isPlaneWithPairs(cards))
                return {'cardKind': 10, 'val': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isFourWithTwo(cards))
                return {'cardKind': 11, 'val': self.getMaxVal(cards, 4), 'size': len};
            else if(self.isFourWithPairs(cards))
                return {'cardKind': 12, 'val': self.getMaxVal(cards, 4), 'size': len};
            else
                return null;

    }

    },
    
    // 是否是对子
    isPairs: function(cards){
        return cards.length == 2 && cards[0].val.string === cards[1].val.string;
    },
    
    // 是否是三根
    isThree:function(cards){
        cc.log('cards的值'+cards[0].val.string+cards[1].val.string+cards[2].val.string);
        return cards.length === 3 && cards[0].val.string === cards[1].val.string && cards[1].val.string === cards[2].val.string;
    },
    //是否是三带一
    isThreeWithOne : function(cards) {
        if(cards.length != 4) return false;
        var c = this.valCount(cards);
        // cc.log();
        return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
    },
    //是否是三带一对
    isThreeWithPairs :function(cards) {
        if(cards.length != 5) return false;
        var c = this.valCount(cards);
        // cc.log('123');
        // cc.log('c[0]:'+c[0].count+'c[1]:'+c[1].count);
        return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
    },
    
    //是否是顺子
    isProgression : function(cards) {
        cards.sort(this.compare('val'))
        // cc.log('长度的值'+cards.length);
        if(cards.length < 5 || cards[0].val.string === 15) return false;
        
        for (var i = 0; i < cards.length-1; i++) {
            var prev = cards[i].val.string;
            var next = cards[i+1].val.string;
            if(prev === 17 || prev === 16 || prev===15||next===17||next===16||next===15){
                return false;
            }else{
                if(prev - next != -1){
                    if(prev - next != 1)
                        return false;
                }
            }
        }
        return true;

    },
    //是否是连对
    isProgressionPairs : function(cards) {
    if(cards.length < 6 || cards.length % 2 !== 0 || cards[0].val.string === 15) return false;
    for (var i = 0; i < cards.length; i += 2) {
        if(i != (cards.length - 2) && (cards[i].val.string != cards[i + 1].val.string || (cards[i].val.string - 1) != cards[i + 2].val.string)){
            return false;
        }
    }
    return true;
    },
    //是否是飞机
    isPlane : function(cards) {
    if(cards.length < 6 || cards.length % 3 !== 0 || cards[0].val.string === 15) return false;
    for (var i = 0; i < cards.length; i += 3) {
        if(i != (cards.length - 3) && (cards[i].val.string != cards[i + 1].val.string || cards[i].val.string != cards[i + 2].val.string || (cards[i].val.string - 1) != cards[i + 3].val.string)){
            return false;
        }
    }
    return true;
    },
    
    //是否是飞机带单
    isPlaneWithOne: function(cards) {
    if(cards.length < 8 || cards.length % 4 !== 0) return false;
    var c = this.valCount(cards),
        threeList = [],
        threeCount = cards.length / 4;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count == 3){
            threeList.push(c[i]);
        }
    }
    if(threeList.length != threeCount || threeList[0].val.string === 15){//检测三根数量和不能为2
        return false;
    }
    for (i = 0; i < threeList.length; i++) {//检测三根是否连续
        if(i != threeList.length - 1 && threeList[i].val.string - 1 != threeList[i + 1].val.string){
            return false;
        }
    }
    return true;
    },
    
    //是否是飞机带对
    isPlaneWithPairs : function(cards) {
    if(cards.length < 10 || cards.length % 5 !== 0) return false;
    var c = this.valCount(cards),
        threeList = [],
        pairsList = [],
        groupCount = cards.length / 5;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count == 3){
            threeList.push(c[i]);
        }
        else if(c[i].count == 2){
            pairsList.push(c[i]);
        } else {
            return false;
        }
    }
    if(threeList.length != groupCount || pairsList.length != groupCount || threeList[0].val.string === 15){//检测三根数量和对子数量和不能为2
        return false;
    }
    for (i = 0; i < threeList.length; i++) {//检测三根是否连续
        if(i != threeList.length - 1 && threeList[i].val.string - 1 != threeList[i + 1].val.string){
            return false;
        }
    }
    return true;
    },
    
    //是否是四带二
    isFourWithTwo : function(cards) {
    var c = this.valCount(cards);
    if(cards.length !== 6 || c.length > 3) return false;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count === 4)
            return true;
    }
    return false;
    },
    
    //是否是四带两个对
    isFourWithPairs : function(cards) {
    if(cards.length != 8) return false;
    var c = this.valCount(cards);
    if(c.length != 3) return false;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count != 4 && c[i].count != 2)
            return false;
    }
    return true;
    },
    
    //是否是炸弹
    isBomb : function(cards) {
    return cards.length === 4 && cards[0].val.string === cards[1].val.string && cards[0].val.string === cards[2].val.string && cards[0].val.string === cards[3].val.string;
    },
    
    //是否是王炸
    isKingBomb : function(cards) {
        if(cards.length === 2){
            if((cards[0].val.string === 16 && cards[1].val.string === 17)||(cards[0].val.string === 17 && cards[1].val.string === 16)){
                return true;
            }
        }
        return false;
    // return cards.length === 2 && ((cards[0].val.string === 16 && cards[1].val.string === 17)||(cards[0].val.string === 17 && cards[1].val.string === 16)));
    },
    
    /**
 * 获取min到max之间的随机整数，min和max值都取得到
 * @param  {number} min - 最小值
 * @param  {number} max - 最大值
 * @return {number}
 */
    random : function(min, max) {
	min = min == null ? 0 : min;
	max = max == null ? 1 : max;
	var delta = (max - min) + 1;
	return Math.floor(Math.random() * delta + min);
    },
    
    /**
 * 牌统计，统计各个牌有多少张，比如2张A，一张8
 * @param  {list} cards - 要统计的牌
 * @return {object array} val：值，count：数量
 */
    valCount : function(cards){
        cards.sort(this.compare('val'));
        var result = [];
        var index=0;
        for(var i=0;i<cards.length-1;i++){
            if(cards[i].val.string != cards[i+1].val.string){
                result.push({'val':cards[i].val.string, 'count':i+1-index});
                index=i;
            }
        }
          if(index+1===cards.length||index+1<cards.length){
                    result.push({'val':cards[index+1].val.string,'count':cards.length-index-1});
                }
        
        return result;
    },
    
    
    /**
 * 获取指定张数的最大牌值
 * @param  {list} cards - 牌
 * @param  {list} cards - 张数
 * @return 值
 */
    getMaxVal : function(cards, n){
    var c = this.valCount(cards);
    var max = 0;

    for (var i = 0; i < c.length; i++) {
        // cc.log('c[i].count'+c[i].count);
        if(c[i].count === n && c[i].val > max){
            max = c[i].val;
        }
    }
    return max;
    },
    
    /**
 * 卡牌排序
 * @method cardSort
 * @param  {Object} a [description]
 * @param  {Object} b [description]
 * @return 1 : a < b ,-1 a : > b   [description]
 */
    cardSort : function (a, b){
    var va = parseInt(a.val);
    var vb = parseInt(b.val);
    if(va === vb){
        return a.type > b.type ? 1 : -1;
    } else if(va > vb){
        return -1;
    } else {
        return 1;
    }
    },
});
