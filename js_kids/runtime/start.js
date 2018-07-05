
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
    var canvas = createCanvas(800, 600);
    parentCanvas(canvas);
    pixelDensity(1);

    oSketch = Sketch();
    oSketch.wire();

    // TODO: ... maybe remove the next lines... or add a <script language="sketch"> script
    // in the main code.html ?!

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
