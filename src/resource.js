var playerScore = 0;
var playerAnswer = "";



var res = {
    barFrame_png :"res/barFrame.png",
    urineBar_jpg : "res/urineBar.png",
    man_png : "res/man.png",
    homebg_png : "res/homebg.png",
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