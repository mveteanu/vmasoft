

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


// Overwrite the document.write function
document.write = function(sText)
{
    console.log(sText);
}

// Draw sprite specified by name at specified positions (or middle of the screen if x and y are not specified)
function sprite(spriteName, x, y)
{
    var spriteBuilder = SpriteBuilder( oSketch._AssetsData, oSketch._AssetsCache );
    var oSprite = spriteBuilder.getSprite(spriteName, x, y);
    
    // TODO: Instead of returning null, I should return a generic sprite in order to avoid null errors in sketches
    if (oSprite == null)
        return null;

    var scene = oSketch.getCurrentScene();
    if (scene != null)
    {
        var oGroup = scene.spritesGroup;
        oSprite.addToGroup(oGroup);
    }

    // Draw the sprite imediately on the screen
    drawSprite(oSprite);

    return oSprite;
}

function sound(soundName)
{
    var oSoundData = oSketch._AssetsData.getSound(soundName);
    if (oSoundData == null)
        return;

    var path = oSoundData.File;
    if (path == null)
        return;

    var snd = oSketch._AssetsCache.getSound(path);
    snd.play();

    return snd;
}