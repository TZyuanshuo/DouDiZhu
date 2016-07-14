cc.Class({
    extends: cc.Component,


    typeJudge : function(cards){
        var self = this,
        len = cards.length;
    switch (len) {
        case 1:
            return {'cardKind': 1, 'val': cards[0].val, 'size': len};
        case 2:
            if(self.isPairs(cards))
                return {'cardKind': 2, 'val': cards[0].val, 'size': len};
            else if (self.isKingBomb(cards))
                return {'cardKind': 14, 'val': cards[0].val, 'size': len};
            else
                return null;
        case 3:
            if(self.isThree(cards))
                return {'cardKind': 3, 'val': cards[0].val, 'size': len};
            else
                return null;
        case 4:
            if(self.isThreeWithOne(cards)){
                return {'cardKind': 4, 'val': self.getMaxVal(cards, 3), 'size': len};
            } else if (self.isBomb(cards)) {
                return {'cardKind': 13, 'val': cards[0].val, 'size': len};
            }
            return null;
        default:
            if(self.isProgression(cards))
                return {'cardKind': 6, 'val': cards[0].val, 'size': len};
            else if(self.isProgressionPairs(cards))
                return {'cardKind': 7, 'val': cards[0].val, 'size': len};
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
        return cards.length == 2 && cards[0].val === cards[1].val;
    },
    
    // 是否是三根
    isThree:function(cards){
        return cards.length == 3 && cards[0].val === cards[1].val && cards[1].val === cards[2].val;
    },
    //是否是三带一
    isThreeWithOne : function(cards) {
        if(cards.length != 4) return false;
        var c = this.valCount(cards);
        return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
    },
    //是否是三带一对
    isThreeWithPairs :function(cards) {
        if(cards.length != 5) return false;
        var c = this.valCount(cards);
        return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
    },
    //是否是顺子
    isProgression : function(cards) {
        if(cards.length < 5 || cards[0].val === 15) return false;
        for (var i = 0; i < cards.length; i++) {
            if(i != (cards.length - 1) && (cards[i].val - 1) != cards[i + 1].val){
                return false;
            }
        }
        return true;
    },
    //是否是连对
    isProgressionPairs : function(cards) {
    if(cards.length < 6 || cards.length % 2 !== 0 || cards[0].val === 15) return false;
    for (var i = 0; i < cards.length; i += 2) {
        if(i != (cards.length - 2) && (cards[i].val != cards[i + 1].val || (cards[i].val - 1) != cards[i + 2].val)){
            return false;
        }
    }
    return true;
    },
    //是否是飞机
    isPlane : function(cards) {
    if(cards.length < 6 || cards.length % 3 !== 0 || cards[0].val === 15) return false;
    for (var i = 0; i < cards.length; i += 3) {
        if(i != (cards.length - 3) && (cards[i].val != cards[i + 1].val || cards[i].val != cards[i + 2].val || (cards[i].val - 1) != cards[i + 3].val)){
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
    if(threeList.length != threeCount || threeList[0].val === 15){//检测三根数量和不能为2
        return false;
    }
    for (i = 0; i < threeList.length; i++) {//检测三根是否连续
        if(i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val){
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
    if(threeList.length != groupCount || pairsList.length != groupCount || threeList[0].val === 15){//检测三根数量和对子数量和不能为2
        return false;
    }
    for (i = 0; i < threeList.length; i++) {//检测三根是否连续
        if(i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val){
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
    return cards.length === 4 && cards[0].val === cards[1].val && cards[0].val === cards[2].val && cards[0].val === cards[3].val;
    },
    //是否是王炸
    isKingBomb : function(cards) {
    return cards.length === 2 && cards[0].type == '0' && cards[1].type == '0';
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
    var result = [];
    var addCount = function(result , v){
        for (var i = 0; i < result.length; i++) {
            if(result[i].val == v){
                result[i].count ++;
                return;
            }
        }
        result.push({'val': v, 'count': 1});
    };
    for (var i = 0; i < cards.length; i++){
        addCount(result, cards[i].val);
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
    
//     /**
//  * 牌型枚举
//  */


//     if(typeof this== "undefined"){
//         var this=self,
//         this.ONE = 1,
//         this.ONE = 1,
// this.PAIRS = 2,
// this.THREE = 3,
// this.prototype.THREE_WITH_ONE = 4;
// this.prototype.THREE_WITH_PAIRS = 5;
// this.prototype.PROGRESSION = 6;
// this.prototype.PROGRESSION_PAIRS = 7;
// this.prototype.PLANE = 8;
// this.prototype.PLANE_WITH_ONE = 9;
// this.prototype.PLANE_WITH_PAIRS = 10;
// this.prototype.FOUR_WITH_TWO = 11;
// this.prototype.FOUR_WITH_TWO_PAIRS = 12;
// this.prototype.BOMB = 13;
// this.prototype.KING_BOMB = 14;
//     },

    
});
