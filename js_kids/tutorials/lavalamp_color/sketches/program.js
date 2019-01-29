// #SKETCHNAME Lava lamp
// Color lava lamp with metaballs
const w = 80;
const h = 60;
const displayStyle = 2;

var mult = 900;
var scaleX = width / w;
var scaleY = height / h;

colorMode(HSB);
noStroke();

var balls = [];

function enter()
{
    for(var i = 0; i < 5; i++)
    {
        balls.push({ x : random(w), y : random(h), dx : random(1, 2), dy : random(1,2)});
    }
}

function loop()
{
    update();
    display();
}

function update()
{
    for(var b of balls)
    {
        b.x += b.dx;
        b.y += b.dy;
        
        if (b.x > w || b.x < 0)
            b.dx *= -1;
            
        if (b.y > h || b.y < 0)
            b.dy *= -1;
    }
}

function display()
{
    for(var x = 0; x < w; x++)
    {
        for(var y = 0; y < h; y++)
        {
            var sum = 0;
            
            for(var b of balls)
            {
                sum += 1 / dist(x, y, b.x, b.y);
            }

            var col = mult * sum;
            displayDot(x, y, col);
        }
    }
}

function displayDot(x, y, col)
{
    fill(col, 255, 255);
    
    switch(displayStyle)
    {
        case 0:
            rect(x, y, 1, 1);
            break;
        case 1:
            rect(x * scaleX, y * scaleY, scaleX, scaleY);
            break;
        case 2:
            ellipse(x * scaleX + scaleX / 2, y * scaleY + scaleY / 2, scaleX, scaleY);
            break;
    }
}
