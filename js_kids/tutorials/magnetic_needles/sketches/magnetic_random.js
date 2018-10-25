// #SKETCHNAME Random field
var ar = [];

function enter()
{
    // Creates an array of random coordinates
    for(var i = 0; i < 50; i++)
    {
        ar.push( { x : random(width), y : random(height) } );
    }
}


function loop()
{
    clear();

    // Draw a magnetic needle for each element of the array with random elements
    for(var i = 0; i < ar.length; i++)
    {
        displayMagneticNeedle(ar[i]);
    }
}


function displayMagneticNeedle(root)
{
    var dot = getIntermediatePoint(root.x, root.y, mouseX, mouseY, 30 );

    line(root.x, root.y, dot.x, dot.y);
    ellipse(dot.x, dot.y, 5);
}


// Returns the coordinates of a point found at distance d from (x1, y1)
// on a line defined by (x1, y1) and (x2, y2)
function getIntermediatePoint(x1, y1, x2, y2, d)
{
    var angle = atan2( y2 - y1, x2 - x1 );

    var x = x1 + d * cos(angle);
    var y = y1 + d * sin(angle);
    
    return { x : x, y : y };
}
