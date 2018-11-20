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

// Use functions from a different scene
function require(sceneNameOrIndex)
{
    return oSketch.require(sceneNameOrIndex);
}

// Repeats the specified function / lambda n times
function repeat(n, fn)
{
    for(var i = 0; i < n; i++)
    {
        fn(i);
    }
}

// inspect the last element of an array
Array.prototype.peek = function() 
{
    var n = this.length;
    if (n == 0) 
        return undefined;

    return this[n - 1];
}

// clears an array
Array.prototype.clear = function()
{
    this.length = 0;
}

// Overwrite the p5.print function to make it write into the text layer
p5.prototype.print = function()
{
    var htmlElements = HtmlElements();
    htmlElements.print(...arguments);
}

// Similar to print, but adds an "LF" at the end
p5.prototype.println = function()
{
    print(...arguments, "\n");
}

// Overwrite the document.write function
document.write = function()
{
    print(...arguments);
}


// Get a random int between min and max (both included)
function randomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


// Returns a random char between chr1 and chr2 (both included)
function randomChar(chr1, chr2)
{
    var code1 = chr1.charCodeAt(0);
    var code2 = chr2.charCodeAt(0);
    
    var code = randomInt(code1, code2);
    
    return String.fromCharCode(code);
}

// based on https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
Array.prototype.shuffle = function()
{
    for (var i = this.length - 1; i > 0; i--) 
    {
        var j = randomInt(0, i);
        
        var x = this[i];
        this[i] = this[j];
        this[j] = x;
    }
}

// Draw a circle at coordinates x, y of radius r
p5.prototype.circle = function(x, y, r)
{
    this.ellipse(x, y, r * 2);
}

// Draw sprite specified by name at specified position and scale (or middle of screen if not specified)
function sprite(spriteName, x, y, scale)
{
    var spriteBuilder = SpriteBuilder( oSketch._AssetsData, oSketch._AssetsCache );
    var oSprite = spriteBuilder.getSprite(spriteName, x, y, scale);
    
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
    //drawSprite(oSprite);

    return oSprite;
}


// Defines a rectangular clip region at specified coordinates. Only drawings inside this region are visible
// Use this between push() ... and  ... pop()
function clip(x, y, w, h)
{
    var scene = oSketch.getCurrentScene();
    if (!scene)
        return;
    
    var buff = scene.oSceneData.ScreenBuffer || window;
    if (!buff)
        return;

    var ctx = buff.drawingContext;

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
}


// Plays the specified sound file
function sound(soundName)
{
    var oSoundData = oSketch._AssetsData.getSound(soundName);
    if (oSoundData == null)
        return null;

    var path = oSoundData.File;
    if (path == null)
        return null;

    var snd = oSketch._AssetsCache.getSound(path);
    snd.play();

    return snd;
}


// Plays the specified sound file in a loop
// A new invokation of the function, will stop the current music and start the new one
function music(soundName)
{
    var oSoundData = oSketch._AssetsData.getMusic(soundName);
    if (oSoundData == null)
        return null;

    var path = oSoundData.File;
    if (path == null)
        return null;

    if (sketchMusic != null)  // global variable
        sketchMusic.stop();

    sketchMusic = oSketch._AssetsCache.getSound(path);
    if (sketchMusic)
    {
        sketchMusic.setLoop(true);
        sketchMusic.play();
    }

    return sketchMusic;
}

