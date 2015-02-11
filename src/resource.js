var playerScore = 0;

var ROAD0 = 0;
var ROAD1 = 1;
var ROAD2 = 2;

var kSheepUNKNOW = 0;
var kSheepDie = 1;
var kSheepRun = 2;

var BLUE_SHEEP = 0;
var RED_SHEEP = 1;
var GREEN_SHEEP = 2;

var arrowSpeed = 720;
var arrowLength = 50;

var RUN_RIGHT = 0;
var RUN_LEFT = 1;

var res = {
    barFrame_png :"res/barFrame.png",
    urineBar_jpg : "res/urineBar.png",
    arrow_png : "res/arrow.png",
    shotPlatformbg_png : "res/shotPlatformbg.png",
    man_png : "res/man.png",
    homebg_png : "res/homebg.png",
    pausebg_png :"res/pausebg.png",
    pauseBt_png : "res/pauseBt.png",
    levelTipBg_png:"res/levelTipBg.png",
    star0_png : "res/star0.png",
    star1_png : "res/star1.png",
    endframe_png : "res/endframe.png",
    button_press_wav : "res/button_press.wav",
    restartButton_png : "res/restartButton.png",
    shareButton_png : "res/shareButton.png",
    right_png : "res/right.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}