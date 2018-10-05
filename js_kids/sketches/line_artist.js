// #SKETCHNAME Line artist
var lines = [ ];
var colors = ['Crimson', 'OrangeRed', 'Orange', 'Purple', 'LimeGreen', 'SteelBlue', 'Chocolate', 'Brown', 'SlateGray'];
var currColor = 0;

var altLines = [];

var mode = 0;

var px;
var py;

function loop()
{
    clear();
    drawLines();
    
    drawCurrent();
    
    displayStatus();
}

function keyPressed()
{
    if (keyCode == LEFT_ARROW && currColor > 0)
    {
        currColor--;
    }
    else if (keyCode == RIGHT_ARROW && currColor < colors.length - 1)
    {
        currColor++;
    }
    else if (key == 'Z')
    {
        undo();
    }
    else if (key == 'Y')
    {
        redo();
    }
}

function undo()
{
    var o = lines.pop();
    if (o)
    {
        altLines.push(o);
    }
}

function redo()
{
    var o = altLines.pop();
    if (o)
    {
        lines.push(o);
    }
}

function mouseClicked()
{
    if (mode == 0)
    {
       px = mouseX;
       py = mouseY;
       
       mode = 1;
    }
    else if (mode == 1)
    {
        lines.push( { x1 : px, y1 : py, x2 : mouseX, y2 : mouseY, c : colors[currColor] } );
        altLines = [];
        
        mode = 0;
    }
}

function drawLines()
{
    for(var o of lines)
    {
        stroke(0);
        strokeWeight(5);
        
        stroke(o.c);
        fill(o.c);
        drawSegment(o.x1, o.y1, o.x2, o.y2);
    }
}

function drawCurrent()
{
    if (mode == 1)
    {
        stroke(0);
        strokeWeight(1);
        
        stroke(0);
        fill(0);
        drawSegment(px, py, mouseX, mouseY);
    }
}

function drawSegment(x1, y1, x2, y2)
{
    line(x1, y1, x2, y2);
    
    circle(x1, y1, 5);
    circle(x2, y2, 5);
}

function displayStatus()
{
    noStroke();

    fill(0);
    var msg = int(mouseX) + " x " + int(mouseY);
    text(msg, 35, height - 10);
    text("LEFT, RIGHT arrows - select color", 10, height - 65);
    text("Z - undo", 10, height - 50);
    text("Y - redo", 10, height - 35);

    fill(colors[currColor]);
    rect(10, height - 20, 20, 10);
}
