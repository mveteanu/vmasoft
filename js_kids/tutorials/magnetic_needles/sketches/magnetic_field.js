// #SKETCHNAME Magnetic field
function loop()
{
    clear();

    for (var x = 0; x < width; x += 30)
    {
        for(var y = 0; y < height; y += 30)
        {
            displayMagneticNeedle( x, y, 30 );
        }
    }
}

function displayMagneticNeedle(x, y, d)
{
    var angle = atan2( mouseY - y, mouseX - x );

    var x2 = x + d * cos(angle);
    var y2 = y + d * sin(angle);

    line(x, y, x2, y2);
    ellipse(x2, y2, 5);
}
