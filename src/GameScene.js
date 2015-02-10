/**
 * Created by johnrunning on 14/12/16.
 */

var kGameReady = 1;
var kGaming = 2;
var kGamePaused = 3;
var kGameEnded = 4;

var state = kGameReady;


//这是一个保存娃娃数量的json数据
dollNum = {Aries: 0, Taurus: 0, Gemini: 0, Cancer: 0, Leo: 0, Virgo: 0, Libra: 0, Scorpius: 0, Sagittarius: 0, Capricornus: 0, Aquarius: 0, Pisces: 0};

var numbersData = [1,2,3,-1,-2,-3];


var GameSceneLayer = cc.Layer.extend({
    levelTipLabel:null,
    totalTime:4,
    level:0,
    slippedNum:0,
    sheepSpeed:1,
    addSheepTimeInterval:3,
    addSheepNum:1,
    gameLayer:null,
    pastTime:null,
    sheepPool:null,
    sheepsInGame:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        var size = cc.winSize;

        this.answerSprites = new Array();

        var bgLayer = new cc.LayerColor();
        bgLayer.init(cc.color(0xFF,0xFF,0xFF,0xff),size.width,size.height);
        this.addChild(bgLayer);

        var bg = new cc.Sprite(res.levelTipBg_png);//bg1_jpg
        bg.x = 85;
        bg.y = size.height-118/2;
        this.addChild(bg);

        this.sheepPool = new Array();
        this.sheepsInGame = new Array();

        this.gameLayer = new cc.Layer();
        this.addChild(this.gameLayer);


        this.levelTipLabel = new cc.LabelTTF("0", "Arial", 60);
        // position the label on the center of the screen
        this.levelTipLabel.x = 85;
        this.levelTipLabel.y = bg.y;
        this.levelTipLabel.color = cc.color(0x4d,0x4d,0x4d);
        // add the label as a child to this layer
        this.addChild(this.levelTipLabel, 5);

        //add animation cache
        var animationCache = cc.animationCache;
        var animation = new cc.Animation();
        animationCache.addAnimation(animation, "sheep1die");
        animation.addSpriteFrameWithFile("res/animations/c2/c2piss1.png");
        animation.addSpriteFrameWithFile("res/animations/c2/c2piss2.png");
        animation.setDelayPerUnit(0.3);

        animation = new cc.Animation();
        animationCache.addAnimation(animation, "sheep1run");
        animation.addSpriteFrameWithFile("res/animations/c2/c2toright1.png");
        animation.addSpriteFrameWithFile("res/animations/c2/c2toright2.png");
        animation.addSpriteFrameWithFile("res/animations/c2/c2toright3.png");
        animation.setDelayPerUnit(0.2);





        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        this.createSheepsInPool();



        this.setLevel(0);

        this.schedule(this.step);
        return true;
    },

    getSheepFromPool:function(){
        for(var i = 0; i < this.sheepPool.length; i++){
            var sheep = this.sheepPool[i];
            if(sheep.state == kSheepUNKNOW)
                return sheep;
        }

        var sheep = new Sheep();
        this.gameLayer.addChild(sheep, 5);
        this.sheepPool.push(sheep);
        return sheep;
    },

    createSheepsInPool:function(){
        for(var i = 0; i < 10; i++){
            var sheep = new Sheep();
            this.gameLayer.addChild(sheep, 5);
            this.sheepPool.push(sheep);
        }
    },

    onTouchBegan:function (touch, event) {
        if(state != kGaming) return;
        var target = event.getCurrentTarget();
        var position = touch.getLocation();

        return true;
    },
    onTouchMoved:function (touch, event) {
    },
    onTouchEnded:function (touch, event) {
    },
    touchDelegateRetain:function () {
    },
    touchDelegateRelease:function () {
    },

    /**
     * 保存Doll数量，要保存json数据的时候，需要使用JSON.stringify();方法将JSON转化为字符串
     */
    saveDollNum:function(){
        var tempDollNum = JSON.stringify(dollNum);
        cc.sys.localStorage.setItem("dollNum", tempDollNum);
    },


    /**
    * 加载Doll数量 和 keys；然后再读取过后，需要用JSON.parse();方法将字符串转化为JSON
    */
    loadDollNum:function() {
    var tempDollNum = cc.sys.localStorage.getItem("dollNum");


    if(tempDollNum == null || tempDollNum == ""){
        this.saveDollNum();
        cc.log("default dollNum " + dollNum);
    }else{
        tempDollNum = sys.localStorage.getItem("dollNum");
        cc.log("get dollNum " + tempDollNum);
    }
        //将字符串转化为json
        tempDollNum = JSON.parse(tempDollNum);
    },


    setLevel:function(value){
        this.level = value;
        this.levelTipLabel.setString((this.level+1));
        this.totalTime = 2.5;
        if(this.level < 5) {
            this.totalTime = 2.5;

            this.addSheepTimeInterval =7+(Math.random()*10)/10;
            this.addSheepNum =2;
            this.sheepSpeed = 1;

        }else if(this.level < 10){
            this.totalTime = 2;
            this.addSheepTimeInterval =5+(Math.random()*10)/10;
            this.addSheepNum =2;
            this.sheepSpeed = 2;
        }else if(this.level < 20){
            this.totalTime = 1.5;
            this.addSheepTimeInterval =4+(Math.random()*10)/10;
            this.addSheepNum =3;
            this.sheepSpeed = 3;
        }else{
            this.totalTime = 1;
            this.addSheepTimeInterval = 3+(Math.random()*10)/10;
            this.addSheepNum =3;
            this.sheepSpeed = 3;
        }
        this.createNewGame();
        this.currentTime = this.totalTime;
        this.pastTime = 0;


        state = kGaming;

        //this.itemLayer.runAction(cc.repeatForever(cc.blink(1,2)));


        //隔n秒添加n只羊，
        this.getSheepsToGame(this,this);
    },

    getSheepsToGame:function(target,s){
        for(var i = 0; i < this.addSheepNum; i++){
            var sheep = this.getSheepFromPool();
            sheep.speed = this.sheepSpeed + Math.random();
            var randomRoad = Math.floor(Math.random() * 3);
            sheep.setRoad(randomRoad);
            sheep.setLocalZOrder(-sheep.getPositionY());

            sheep.run();


            if(this.sheepsInGame.indexOf(sheep)<0)
                this.sheepsInGame.push(sheep);
        }
        var callFunc = new cc.callFunc(target.getSheepsToGame,target,target);
        this.runAction(cc.sequence(cc.delayTime(this.addSheepTimeInterval),callFunc));

        //this.scheduleOnce(this.getSheepsToGame,this.addSheepTimeInterval);
    },

    nextLevel:function(){
        this.setLevel(this.level+1);
        //if (showRoundLabelEffect) {
        //    //TODO::showRoundLabelEffect
        //}
        this.setRound(this.round+1);

    },

    step:function(dt){
        if(state == kGaming){
            //this.currentTime -= dt;
            //if(this.currentTime <0)
            //    this.currentTime = 0;
            //if(this.currentTime == 0)
            //    this.timeUp();

            for(var i = 0; i < this.sheepsInGame.length; i++){
                var sheep = this.sheepsInGame[i];
                if(sheep.isMoving()){
                    sheep.step();
                    if(sheep.isSheepSlipped()){
                        this.slippedNum++;
                        sheep.reset();
                    }
                }
            }
        }
    },

    setTime:function(value){
        this.currentTime = value;
        if (this.currentTime < 0) {
            this.currentTime = 0;
            return;
        }

        //if (this.currentTime <= 0 && state == kGaming) {
        //    this.timeUp();
        //}
    },

    setTargets:function(value){

    },

    timeUp:function(sender,s){
        this.gameEnd();
    },


    setRound:function(value){
        this.round = value;
        //gameDelegate.setRound(round);
        //TODO::set ui round
    },

    reset:function() {
        state = kGameReady;
        this.setRound(0);
        this.currentTime = this.totalTime;
        this.setTime(this.currentTime);
    },

    createNewGame:function(){
        this.sheepsInGame = new Array();




        state = kGaming;
    },

    gameEnd:function(){
        state = kGameEnded;
        playerScore = this.level+1;

        this.unschedule(this.step);
        cc.director.runScene(new cc.TransitionSlideInT(1, new GameEndScene()));
    }
});



var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameSceneLayer();
        this.addChild(layer);
    }
});