
var shapes = [];
var selected = -1;

var move = false;
var dx = 0;
var dy = 0;


function enter()
{
    // Draw bear face
    addCircle(400, 300, 200, "papayawhip");
    
    // Draw left year
    addCircle(250, 100, 50, "moccasin");
    addCircle(270, 122, 20, "tan");
    
    // Draw right year
    addCircle(550, 100, 50, "moccasin");
    addCircle(530, 122, 20, "tan");
    
    // Draw left eye
    addCircle(300, 220, 30);
    addCircle(315, 230, 10, "darkgray");
    
    // Draw right eye
    addCircle(500, 220, 30);
    addCircle(485, 230, 10, "darkgray");
    
    // Draw nose
    addCircle(400, 400, 90, "wheat");
    addCircle(400, 350, 20, "sandybrown");
    
    // Draw mouth
    addRect(390, 420, 20, 50, "pink");
}

function loop()
{
    clear();
    
    moveSelected();
    displayShapes();
    displayInstructions()
}


function moveSelected()
{
    move = move && mouseIsPressed && selected != -1;
    
    if (move)
    {
        shapes[selected].x = mouseX - dx;
        shapes[selected].y = mouseY - dy;
    }
    else
    {
        move = mouseIsPressed;
        selected = findShape(mouseX, mouseY);

        if (selected != -1)
        {
            dx = mouseX - shapes[selected].x;
            dy = mouseY - shapes[selected].y;
        }
    }
}

function displayShapes()
{
    for(var i = 0; i < shapes.length; i++)
    {
        var o = shapes[i];
        
        stroke(i == selected ? "red" : "black");
        strokeWeight(1);
        fill(o.color);
        
        if (o.type == "rect")
        {
            rect(o.x, o.y, o.width, o.height);
        }
        else if (o.type == "circle")
        {
            circle(o.x, o.y, o.radius);
        }
    }
}

function findShape(x, y)
{
    for(var i = shapes.length - 1; i >= 0; i--)
    {
        var o = shapes[i];
        if (o.type == "circle")
        {
            if (collisionPointCircle(x, y, o.x, o.y, o.radius))
                return i
        }
        else if (o.type == "rect")
        {
            if (collisionPointRect(x, y, o.x, o.y, o.width, o.height))
                return i;
        }
    }
    
    return -1;
}

function addRect(x, y, width, height, color)
{
    shapes.push({
        type : "rect",
        x : x,
        y : y,
        width : width,
        height : height,
        color : color || "white"
    });
}

function addCircle(x, y, radius, color)
{
    shapes.push({
        type : "circle",
        x : x,
        y : y,
        radius : radius,
        color : color || "white"
    });
}

function displayInstructions()
{
    fill(0);
    noStroke();
    text('Use your mouse to move the shapes...', 10, height - 10);
}
