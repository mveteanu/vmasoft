

// GlobalVars object used from within the code of the scenes...
var GlobalVars = {};

// Show the scene specified by name or index
function showScene(sceneNameOrIndex, args)
{
    oSketch.showScene(sceneNameOrIndex, args);
}

// Show the next scene in the scenes array
function showNextScene(args)
{
    oSketch.showNextScene(args);
}

// Obtain the public variables of the specified scene
function getPublicVars(sceneNameOrIndex)
{
    return oSketch.getPublicVars(sceneNameOrIndex);
}

// Draw a circle at coordinates x, y of radius r
function circle(x, y, r)
{
    ellipse(x, y, r, r);
}

function sprite(spriteName)
{

}
