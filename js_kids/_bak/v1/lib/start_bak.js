
function preload()
{
    
}

function setup()
{
    createCanvas(600, 300);

    oSketch = Sketch();
    oSketch.wire();

    var scene1 = document.getElementById("Scene1").innerText;
    var scene2 = document.getElementById("Scene2").innerText;

    oSketch.addScene("Scene1", scene1);
    oSketch.addScene("Scene2", scene2);

    oSketch.showScene(0);
    //oSketch.showScene("Scene1");
    //oSketch.showNextScene();
}
