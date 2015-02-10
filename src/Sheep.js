




var Sheep = cc.Node.extend({
    skin:null,
    life:100,
    speed:1,
    state:kSheepUNKNOW,
    road:ROAD0,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.skin = new cc.Sprite();
        this.skin.setAnchorPoint(cc.p(0.5,0));
        this.addChild(this.skin);
        this.setRoad(ROAD0);
        this.setPositionX(-100);
        return true;
    },

    reset:function(){
        this.life = 100;
        this.setState(kSheepUNKNOW);
        this.setRoad(ROAD0);
        this.setPositionX(-100);
    },

    shotted:function(){
        this.setLife(0);
    },

    setLife:function(newLifeValue){
        this.life = newLifeValue;
        if(this.life <= 0) {
            this.life = 0;
            this.setState(kSheepDie);
            //改变血条长度
        }
    },

    setRoad:function(roadValue){
        this.road = roadValue;
        var y = 0;
        if(this.road == ROAD0)
            y = cc.winSize.height - 200;
        else if(this.road == ROAD1)
            y = cc.winSize.height - 300;
        else
            y = cc.winSize.height - 400;
        this.setPositionY(y);
    },

    isMoving:function(){
        if(this.state == kSheepRun){
            return true;
        }
        return false;
    },

    isSheepSlipped:function(){
        if(this.getPositionX() > cc.winSize.width+100){
            return true;
        }
        return false;
    },

    step:function(dt){
        if(this.state == kSheepRun){
            var newX = this.getPositionX() + this.speed;

            this.setPosition(newX,this.getPositionY());
        }
    },

    run:function(){
        this.setState(kSheepRun);
    },

    setState:function(stateValue){
        if(this.state == stateValue) return;

        this.state = stateValue;
        switch(this.state){
            case kSheepUNKNOW:
                this.skin.stopAllActions();
                break;
            case kSheepDie:
                var runAnimation = cc.animationCache.getAnimation("sheep1die");
                this.skin.runAction(cc.repeatForever(cc.animate(runAnimation)));
                break;
            case kSheepRun:
                var runAnimation = cc.animationCache.getAnimation("sheep1run");
                this.skin.runAction(cc.repeatForever(cc.animate(runAnimation)));
                break;
        }
    }

});