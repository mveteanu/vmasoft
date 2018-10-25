// #SKETCHNAME Pixel art
const noRows = 16;
const noCols = 16;
const squareSize = 25;

// pallete from http://eastfarthing.com/blog/2016-05-06-palette/
var pallete = ["#ffffff", "#3f32ae", "#e30ec2", "#baaaff", "#ff949d", "#e80200", "#7a243d", "#000000", "#195648", 
              "#6a8927", "#16ed75", "#32c1c3", "#057fc1", "#6e4e23", "#c98f4c", "#efe305"];

var map;

var buttons = [];
var foreColor = 1;
var backColor = 0;

var editorX = 50;
var editorY = 0;

var showNumbers = false;


function initMap()
{
    var map = new Array(noRows);
    for(var i = 0; i < noRows; i++)
    {
        var row = new Array(noCols);
        for(var j = 0; j < noCols; j++)
        {
            row[j] = 0;
        }
        map[i] = row;
    }
    
    return map;
}

function enter()
{
    addButtons();
    map = initMap();
}

function loop()
{
    clear();
    
    drawButtons();
    displayMap();
    displayInstructions();
    
    handleButtons();
    handleCellClick();
}

function keyPressed()
{
    showNumbers = (key == "Z") & !showNumbers;
}

function handleCellClick()
{
    if (!mouseIsPressed)
        return;
    
    var col = floor( (mouseX - editorX) / squareSize );
    var row = floor( (mouseY - editorY) / squareSize );

    if (col < 0 || col >= noCols 
        || row < 0 || row >= noRows)
        return;

    var color = mouseButton == LEFT ? foreColor : backColor;
    map[row][col] = color;
}

function displayMap()
{
    for(var row = 0; row < noRows; row++)
    {
        for(var col = 0; col < noCols; col++)
        {
            var cellX = editorX + col * squareSize;
            var cellY = editorY + row * squareSize;
            var color = map[row][col];
    
            fill(pallete[color]);
            stroke(0);
            rect(cellX, cellY, squareSize, squareSize);
            
            if (showNumbers)
            {
                textAlign(CENTER, CENTER);
                fill(0);
                noStroke();
                
                text(color, cellX + squareSize / 2, cellY + squareSize / 2);
            }
        }
    }
}


function displayInstructions()
{
    noStroke();
    fill(0);
    textAlign(LEFT, LEFT);
    
    text("Use LEFT / RIGHT mouse buttons to draw. Press Z to toggle numbers.", editorX, height - 10);
}


function addButtons()
{
    var w = floor(height / pallete.length);

    for(i = 0; i < pallete.length; i++)
    {
        var color = pallete[i];
        addButton(1, i * w, w, w, color);
    }
}


function addButton(x, y, w, h, color)
{
    var btn = { x : x, 
                y : y, 
                w : w,
                h : h,
                color : color
                };
                
    buttons.push(btn);
    
    return btn;
}



function handleButtons()
{
    if (!mouseIsPressed)
        return;
    
    for(var i = 0; i < buttons.length; i++)
    {
        var btn = buttons[i];
        
        if (collisionPointRect(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h))
        {
            if (mouseButton == LEFT)
                foreColor = i;
            else
                backColor = i;
        }
    }
}

function drawButtons()
{
    for(var btn of buttons)
    {
        drawButton(btn);
    }
}

function drawButton(btn)
{
    stroke(0);
    strokeWeight(1);

    fill(btn.color);
    rect(btn.x, btn.y, btn.w, btn.h);

    writeLabel(btn);
}

function writeLabel(btn)
{
    var t = "";
    
    if (btn.color == pallete[foreColor] )
    {
        t = "FG";
    }
    if (btn.color == pallete[backColor] )
    {
        t = t == "" ? "BG" : "F/BG";
    }

    fill("white");
    stroke("black")

    textAlign(CENTER, CENTER);
    text(t, btn.x + btn.w / 2, btn.y + btn.h / 2)
}
