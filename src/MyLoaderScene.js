/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
/**
 * <p>cc.LoaderScene is a scene that you can load it when you loading files</p>
 * <p>cc.LoaderScene can present thedownload progress </p>
 * @class
 * @extends cc.Scene
 * @example
 * var lc = new cc.LoaderScene();
 */

var logoData = "data:image/png;base64,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";
MyLoaderScene = cc.Scene.extend({
    _interval : null,
    _label : null,
    _className:"LoaderScene",
    /**
     * Contructor of cc.LoaderScene
     * @returns {boolean}
     */
    init : function(){
        var self = this;

        //logo
        var logoWidth = 640;
        var logoHeight = 1024;

        // bg
        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
        bgLayer.setPosition(cc.visibleRect.bottomLeft);
        self.addChild(bgLayer, 0);

        //image move to CCSceneFile.js
        var fontSize = 32, lblHeight =  -logoHeight / 2 + 100;
        if(logoData){
            //loading logo
            cc.loader.loadImg(logoData, {isCrossOrigin : false }, function(err, img){
                logoWidth = img.width;
                logoHeight = img.height;
                self._initStage(img, cc.visibleRect.center);
            });
            fontSize = 32;
            lblHeight = -logoHeight / 2;
        }
        //loading percent
        var label = self._label = new cc.LabelTTF("加载中... 0%", "Arial", fontSize);
        label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight+60)));
        label.setColor(cc.color(255, 255, 255));
        self.addChild(this._label, 10);
        return true;
    },

    _initStage: function (img, centerPos) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var logo = self._logo = new cc.Sprite(texture2d);
        logo.setScale(cc.contentScaleFactor());
        logo.x = centerPos.x;
        logo.y = centerPos.y;
        self._bgLayer.addChild(logo, 10);
    },
    /**
     * custom onEnter
     */
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    },
    /**
     * custom onExit
     */
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Loading... 0%";
        this._label.setString(tmpStr);
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     */
    initWithResources: function (resources, cb) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self._label.setString("加载中... " + percent + "%");
            }, function () {
                if (self.cb)
                    self.cb();
            });
    }
});
/**
 * <p>cc.LoaderScene.preload can present a loaderScene with download progress.</p>
 * <p>when all the resource are downloaded it will invoke call function</p>
 * @param resources
 * @param cb
 * @returns {cc.LoaderScene|*}
 * @example
 * //Example
 * cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new HelloWorldScene());
    }, this);
 */
MyLoaderScene.preload = function(resources, cb){
    var _myLoaderScene = null;
    if(!_myLoaderScene) {
        _myLoaderScene = new MyLoaderScene();
        _myLoaderScene.init();
    }
    _myLoaderScene.initWithResources(resources, cb);

    cc.director.runScene(_myLoaderScene);
    return _myLoaderScene;
};