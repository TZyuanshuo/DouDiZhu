cc.Class({
    extends: cc.Component,

    properties: {
        upStationX:0,
        upStationY:0
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        var audioMng = cc.find('Menu/AudioMng') || cc.find('Game/AudioMng')
        if (audioMng) {
            audioMng = audioMng.getComponent('AudioMng');
        }
        var num = 0;
        var spawn = cc.sequence(cc.moveBy(0.5, 0, 30));
        var spawnDown = cc.sequence(cc.moveBy(0.5, 0, -30));
        var actionUp = cc.speed(spawn,4);
        var actionDown = cc.speed(spawnDown, 4);
        function onTouchDown (event){
            this.stopAllActions();
            if(audioMng) audioMng.playButton();
            if(num%2===0){
            this.runAction(actionUp);
            }else{
                this.runAction(actionDown);
            }
            num++;
        }
        this.node.on('touchstart', onTouchDown, this.node);
    },

    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
