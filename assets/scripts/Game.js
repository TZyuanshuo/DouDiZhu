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
        this.audioMng.playButton();
    },
    
    // FSM CALLBACKS 回调
    onEnterDealState: function () {
        // this.betUI.resetTossedChips();
        this.inGameUI.resetCountdown();
        this.player.renderer.showStakeChips(this.player.stakeNum);
        this.player.addCard(this.decks.draw());
        
        var holdCard = this.decks.draw();
        this.dealer.addHoleCard(holdCard);
        this.player.addCard(this.decks.draw());
        this.dealer.addCard(this.decks.draw());
        this.dealer.addHoleCard(holdCard);
        this.player.addCard(this.decks.draw());
        // this.player.addCard(this.decks.draw());
        
        this.player1.addHoleCard(holdCard);
        this.player1.addCard(this.decks.draw());

        this.audioMng.playCard();
        this.fsm.onDealed();
    },
    
    // 显示出牌或不出牌按钮
    onPlayersTurnState: function (enter) {
        if (enter) {
            this.inGameUI.showGameState();
        }
    },

    // 玩家出牌
    btnPlay: function(){
         
    },
    // 玩家不出牌
    btnDoNot: function() {
        
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
      }  
    },
    
    quitToMenu: function(){
      cc.director.loadScene('menu');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
