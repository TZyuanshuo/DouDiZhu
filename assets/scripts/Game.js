var players = require('PlayerData').players;
var Decks = require('Decks');
var Types = require('Types');
var ActorPlayingState = Types.ActorPlayingState;
var Fsm = require('game-fsm');

var Game =  cc.Class({
    extends: cc.Component,

    properties: {
        // 玩家数组
        playerAnchors:{
            default:[],
            type:cc.Node
        },
        playerPrefab: cc.Prefab,
        dealer:cc.Node,
        inGameUI:cc.Node,
        // betUI: cc.Node,
        assetMng: cc.Node,
        audioMng:cc.Node,
        turnDuration:0,
        betDuration:0,
        totalChipsNum:0,
        totalDiamondNum:0,
        numberOfDecks:{
            default:1,
            type:'Integer'
        }
    },
    
    statics:{
      instance: null  
    },
    
    // 玩家报到
    report: function () {
        this.player.report();

        // if every player end
        this.fsm.onPlayerActed();
    },
    
    // 开始游戏
    btnStart: function(){
        this.inGameUI.btnStart.active=false;
        this.fsm.toBet();
        this.fsm.toDeal();
        this.onPlayersTurnState(true);
        this.audioMng.playButton();
    },
    
    // FSM CALLBACKS 回调
    onEnterDealState: function () {
        // this.betUI.resetTossedChips();
        this.inGameUI.resetCountdown();
        // 下注的多少
        // this.player.renderer.showStakeChips(this.player.stakeNum);
        
        for (var i=0; i<17; ++i){
            this.player.addCard(this.decks.draw());
            this.player1.addHoleCard(this.decks.draw());
            this.player2.addHoleCard2(this.decks.draw());
        }
        this.player.showCard();
        this.player1.showCards1();
        this.player2.showCards2();

    },
    
    // 显示出牌或不出牌按钮
    onPlayersTurnState: function (enter) {
        if (enter) {
            this.inGameUI.showGameState();
        }
    },

    // 玩家出牌
    btnPlay: function(){
        this.player.putCard();
    },
    
    // 玩家不出牌
    btnDoNot: function() {
        
    },
    
    // 机器人 手机超人 出牌
    btnPlay2: function(result){
        // this.player2.putCard();
        // cc.log('手机超人要出牌了'+arr.length);
        this.player2.putCard2(result);
    },

    // use this for initialization
    onLoad: function () {
        Game.instance = this;
        this.inGameUI = this.inGameUI.getComponent('InGameUI');
        this.assetMng = this.assetMng.getComponent('AssetMng');
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.inGameUI.init(this.betDuration);
        
        this.dealer = this.dealer.getComponent('Dealer');
        this.dealer.init();
    
        this.player = null;
        this.player1 = null;
        this.createPlayers();
        
        // this.dealer = this.dealer.getComponent('Dealer');
        // this.dealer.init();
        
        // shortcut to ui element
        this.info = this.inGameUI.resultTxt;
        this.totalChips = this.inGameUI.labelTotalChips;

        // init logic
        this.decks = new Decks(this.numberOfDecks);
        this.fsm = Fsm;
        this.fsm.init(this);

        // start
        // this.updateTotalChips();

        this.audioMng.playMusic();
    },
    
    
    createPlayers: function(){
      for(var i = 0;i < 3; ++i){
           var playerNode = cc.instantiate(this.playerPrefab);
            var anchor = this.playerAnchors[i];
            var switchSide = (i > 2);
            anchor.addChild(playerNode);
            playerNode.position = cc.p(0, 0);

            var playerInfoPos = cc.find('playerInfo', anchor).getPosition();
            var stakePos = cc.find('anchorStake', anchor).getPosition();
            var actorRenderer = playerNode.getComponent('ActorRenderer');
            actorRenderer.init(players[i], playerInfoPos, stakePos, this.turnDuration, switchSide);
          if(i === 0){
              this.player = playerNode.getComponent('Player');
              this.player.init();
          }
          if (i === 1){
              this.player1 = playerNode.getComponent('Player');
              this.player1.init();
          }
          
          if (i === 2){
              this.player2 = playerNode.getComponent('Player');
              this.player2.init();
          }
      }  
    },
    
    addCards:function(card){
        this.player.willPutCards(card);
    },
    
    // 放回要出的牌
    release:function(card){
      this.player.release(card);
    },
    
    // showPutCard:function(){
    //     this.dealer.showPutCard();
    // },
    
    quitToMenu: function(){
      cc.director.loadScene('menu');
    },
    
    // text显示
    showText: function(string){
        this.info.enabled=true;
        this.info.string=string;
        this.inGameUI.btnPlayDisabled();
    },
    
    notShowText: function(){
      this.info.enabled=false; 
    },
    
    showStart:function(){
            this.decks.reset();
           this.player.reset();
           this.dealer.reset();
           this.fsm.init(this);
           this.createPlayers();
           this.dealer = this.dealer.getComponent('Dealer');
            this.dealer.init();
           this.decks = new Decks(this.numberOfDecks);
        //   this.info.string = '请下注';
           this.inGameUI.showBetState();
           this.inGameUI.startCountdown();
            this.inGameUI.btnStart.active=true;
           this.audioMng.resumeMusic();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
