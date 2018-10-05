// #SKETCHNAME Random shapes
var noShapes = 1;

var arFunctions = [ randomLine1, randomLine2, randomLine3, randomCircle, randomRect, randomTriangle, randomEllipse, randomChar ];
var currFunction = 0;

function loop()
{
    drawFrame();
}

function mouseClicked()
{
    clear();
    currFunction = (currFunction + 1) % arFunctions.length;
}


function drawFrame()
{
    var fn = arFunctions[ currFunction ];
    
    for(var i = 0; i < noShapes; i++)
    {
        fn();
    }
}

function randomLine1()
{
    var y = random(height);
    
    stroke(random(255), random(255), random(255));
    line(0, y, width, y);
}

function randomLine2()
{
    var x = random(width);
    
    stroke(random(255), random(255), random(255));
    line(x, 0, x, height);
}

function randomLine3()
{
    var x1 = random(width);
    var y1 = random(height);
    
    var x2 = random(width);
    var y2 = random(height);
    
    stroke(random(255), random(255), random(255));
    line(x1, y1, x2, y2);
}


function randomCircle()
{
    var x = random(width);
    var y = random(height);
    
    var r = random(100);
    
    stroke(random(255), random(255), random(255));
    circle(x, y, r);
}


function randomEllipse()
{
    var x = random(width);
    var y = random(height);
    
    var d1 = random(100);
    var d2 = random(100);
    
    stroke(random(255), random(255), random(255));
    ellipse(x, y, d1, d2);
}


function randomRect()
{
    var x = random(width);
    var y = random(height);
    
    var w = random(100);
    var h = random(100);
    
    stroke(random(255), random(255), random(255));
    rect(x, y, w, h);
}


function randomTriangle()
{
    var x = random(width);
    var y = random(height);
    
    var dx1 = random(-100, 0);
    var dy1 = random(100);

    var dx2 = random(100);
    var dy2 = random(100);

    stroke(random(255), random(255), random(255));
    triangle(x, y, x + dx1, y + dy1, x + dx2, y + dy2);
}


function randomChar()
{
    var chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var char = random(chars);
    
    var x = random(width);
    var y = random(height);

    var size = random(5, 25);
    
    stroke(random(255), random(255), random(255));
    textSize(size);
    text(char, x, y)
}
