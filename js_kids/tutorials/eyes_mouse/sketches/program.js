// #SKETCHNAME Eyes mouse

// Use cartesian - polar coordinates conversion to implement
// eyes that follow mouse coursor

function loop()
{
    clear();

    drawEye(200, height / 2, 60);
    drawEye(380, height / 2, 60);
}


function drawEye(x, y, r)
{
    fill("white");
    ellipse(x, y, r * 2);

    drawEyePupil(x, y, 0.75 * r, 0.5 * r);
}

// Draw eyes that follow the mouse position
function drawEyePupil(x1, y1, r, pr)
{
    var angle = atan2(mouseY - y1, mouseX - x1);

    var x2 = x1 + r * cos(angle);
    var y2 = y1 + r * sin(angle);

    fill("black");
    ellipse(x2, y2, pr);
}
