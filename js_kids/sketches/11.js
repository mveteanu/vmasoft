
background('pink');
ellipse(100, 100, 50);

var p = sprite("player");
p.depth = -1;
var y = 0;
var dy = 1;

function loop()
{
    line(0, y, width, y);
    y+= dy;
    if (y > height || y < 0)
        dy *= -1;
        
    p.position.y = y - 45;
}

function mouseClicked()
{
    ellipse(mouseX, mouseY, 50);
}

function mouseMoved()
{
    ellipse(mouseX, mouseY, 20);
    
    p.position.x = mouseX;
}
