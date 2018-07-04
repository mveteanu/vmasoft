
var oSketch;

var _oBackgroundsAssets;
var _oSpritesAssets;
var _oSoundsAssets;
var _oMusicAssets;

// p5.disableFriendlyErrors = true;

function preload()
{
    _oBackgroundsAssets = loadJSON("assets/backgrounds.json");
    _oSpritesAssets = loadJSON("assets/sprites.json");
    _oSoundsAssets = loadJSON("assets/sounds.json");
    _oMusicAssets = loadJSON("assets/music.json");
}

function setup()
{
    // var btn = document.getElementById("btnRun");
    // btn.onclick = handleButtonRun;

    var canvas = createCanvas(800, 600);
    parentCanvas(canvas);
    pixelDensity(1);

    oSketch = Sketch();
    oSketch.wire();
    oSketch.addScenesFromHtml("sketch");
    oSketch.run();
}

function parentCanvas(canvas)
{
    var div = document.getElementById("outputarea");
    if (!div)
        return;

    canvas.parent(div.id);
}

// function handleButtonRun(e)
// {
//     oSketch.reset();
//     oSketch.addScenesFromHtml("sketch");
//     oSketch.run();

//     e.cancelBubble = true;
// }
