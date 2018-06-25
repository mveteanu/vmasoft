
var oSketch;

function preload()
{
}

function setup()
{
    oSketch = Sketch();
    createCanvas(600, 300);

    oSketch.wire();
    oSketch.addScenesFromHtml("kidscript");
    oSketch.showScene(0);
    //oSketch.showScene("Scene1");
    //oSketch.showNextScene();
}
