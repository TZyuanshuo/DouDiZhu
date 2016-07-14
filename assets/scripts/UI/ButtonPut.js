var actorRenderer = require('ActorRenderer');
var Decks = require('Decks');
cc.Class({
    extends: cc.Component,

    properties: {
        upStationX:0,
        upStationY:0,
        cardsArray: {
            default: [],
            type:cc.SpriteFrame
        },
        
    },

    // use this for initialization
    onLoad: function () {
        // this.upStationX=this.
        var self = this;
        var audioMng = cc.find('Menu/AudioMng') || cc.find('Game/AudioMng')
        if (audioMng) {
            audioMng = audioMng.getComponent('AudioMng');
        }
        var actor =cc.find('Canvas/playerLayer/anchorDealer/Dealer');
        if(actor){
            actor = actor.getComponent('ActorRenderer');
        }
        
        var game=cc.find('Game');
            game = game.getComponent('Game');
        var num = 0;
        var spawn = cc.sequence(cc.moveBy(0.5, 0, this.upStationX));
        var spawnDown = cc.sequence(cc.moveBy(0.5, 0, -this.upStationX));
        var actionUp = cc.speed(spawn,5);
        var actionDown = cc.speed(spawnDown, 5);
        
        function onTouchDown (event){
            
            // cc.log('牌的id'+this.getComponent('Card').point.string);
            // cc.log('tag'+this.getComponent('Card').tag);
            var newCard = this.getComponent('Card');
            this.stopAllActions();
            if(audioMng) audioMng.playButton();
            if(num%2===0){
                game.addCards(newCard);
                this.runAction(actionUp);
            }else{
                game.release(newCard);
                this.runAction(actionDown);
            }
            num++;
        }
        this.node.on('touchstart', onTouchDown, this.node);
    },
    
    // addCards: function (card){
    //     this.cardsArray.push(card);
    //     cc.log('添加后数组的长度'+this.cardsArray.length);
    // }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
