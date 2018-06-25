
var oSketch;

var _oBackgroundsAssets;
var _oSpritesAssets;
var _oSoundsAssets;
var _oMusicAssets;

function preload()
{
    _oBackgroundsAssets = loadJSON("assets/backgrounds.json");
    _oSpritesAssets = loadJSON("assets/sprites.json");
    _oSoundsAssets = loadJSON("assets/sounds.json");
    _oMusicAssets = loadJSON("assets/music.json");
}

function setup()
{
    var btn = document.getElementById("btnRun");
    btn.onclick = handleButtonRun;

    createCanvas(600, 300);

    oSketch = Sketch();
    oSketch.wire();
    oSketch.addScenesFromHtml("sketch");
    oSketch.run();
}

function handleButtonRun(e)
{
    oSketch.reset();
    oSketch.addScenesFromHtml("sketch");
    oSketch.run();

    e.cancelBubble = true;
}
