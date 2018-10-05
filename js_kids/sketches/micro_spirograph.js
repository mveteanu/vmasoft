// #SKETCHNAME Micro-spirograph
var maxPoints = 100;

var segments = [];
initSegments();
var points = [];

function loop()
{
    clear();

    run();
    drawPoints();
}

function initSegments()
{
    segments.push( { r : 100, a : 0, speed : 1 } );
    segments.push( { r : 50, a : 0, speed : 5 } );
    segments.push( { r : 100, a : 0, speed : -10 } );
}

function run()
{
    var x = 400;
    var y = 300;
    
    for(var i = 0; i < segments.length; i++)
    {
        var o = segments[i];
        [x, y] = drawSegment(x, y, o);
        
        o.a += o.speed;
    }
    
    points.push( { x : x, y : y } );
    
    removeOldPoints(maxPoints);
}


function drawSegment(x, y, o)
{
    var h = o.r * sin(o.a);
    var w = o.r * cos(o.a);
    
    var x2 = x + w;
    var y2 = y - h;
    
    line(x, y, x2, y2);
    circle(x, y, 5);
    circle(x2, y2, 5);
    
    return [x2, y2];
}


function removeOldPoints(n)
{
    if (n < 0)
        return;
        
    while(points.length > n)
    {
        points.shift();
    }
}

function drawPoints()
{
    for(var i = 0; i < points.length - 1; i++)
    {
        var o1 = points[i];
        var o2 = points[i+1];
        
        //stroke(0, map(i, 0, points.length - 1, 0, 255));
        line(o1.x, o1.y, o2.x, o2.y);
    }
}
