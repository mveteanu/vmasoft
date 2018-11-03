// #SKETCHNAME Logo
var turtle;
initTurtle();

var ar = [
        ()=>{plant(100, 0)},
        spiral, 
        sawblade, 
        ()=>{snowflake(200, 4)},
        ()=>{triangle_fractal(200, 4)},
        square_flower,
        spiro
    ];

function loop()
{
    clear();
    initTurtle();
    
    var x = constrain(mouseX, 0, width - 1);
    var n = round(map(x, 0, width - 1, 0, ar.length - 1));
    
    ar[n]();
    
    text(n + 1 + " / " + ar.length + " (move mouse to change the drawing).", 10, height - 10);
}

// -----------------

// Examples from: http://fmslogo.sourceforge.net/workshop/

function spiral()
{
    repeat(100, (repcount)=>{
        forward(repcount * 2);
        right(90);
    });
}


function sawblade()
{
    repeat(12, ()=>{
        sawtooth();
        right(30);
    });
    
    function sawtooth()
    {
        right(45);
        forward(56.56);
        left(135);
        forward(40);
        right(90);
    }
}


// snowflake(200, 4);
function snowflake(length, depth)
{
    repeat(3, ()=>{
        snowflake_side(length, depth);
        right(120);
    });
    
    function snowflake_side(length, depth)
    {
        if (depth == 0)
        {
            forward(length);
            return;
        }
        
        snowflake_side(length / 3, depth - 1);
        
        left(60);
        snowflake_side(length / 3, depth - 1);
        
        right(120);
        snowflake_side(length / 3, depth - 1);
        
        left(60);
        snowflake_side(length / 3, depth - 1);
    }
}


//plant(100, 0);
function plant(size, angle)
{
    if(size < 1)
        return;
        
    right(angle);
    forward(size);
    
    repeat(4, ()=>{
        plant(size / 2, random(160) - 80);
    });
    back(size);
    left(angle);
}


// triangle_fractal(200, 4);
function triangle_fractal(length, depth)
{
    if(depth == 0)
    {
        forward(length);
        return;
    }
    
    repeat(3, ()=>{
        forward(length / 3);
        triangle_fractal(length / 3, depth - 1);
        forward(length / 3);
        
        right(120);
    });
}


function square_flower()
{
    repeat(18, ()=>{
        square();
        right(20);
    });
}


function square()
{
    forward(100);
    left(90);
    forward(100);
    left(90);
    forward(100);
    left(90);
    forward(100);
}


function spiro()
{
    repeat(30, ()=>{
        forward(100);
        right(156);
    });
}

// ------------------

function initTurtle()
{
    if (!turtle)
        turtle = {};
    
    turtle.x = width / 2;
    turtle.y = height / 2;
    turtle.angle = 0;
    
    turtle.pen = true;
    turtle.pencolor = "Black";
}

function setpencolor(pencolor)
{
    turtle.pencolor = pencolor;
}

function pendown()
{
    turtle.pen = true;
}

function penup()
{
    turtle.pen = false;
}

function repeat(n, fn)
{
    for(var i = 0; i < n; i++)
    {
        fn(i);
    }
}

function setXY(x, y)
{
    turtle.x = x;
    turtle.y = y;
}

function left(angle)
{
    turtle.angle -= angle;
}

function right(angle)
{
    turtle.angle += angle;
}

function forward(d)
{
    // apply -90 correction since in logo 0 degrees is up
    var x2 = turtle.x + d * cos(turtle.angle - 90);
    var y2 = turtle.y + d * sin(turtle.angle - 90);
    
    if (turtle.pen)
    {
        stroke(turtle.pencolor);
        line(turtle.x, turtle.y, x2, y2);
    }
    
    turtle.x = x2;
    turtle.y = y2;
}

function back(d)
{
    forward(-d);
}