// based on article from http://marcgg.com/blog/2016/11/01/javascript-audio/
function beep(note, tFromNow, duration)
{
    var noteValues = {
        'C0': 16.35,
        'C#0': 17.32,
        'Db0': 17.32,
        'D0': 18.35,
        'D#0': 19.45,
        'Eb0': 19.45,
        'E0': 20.60,
        'F0': 21.83,
        'F#0': 23.12,
        'Gb0': 23.12,
        'G0': 24.50,
        'G#0': 25.96,
        'Ab0': 25.96,
        'A0': 27.50,
        'A#0': 29.14,
        'Bb0': 29.14,
        'B0': 30.87,
        'C1': 32.70,
        'C#1': 34.65,
        'Db1': 34.65,
        'D1': 36.71,
        'D#1': 38.89,
        'Eb1': 38.89,
        'E1': 41.20,
        'F1': 43.65,
        'F#1': 46.25,
        'Gb1': 46.25,
        'G1': 49.00,
        'G#1': 51.91,
        'Ab1': 51.91,
        'A1': 55.00,
        'A#1': 58.27,
        'Bb1': 58.27,
        'B1': 61.74,
        'C2': 65.41,
        'C#2': 69.30,
        'Db2': 69.30,
        'D2': 73.42,
        'D#2': 77.78,
        'Eb2': 77.78,
        'E2': 82.41,
        'F2': 87.31,
        'F#2': 92.50,
        'Gb2': 92.50,
        'G2': 98.00,
        'G#2': 103.83,
        'Ab2': 103.83,
        'A2': 110.00,
        'A#2': 116.54,
        'Bb2': 116.54,
        'B2': 123.47,
        'C3': 130.81,
        'C#3': 138.59,
        'Db3': 138.59,
        'D3': 146.83,
        'D#3': 155.56,
        'Eb3': 155.56,
        'E3': 164.81,
        'F3': 174.61,
        'F#3': 185.00,
        'Gb3': 185.00,
        'G3': 196.00,
        'G#3': 207.65,
        'Ab3': 207.65,
        'A3': 220.00,
        'A#3': 233.08,
        'Bb3': 233.08,
        'B3': 246.94,
        'C4': 261.63,
        'C#4': 277.18,
        'Db4': 277.18,
        'D4': 293.66,
        'D#4': 311.13,
        'Eb4': 311.13,
        'E4': 329.63,
        'F4': 349.23,
        'F#4': 369.99,
        'Gb4': 369.99,
        'G4': 392.00,
        'G#4': 415.30,
        'Ab4': 415.30,
        'A4': 440.00,
        'A#4': 466.16,
        'Bb4': 466.16,
        'B4': 493.88,
        'C5': 523.25,
        'C#5': 554.37,
        'Db5': 554.37,
        'D5': 587.33,
        'D#5': 622.25,
        'Eb5': 622.25,
        'E5': 659.26,
        'F5': 698.46,
        'F#5': 739.99,
        'Gb5': 739.99,
        'G5': 783.99,
        'G#5': 830.61,
        'Ab5': 830.61,
        'A5': 880.00,
        'A#5': 932.33,
        'Bb5': 932.33,
        'B5': 987.77,
        'C6': 1046.50,
        'C#6': 1108.73,
        'Db6': 1108.73,
        'D6': 1174.66,
        'D#6': 1244.51,
        'Eb6': 1244.51,
        'E6': 1318.51,
        'F6': 1396.91,
        'F#6': 1479.98,
        'Gb6': 1479.98,
        'G6': 1567.98,
        'G#6': 1661.22,
        'Ab6': 1661.22,
        'A6': 1760.00,
        'A#6': 1864.66,
        'Bb6': 1864.66,
        'B6': 1975.53,
        'C7': 2093.00,
        'C#7': 2217.46,
        'Db7': 2217.46,
        'D7': 2349.32,
        'D#7': 2489.02,
        'Eb7': 2489.02,
        'E7': 2637.02,
        'F7': 2793.83,
        'F#7': 2959.96,
        'Gb7': 2959.96,
        'G7': 3135.96,
        'G#7': 3322.44,
        'Ab7': 3322.44,
        'A7': 3520.00,
        'A#7': 3729.31,
        'Bb7': 3729.31,
        'B7': 3951.07,
        'C8': 4186.01
    }

    var freq = (typeof note === "number") ? note : noteValues[note];
    if (!freq)
        freq = 100;

    var context = p5.prototype.getAudioContext();
    var o = context.createOscillator();
    var g = context.createGain();
    o.type = "sine";
    o.connect(g);
    o.frequency.value = freq;
    g.connect( context.destination );

    g.gain.value = 0;
    o.start( 0 );

    duration = duration || 0.1;

    var t = context.currentTime + (tFromNow || 0);
    g.gain.setValueAtTime(1, t);
    //g.gain.exponentialRampToValueAtTime(0.00001, t + duration);
    g.gain.linearRampToValueAtTime(0, t + duration );

    o.stop( t + duration * 2 );
}


// Load a text from specified url...
function loadText(url, onSuccess, onError)
{
    fetch(url)
        .then(function(response) { 
                return response.text();
            } )
        .then(function(text) { 
            if (onSuccess) 
                onSuccess(text); 
            } )
        .catch(function(error) {
            if (onError)
                onError(error)
        });
}

function collisionPointCircle(pointX, pointY, circleX, circleY, circleR)
{
    return p5.prototype.dist(pointX, pointY, circleX, circleY) <= circleR;
}

function collisionCirclePoint(circleX, circleY, circleR, pointX, pointY)
{
    return collisionPointCircle(pointX, pointY, circleX, circleY, circleR);
}

function collisionCircleCircle(circle1X, circle1Y, circle1R, circle2X, circle2Y, circle2R)
{
    return p5.prototype.dist(circle1X, circle1Y, circle2X, circle2Y) <= circle1R + circle2R;
}

// algorithm from https://yal.cc/rectangle-circle-intersection-test/
function collisionCircleRect(circleX, circleY, circleR, rectX, rectY, rectWidth, rectHeight)
{
    var px = max(rectX, min(circleX, rectX + rectWidth));
    var py = max(rectY, min(circleY, rectY + rectHeight));

    return p5.prototype.dist(px, py, circleX, circleY) < circleR;
}

function collisionRectCircle(rectX, rectY, rectWidth, rectHeight, circleX, circleY, circleR)
{
    return collisionCircleRect(circleX, circleY, circleR, rectX, rectY, rectWidth, rectHeight);
}

function collisionPointRect(pointX, pointY, rectX, rectY, rectWidth, rectHeight)
{
    return pointX > rectX && pointX < rectX + rectWidth &&
            pointY > rectY && pointY < rectY + rectHeight;
}

function collisionRectPoint(rectX, rectY, rectWidth, rectHeight, pointX, pointY)
{
    return collisionPointRect(pointX, pointY, rectX, rectY, rectWidth, rectHeight);
}

// algorithm from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collisionRectRect(rect1X, rect1Y, rect1Width, rect1Height, rect2X, rect2Y, rect2Width, rect2Height)
{
    return (rect1X < rect2X + rect2Width &&
       rect1X + rect1Width > rect2X &&
       rect1Y < rect2Y + rect2Height &&
       rect1Y + rect1Height > rect2Y);
}

function createEdit(x, y, w, h)
{
    var htmlElements = HtmlElements();
    return htmlElements.createEdit(x, y, w, h);
}

function createButton(x, y, w, h)
{
    var htmlElements = HtmlElements();
    return htmlElements.createButton(x, y, w, h);
}
