var Game=require('Game');
cc.Class({
    extends: cc.Component,

    properties: {
        // panelChat: cc.Node,
        panelSocial:cc.Node,
        // betStateUI:cc.Node,
        gameStateUI: cc.Node,
        btnPlay:cc.Node,
        btnDoNot:cc.Node,
        resultTxt:cc.Label,
        // betCounter:cc.ProgressBar,
        btnStart:cc.Node,
        jdzStateUI:cc.Node,
    },

    // use this for initialization
    init:function(betDuration){
        this.panelSocial.active = false;
        this.resultTxt.enabled = false;
        // this.betStateUI.active = false;
        this.gameStateUI.active = false;
        this.btnStart.active = true;
        this.betDuration = betDuration;
        this.betTimer = 0;
        this.isBetCounting = false;
    },
    
    startCountdown: function(){
        // if(this.betCounter){
        //     this.betTimer = 0;
        //     this.isBetCounting = true;
        // }
    },
    
    resetCountdown: function() {
        // if (this.betCounter) {
        //     this.betTimer = 0;
        //     this.isBetCounting = false;
        //     this.betCounter.progress = 0;
        // }
    },
    
    showJDZState: function () {
        // this.betStateUI.active = false;
        this.jdzStateUI.active = true;
        this.btnStart.active = false;
    },
    
    showDZState: function () {
        // this.betStateUI.active = false;
        this.dzStateUI.active = true;
        this.btnStart.active = false;
    },
    showBetState: function () {
        // this.betStateUI.active = true;
        this.gameStateUI.active = false;
        this.btnStart.active = false;
    },

    showGameState: function () {
        // this.betStateUI.active = false;
        this.gameStateUI.active = true;
        this.btnStart.active = false;
    },
    
    btnPlayDisabled:function(){
        this.btnPlay.interactable= false;
    },
    
    btnPlayInUse: function(){
      this.btnPlay.interactable	= true;  
    },

    showResultState: function () {
        // this.betStateUI.active = false;
        this.gameStateUI.active = false;
        this.btnStart.active = true;
    },

    toggleChat: function () {
        this.panelChat.active = !this.panelChat.active;
    },

    toggleSocial: function () {
        this.panelSocial.active = !this.panelSocial.active;
    },

    // called every frame
    update: function (dt) {
        if (this.isBetCounting) {
            this.betCounter.progress = this.betTimer/this.betDuration;
            this.betTimer += dt;
            if (this.betTimer >= this.betDuration) {
                this.isBetCounting = false;
                this.betCounter.progress = 1;
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
