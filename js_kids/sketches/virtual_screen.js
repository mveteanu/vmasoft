// #SKETCHNAME Virtual screen
var speed = 10;

var virtual = {
    width : 800 * 2,
    height : 600 * 2,
    viewx : 0,
    viewy : 0,
    objects : []
}

var balls = [];

var p = sprite('game.idle', 0.5);

addObjects();
addBalls();

function addBalls()
{
    for(var i = 0; i < 10; i++)
    {
        balls.push( { x : random(virtual.width), y : random(virtual.height), dx : random([-1, 1]), dy : random([-1, 1]) } );
    }
}

function displayBalls()
{
    for(var o of balls)
    {
        var coord = calculateCoordinates(o);
        if (coord)
        {
            fill("green")
            circle(coord.x, coord.y, 5);
        }
    }
}


function updateBalls()
{
    for(var o of balls)
    {
        o.x += o.dx;
        o.y += o.dy;

        if (o.x < 0 || o.x > virtual.width)
            o.dx *= -1;
        
        if (o.y < 0 || o.y > virtual.height)
            o.dy *= -1;
    }
}

function loop()
{
    clear();
    
    readKeys();
    
    display();
    
    updateBalls();
    displayBalls();
    
    text(virtual.viewx + " x " + virtual.viewy, 10, 10)
}

function readKeys()
{
    p.show("idle")
    
    if (keyIsDown(LEFT_ARROW))
    {
        p.show("walk")
        p.mirrorX(-1);
        
        if (p.x > width / 2)
        {
            p.x -= speed;
        }
        else if (virtual.viewx > 0)
        {
            virtual.viewx -= speed;
        }
        else
        {
            if (p.x >= 0)
                p.x -= speed;
        }
    }
    else if (keyIsDown(RIGHT_ARROW))
    {
        p.show("walk")
        p.mirrorX(1);
        
        if (p.x < width / 2)
        {
            p.x += speed;
        }
        else if (virtual.viewx < virtual.width - width)
        {
            virtual.viewx += speed;
        }
        else
        {
            if (p.x < width)
                p.x += speed;
        }
    } 
    
    if (keyIsDown(UP_ARROW))
    {
        p.show("walk")
        
        if (p.y > height / 2)
        {
            p.y -= speed;
        }
        else if (virtual.viewy > 0)
        {
            virtual.viewy -= speed;
        }
        else
        {
            if (p.y >= 0)
                p.y -= speed;
        }
    } 
    else if (keyIsDown(DOWN_ARROW))
    {
        p.show("walk")
        
        if (p.y < height / 2)
        {
            p.y += speed;
        }
        else if (virtual.viewy < virtual.height - height)
        {
            virtual.viewy += speed;
        }
        else
        {
            if (p.y < height)
                p.y += speed;
        }
    }
}

function addObjects()
{
    for(var i = 0; i < 100; i++)
    {
        var o = { x : random(virtual.width), y : random(virtual.height) };
        virtual.objects.push( o );
    }
}

function display()
{
    for(var o of virtual.objects)
    {
        var coord = calculateCoordinates(o);
        if (coord)
        {
            fill("white")
            circle(coord.x, coord.y, 5);
        }
    }
}

// calculates the coordinates where a certain object should be displayed
// returns coord object or null if the object is outside of the viewport
function calculateCoordinates(o)
{
    if (o.x >= virtual.viewx && o.x < virtual.viewx + width &&
        o.y >= virtual.viewy && o.y < virtual.viewy + height)
    {
        return { x : o.x - virtual.viewx, y : o.y - virtual.viewy }
    }
    
    return null;
}
