
var oSketch;

var _oBackgroundsAssets;
var _oSpritesAssets;
var _oSoundsAssets;
var _oMusicAssets;

p5.disableFriendlyErrors = true;

// If OFFSCREEN_RENDERING variable is "false" (by default "false") then offscreen_rendering is used only for static scenes (e.g. without loop())
// ... but if this is true, all scenes will be rendered offscreen! -- potentially slower but will capture the static scene...
// Note: Another option to capture static scenes is to redirect p5.js functions to offscreen buffer before running the static scene (... and not use 'with' as of now)
var OFFSCREEN_RENDERING = window.location.href.indexOf("nobuffer") == -1;

var sketchCanvas;
var sketchMusic;

function preload()
{
    _oBackgroundsAssets = loadJSON("assets/backgrounds.json");
    _oSpritesAssets = loadJSON("assets/sprites.json");
    _oSoundsAssets = loadJSON("assets/sounds.json");
    _oMusicAssets = loadJSON("assets/music.json");
}

function setup()
{
    sketchCanvas = createCanvas(800, 600);
    parentCanvas(sketchCanvas);
    pixelDensity(1);

    oSketch = Sketch();
    oSketch.wire();

    if (window.OnSketchReady && typeof window.OnSketchReady === 'function')
        window.OnSketchReady(oSketch);

    // TODO: ... maybe use the next lines and add a <script language="sketch"> script
    // in the main code.html ?! ... or use the empty code mechanism from Sketch.js -> getSceneWrapper()

    // oSketch.addScenesFromHtml("sketch");
    // oSketch.run();
}


function parentCanvas(canvas)
{
    var div = document.getElementById("outputarea");
    if (!div)
        return;

    div.oncontextmenu = function(){
        return false;
    }

    canvas.parent(div.id);
}
