// #SKETCHNAME Magnetic needle
// Show how to convert from cartesian to polar coordinates

function loop()
{
    clear();

    var r = 100;
    var x1 = width / 2;
    var y1 = height / 2;

    // Transform to polar coordinates
    var angle = atan2( mouseY - y1, mouseX - x1);

    // Switch back to cartesian coordinates and find (x2, y2)
    var x2 = x1 + r * cos(angle);
    var y2 = y1 + r * sin(angle);

    line(x1, y1, x2, y2);
    ellipse(x2, y2, 5);

    text(angle, 10, height - 10);
}
