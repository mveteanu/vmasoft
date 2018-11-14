// #SKETCHNAME Lava lamp with red blobs
const w = 160;
const h = 120;

var scaleX = width / w;
var scaleY = height / h;

fill("red");
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
    clear();
    
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

            if (sum > 0.15)
            {
                ellipse(x * scaleX + scaleX / 2, y * scaleY + scaleY / 2, scaleX, scaleY);
            }
        }
    }
}
