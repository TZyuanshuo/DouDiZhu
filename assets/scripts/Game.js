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
        totalChipsNum:5000,
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
        this.onPlayersTurnJDZState(true);;
        this.audioMng.playButton();
    },
    
    dzGo:function(){
      this.inGameUI.jdzStateUI.active = false;
      this.onPlayersCardsGet(true);
      this.onPlayersTurnState(true);
    },
    
     //  叫地主
    onPlayersTurnJDZState: function (enter) {
        if (enter) {
            this.inGameUI.showJDZState();
        }
    },
    
      //  抢地主
    onPlayersTurnDZState: function (enter) {
        if (enter) {
            this.inGameUI.showDZState();
        }
    },
    
    onPlayersCardsGet:function(enter){
         if (enter) {
            this.player3.revealHoldCard();
        }
    },
    
    // FSM CALLBACKS 回调
    onEnterDealState: function () {
        // this.betUI.resetTossedChips();
        this.inGameUI.resetCountdown();
        // 下注的多少
        // this.player.renderer.showStakeChips(this.player.stakeNum);
        for(var j=0; j<3; ++j){
            this.player3.addHoleCard3(this.decks.draw());
        }
        for (var i=0; i<17; ++i){
            this.player.addCard(this.decks.draw());
            this.player1.addHoleCard(this.decks.draw());
            this.player2.addHoleCard2(this.decks.draw());
        }
        this.player.showCard();
        this.player1.showCards1();
        this.player2.showCards2();
        this.player3.showCards3();
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
        this.player2 = null;
        this.player3 = null;
        this.createPlayers();
        
        // this.dealer = this.dealer.getComponent('Dealer');
        // this.dealer.init();
        
        // shortcut to ui element
        this.info = this.inGameUI.resultTxt;
        // this.totalChips = this.inGameUI.labelTotalChips;

        // init logic
        this.decks = new Decks(this.numberOfDecks);
        this.fsm = Fsm;
        this.fsm.init(this);
        
        //网络请求
       
        
        // cc.log('valueof:'+this.getUUID());
        
        this.getRequest();

        // start
        this.updateTotalChips();

        this.audioMng.playMusic();
    },
    
    // // 获取UUID 
    // getUUID: function(){
    //     var uuid;
    //     uuid=this.createUUID();
    //     return uuid;
    // },
    
    // createUUID: function(){
    //      var c = new Date(1582, 10, 15, 0, 0, 0, 0);
    // var f = new Date();
    // var h = f.getTime() - c.getTime();
    // var i = this.getIntegerBits(h, 0, 31);
    // var g = this.getIntegerBits(h, 32, 47);
    // var e = this.getIntegerBits(h, 48, 59) + "2";
    // var b = this.getIntegerBits(this.rand(4095), 0, 7);
    // var d = this.getIntegerBits(this.rand(4095), 0, 7);
    // var a = this.getIntegerBits(this.rand(8191), 0, 7)+
    //         this.getIntegerBits(this.rand(8191), 8, 15)+
    //         this.getIntegerBits(this.rand(8191), 0, 7)+
    //         this.getIntegerBits(this.rand(8191), 8, 15)+
    //         this.getIntegerBits(this.rand(8191), 0, 15);
    // return i + g + e + b + d + a;
    // },
    
    // getIntegerBits: function(f,g,b){
    //     var a = this.returnBase(f, 16);
    //     var d = new Array();
    //     var e = "";
    //     var c = 0;
    //     for (c = 0; c < a.length; c++) {
    //         d.push(a.substring(c, c + 1))
    //     }
    //     for (c = Math.floor(g / 4); c <= Math.floor(b / 4); c++) {
    //         if (!d[c] || d[c] === "") {
    //             e += "0"
    //         } else {
    //             e += d[c]
    //         }
    //     }
    //     return e
    // },
    
    // returnBase: function(c,d){
    //     var e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B",
    //     "C",
    //     "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
    //     "Q",
    //     "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    //     ];
    //     if (c < d) {
    //         var b = e[c];
    //     } else {
    //         var f = "" + Math.floor(c / d);
    //         var a = c - f * d;
    //         if (f >= d) {
    //              b = this.returnBase(f, d) + e[a];
    //         } else {
    //              b = e[f] + e[a];
    //         }
    //     }
    //     return b
    // },
    // rand: function(a){
    //     return Math.floor(Math.random() * a);
    // },
    
    // // get请求
    // getRequest: function(){
    //     var xhr = new XMLHttpRequest();
    //     xhr.onreadystatechange = function(){
    //       if (xhr.readyState == 4 && (xhr.status >=200 && xhr.status <400)){
    //           var response = xhr.responseText;
    //           cc.log('response'+response);
    //       }
    //     };
    //     xhr.open("GET","http://www.baidu.com",true);
    //     xhr.send();
    // },
    
    // post: function(url, params) {
    //     var temp = document.createElement("form");
    //     temp.action = url;
    //     temp.method = "post";
    //     temp.style.display = "none";
    //     for (var x in params) {
    //         var opt = document.createElement("input");
    //         opt.name = x;
    //         opt.value = params[x];
    //         temp.appendChild(opt);
    //     }
    //     document.body.appendChild(temp);
    //     temp.submit();
    //     return temp;
    // }, 
     
    
    updateTotalChips: function() {
        // this.totalChips.string = this.totalChipsNum;
        this.player.renderer.updateTotalStake(this.totalChipsNum);
    },
    
    createPlayers: function(){
      for(var i = 0;i < 4; ++i){
           var playerNode = cc.instantiate(this.playerPrefab);
            var anchor = this.playerAnchors[i];
            var switchSide = (i > 3);
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
          
          if (i === 3){
              this.player3 = playerNode.getComponent('Player');
              this.player3.init();
              actorRenderer.playerInfo.active = false;
              actorRenderer.stakeOnTable.active = false;
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
    
    addThreeCards: function(cards){
      this.player.addThreeCards(cards);  
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
