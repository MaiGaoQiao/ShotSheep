/**
 * Created by johnrunning on 14/12/16.
 */

var kGameReady = 1;
var kGaming = 2;
var kGamePaused = 3;
var kGameEnded = 4;

var state = kGameReady;

var canShotInterval = 1;
var canShot = true;


//这是一个保存娃娃数量的json数据
dollNum = {Aries: 0, Taurus: 0, Gemini: 0, Cancer: 0, Leo: 0, Virgo: 0, Libra: 0, Scorpius: 0, Sagittarius: 0, Capricornus: 0, Aquarius: 0, Pisces: 0};

var numbersData = [1,2,3,-1,-2,-3];
var shotStartPosition;

var GameSceneLayer = cc.Layer.extend({
    levelTipLabel:null,
    totalTime:4,
    level:0,
    slippedNum:0,
    sheepSpeed:60,
    addSheepTimeInterval:3,
    addSheepNum:1,
    gameLayer:null,
    uiLayer:null,
    pastTime:null,
    sheepPool:null,
    sheepsInGame:null,
    arrowPool:null,
    arrowsInGame:null,
    shotPastTime:0,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        var size = cc.winSize;


        var bgLayer = new cc.LayerColor();
        bgLayer.init(cc.color(0xFF,0xFF,0xFF,0xff),size.width,size.height);
        this.addChild(bgLayer);

        var bg = new cc.Sprite(res.levelTipBg_png);//bg1_jpg
        bg.x = 85;
        bg.y = size.height-118/2;
        this.addChild(bg);

        this.sheepPool = new Array();
        this.sheepsInGame = new Array();
        this.arrowsInGame = new Array();
        this.arrowPool = new Array();

        this.gameLayer = new cc.Layer();
        this.addChild(this.gameLayer,1);

        this.uiLayer = new cc.Layer();
        this.addChild(this.uiLayer,10);


        for(var i = 0; i < 10; i++){
            var arrow = new cc.Sprite(res.arrow_png);
            this.arrowPool.push(arrow);
            this.gameLayer.addChild(arrow);
            arrow.setVisible(false);
        }


        this.levelTipLabel = new cc.LabelTTF("0", "Arial", 60);
        // position the label on the center of the screen
        this.levelTipLabel.x = 85;
        this.levelTipLabel.y = bg.y;
        this.levelTipLabel.color = cc.color(0x4d,0x4d,0x4d);
        // add the label as a child to this layer
        this.uiLayer.addChild(this.levelTipLabel, 5);


        var sprite = new cc.Sprite(res.pauseBt_png);
        var sprite1 = new cc.Sprite(res.pauseBt_png);
        sprite1.setScale(1.1);
        var spriteSize = sprite.getContentSize();
        sprite1.setPosition(cc.p(-spriteSize.width*0.1/2,-spriteSize.height*0.1/2));

        var pauseItem = new cc.MenuItemSprite(sprite,sprite1,function () {
            state = kGamePaused;
            cc.audioEngine.playEffect(res.button_press_wav, false);
            this.gameLayer.runAction(cc.moveTo(0.5,cc.p(-size.width,0)));
        }, this);

        var menu = new cc.Menu(pauseItem);
        menu.x = size.width-45;
        menu.y = size.height-40;
        this.uiLayer.addChild(menu);


        var sprite = new cc.Sprite(res.shotPlatformbg_png);
        sprite.x = size.width/2;
        sprite.y = 80;
        this.gameLayer.addChild(sprite);
        shotStartPosition = sprite.getPosition();


        //add animation cache
        var animationCache = cc.animationCache;

        //var animation = new cc.Animation();
        //animationCache.addAnimation(animation, "sheep1die");
        //animation.addSpriteFrameWithFile("res/animations/c2/c2piss1.png");
        //animation.addSpriteFrameWithFile("res/animations/c2/c2piss2.png");
        //animation.setDelayPerUnit(0.3);

        var banimation = new cc.Animation();
        var ranimation = new cc.Animation();
        var ganimation = new cc.Animation();
        animationCache.addAnimation(banimation, "bsheeprun");
        animationCache.addAnimation(ranimation, "rsheeprun");
        animationCache.addAnimation(ganimation, "gsheeprun");
        for(var i = 0; i < 5; i++){
            banimation.addSpriteFrameWithFile("res/animations/b"+i+".png");
            ranimation.addSpriteFrameWithFile("res/animations/r"+i+".png");
            ganimation.addSpriteFrameWithFile("res/animations/g"+i+".png");
        }
        banimation.setDelayPerUnit(0.2);
        ranimation.setDelayPerUnit(0.2);
        ganimation.setDelayPerUnit(0.2);

        var sprite = new cc.Sprite(res.pausebg_png);
        sprite.x = size.width+size.width/2;
        sprite.y = size.height/2;
        this.gameLayer.addChild(sprite);

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

    getArrowFromPool:function(){
        for(var i = 0; i < this.arrowPool.length; i++){
          var arrow = this.arrowPool[i];
          if(!arrow.isVisible()) return arrow;
        }
        var arrow = new cc.Sprite(res.arrow_png);
        this.arrowPool.push(arrow);
        this.gameLayer.addChild(arrow);
        arrow.setVisible(false);
        return arrow;
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

    shotArrow:function(targetPosition){
        if(!canShot) return;
        var arrow = this.getArrowFromPool();
        if(this.arrowsInGame.indexOf(arrow) < 0){
            this.arrowsInGame.push(arrow);
        }
        arrow.setVisible(true);
        arrow.setPosition(shotStartPosition);
        var dx = targetPosition.x - shotStartPosition.x;
        var dy = targetPosition.y - shotStartPosition.y;

        var r = -Math.atan2(dy,dx);
        arrow.setRotation(r*180/Math.PI);
        canShot = false;

        //this.uiLayer.runAction(cc.sequence(cc.delayTime(canShotInterval),new cc.callFunc(this.resetToCanShot,this,this)))
    },

    resetToCanShot:function(sender,s){
        canShot = true;
    },

    onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();
        if(state == kGamePaused){
            cc.audioEngine.playEffect(res.button_press_wav, false);
            target.gameLayer.runAction(cc.moveTo(0.5,cc.p(0,0)));
            state = kGaming;
            return;
        }
        if(state != kGaming) return;

        var position = touch.getLocation();
        var tp = target.gameLayer.convertToNodeSpace(position);
        target.shotArrow(tp);

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
        canShot = true;
        this.shotPastTime = 0;
        this.pastTime = 0;
        this.levelTipLabel.setString((this.level+1));
        this.totalTime = 2.5;
        if(this.level < 5) {
            this.totalTime = 2.5;

            this.addSheepTimeInterval =7+(Math.random()*10)/10;
            this.addSheepNum = 2;
            this.sheepSpeed = 60;

        }else if(this.level < 10){
            this.totalTime = 2;
            this.addSheepTimeInterval =5+(Math.random()*10)/10;
            this.addSheepNum = 2;
            this.sheepSpeed = 80;
        }else if(this.level < 20){
            this.totalTime = 1.5;
            this.addSheepTimeInterval =4+(Math.random()*10)/10;
            this.addSheepNum = 3;
            this.sheepSpeed = 150;
        }else{
            this.totalTime = 1;
            this.addSheepTimeInterval = 3+(Math.random()*10)/10;
            this.addSheepNum = 3;
            this.sheepSpeed = 160;
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
            var r = Math.random();
            sheep.speed = this.sheepSpeed +r*60;
            //cc.log("sheep.speed="+sheep.speed+" r="+r);
            var randomRoad = Math.floor(Math.random() * 3);
            sheep.setRoad(randomRoad);
            sheep.setLocalZOrder(-sheep.getPositionY());
            sheep.setType(Math.floor(Math.random() * 3));
            sheep.run(RUN_RIGHT);


            if(this.sheepsInGame.indexOf(sheep)<0)
                this.sheepsInGame.push(sheep);
        }
        //this.levelTipLabel.stopAllActions();
        //var callFunc = new cc.callFunc(target.getSheepsToGame,target,target);
        //this.levelTipLabel.runAction(cc.sequence(cc.delayTime(this.addSheepTimeInterval),callFunc));

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
            this.pastTime += dt;
            this.shotPastTime += dt;
            if(this.pastTime >= this.addSheepTimeInterval){
                this.getSheepsToGame(this,this);
                this.pastTime = 0;
            }
            if(this.shotPastTime >= canShotInterval){
                this.shotPastTime = 0;
                canShot = true;
            }
            //this.currentTime -= dt;
            //if(this.currentTime <0)
            //    this.currentTime = 0;
            //if(this.currentTime == 0)
            //    this.timeUp();

            for(var i = 0; i < this.sheepsInGame.length; i++){
                var sheep = this.sheepsInGame[i];
                if(sheep.isMoving()){
                    sheep.step(dt);
                    if(sheep.isSheepSlipped()){
                        this.slippedNum++;
                        sheep.reset();
                    }
                }
            }

            for(var i = 0; i < this.arrowsInGame.length; i++){
                var arrow = this.arrowsInGame[i];
                if(arrow.isVisible()){
                    var r = arrow.getRotation()*Math.PI/180;
                    var newx = arrow.getPositionX()+Math.cos(r)*arrowSpeed*dt;
                    var newy = arrow.getPositionY()-Math.sin(r)*arrowSpeed*dt;
                    arrow.setPosition(newx,newy);
                    this.hittestsheep(arrow);

                    if(newx < - 100 || newx > cc.winSize.width+100 || newy < -100 || newy > cc.winSize.height+100){
                        arrow.setVisible(false);
                    }
                }
            }
        }
    },

    hittestsheep:function(arrow){
        for(var i = 0; i < this.sheepsInGame.length; i++){
            var sheep = this.sheepsInGame[i];
            if(sheep.isMoving()){
                if(sheep.hittestArrow(arrow)){
                    sheep.shotted();
                    arrow.setVisible(false);
                    playerScore++;
                    return;
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
        playerScore = 0;
        this.sheepsInGame = new Array();
        this.slippedNum = 0;
    },

    createNewGame:function(){
        this.sheepsInGame = new Array();
        playerScore = 0;
        this.slippedNum = 0;


        state = kGaming;
    },

    gameEnd:function(){
        state = kGameEnded;

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