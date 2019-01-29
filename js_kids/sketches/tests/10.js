
background('pink');
ellipse(100, 100, 50);

var p = sprite("player");
p.depth = -1;


function mouseClicked()
{
    ellipse(mouseX, mouseY, 50);
}

function mouseMoved()
{
    ellipse(mouseX, mouseY, 20);
    
    p.position.x = mouseX;
    p.position.y = mouseY;
}
