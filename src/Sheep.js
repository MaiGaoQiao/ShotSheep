var Sheep = cc.Node.extend({
    skin:null,
    life:100,
    speed:60,
    state:kSheepUNKNOW,
    road:ROAD0,
    radius:40,
    type:BLUE_SHEEP,
    runAnimationName:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.skin = new cc.Sprite();
        this.skin.setAnchorPoint(cc.p(0.5,0));
        this.addChild(this.skin);
        this.setRoad(ROAD0);
        this.setPositionX(-100);
        this.runAnimationName = "bsheeprun";
        return true;
    },

    hittestArrow:function(arrow){
        var centerx = this.getPositionX();
        var centery = this.getPositionY()+this.radius;
        //var dx = centerx - arrow.getPositionX();
        //var dy = centery - arrow.getPositionY();
        //
        //var dist = Math.sqrt(dx*dx+dy*dy);
        //if(dist < this.radius + arrowLength/2){
        //    return true;
        //}
        //return false;

        var arrowRadians = arrow.getRotation()*Math.PI/180;

        var a1X = arrow.getPositionX()+Math.cos(arrowRadians)*arrowLength/2;
        var a1Y = arrow.getPositionY()-Math.sin(arrowRadians)*arrowLength/2;

        var a2X = arrow.getPositionX()+Math.cos(arrowRadians+Math.PI)*arrowLength/2;
        var a2Y = arrow.getPositionY()-Math.sin(arrowRadians+Math.PI)*arrowLength/2;

        return this.intersectCircleLine(cc.p(centerx,centery),this.radius,cc.p(a1X,a1Y),cc.p(a2X,a2Y))


    },

    reset:function(){
        this.setState(kSheepUNKNOW);
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

    setType:function(t){
        this.type = t;
        if(this.type == BLUE_SHEEP){
            this.runAnimationName = "bsheeprun";
        }else if(this.type == RED_SHEEP){
            this.runAnimationName = "rsheeprun";
        }else{
            this.runAnimationName = "gsheeprun";
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
            var newX = this.getPositionX() + this.speed*dt;
            this.setPosition(newX,this.getPositionY());
        }
    },

    run:function(direction){
        if(direction == RUN_LEFT)
            this.skin.flippedX = false;
        else
            this.skin.flippedX = true;
        this.setState(kSheepRun);
    },

    dyingDone:function(sender,s){
        this.setState(kSheepUNKNOW);
    },

    setState:function(stateValue){
        if(this.state == stateValue) return;
        this.skin.setOpacity(255);
        this.setVisible(true);
        this.skin.setVisible(true);
        this.state = stateValue;
        switch(this.state){
            case kSheepUNKNOW:
                this.skin.stopAllActions();
                this.setPosition(-100,this.getPositionY());
                this.setVisible(true);
                this.skin.setVisible(true);
                this.skin.setOpacity(255);
                this.life = 100;
                this.setRoad(ROAD0);
                break;
            case kSheepDie:
                var runAnimation = cc.animationCache.getAnimation(this.runAnimationName);
                this.skin.runAction(cc.repeatForever(cc.animate(runAnimation)));
                this.skin.stopAllActions();
                this.skin.runAction(cc.sequence(cc.fadeOut(1.0),new cc.callFunc(this.dyingDone,this,this)));
                break;
            case kSheepRun:
                this.skin.stopAllActions();
                var runAnimation = cc.animationCache.getAnimation(this.runAnimationName);
                this.skin.runAction(cc.repeatForever(cc.animate(runAnimation)));
                break;
        }
    },

    intersectCircleLine:function(c, r, a1, a2) {
        //var result;
        var a  = (a2.x - a1.x) * (a2.x - a1.x) +
            (a2.y - a1.y) * (a2.y - a1.y);
        var b  = 2 * ( (a2.x - a1.x) * (a1.x - c.x) +
            (a2.y - a1.y) * (a1.y - c.y)   );
        var cc = c.x*c.x + c.y*c.y + a1.x*a1.x + a1.y*a1.y -
            2 * (c.x * a1.x + c.y * a1.y) - r*r;
        var deter = b*b - 4*a*cc;

        if ( deter < 0 ) {
            return false;
        } else if ( deter == 0 ) {
            return false;
            // NOTE: should calculate this point
        } else {
            var e  = Math.sqrt(deter);
            var u1 = ( -b + e ) / ( 2*a );
            var u2 = ( -b - e ) / ( 2*a );

            if ( (u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1) ) {
                if ( (u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1) ) {
                    return false;
                } else {
                    return true;
                }
            } else {
                //if ( 0 <= u1 && u1 <= 1)
                //    result.points.push( a1.lerp(a2, u1) );
                //
                //if ( 0 <= u2 && u2 <= 1)
                //    result.points.push( a1.lerp(a2, u2) );
                return true;
            }
        }
        return false;
    }
});