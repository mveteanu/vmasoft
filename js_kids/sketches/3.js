// #SKETCHNAME Game

// #BEGINSCENE Game

var p = sprite("player");

function loop()
{
    if ( keyIsDown(LEFT_ARROW) && p.position.x > 0 )
    {
        p.position.x -= 3;
        p.mirrorX(-1);
    } else if ( keyIsDown(RIGHT_ARROW) && p.position.x < width )
    {
        p.position.x += 3;
        p.mirrorX(1);
    }
}

function keyPressed()
{
    if (key == "Z")
    {
        p.position.x = 0;
    }
    else if (key == "X")
    {
        p.position.x = width;
    }
}
