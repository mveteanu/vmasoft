strokeWeight(5);

function loop()
{
    if (mouseDown())
    {
        line(pmouseX, pmouseY, mouseX, mouseY);
    }
}

function keyPressed()
{
    if (key == '1')
    {
        stroke("black");
    }
    else if (key == '2')
    {
        stroke("blue");
    }
    else if (key == '3')
    {
        stroke("red");
    }
}
