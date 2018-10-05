// #BEGINSCENE Graph
angleMode(RADIANS);
var start = -10;

function loop()
{
    clear();

    plotFunction(x => sin(x), start, start + 10 * PI);

    start += 0.1;
}


// The method takes as arguments the function that should be plotted
// and the interval for x -> (x1, x2) for which will do the graph
function plotFunction(fn, x1, x2)
{
    var o = getFunctionValues(fn, x1, x2, 1000);
    var ar = o.values;
    var y1 = o.min;
    var y2 = o.max;

    plotFunctionGraph(ar, x1, x2, y1, y2);
    drawFunctionAxes(x1, x2, y1, y2);
}

function drawFunctionAxes(x1, x2, y1, y2)
{
    if ( x1 < 0 && x2 >= 0)
    {
        var axesX = map(0, x1, x2, 0, width);
        line(axesX, 0, axesX, height - 1);
    }

    if ( y1 < 0 && y2 >= 0)
    {
        var axesY = map(0, y1, y2, height - 1, 0);
        line(0, axesY, width - 1, axesY);
    }
}

// Plot the function graph using the values from array ar
// x is between x1 and x2
// y is between y1 and y2 (min and max of the function)
function plotFunctionGraph(ar, x1, x2, y1, y2)
{
   for(var i = 0; i < ar.length - 1; i++)
    {
        var x = ar[i].x;
        var y = ar[i].y;

        var screenX = map(x, x1, x2, 0, width - 1);
        var screenY = map(y, y1, y2, height - 1, 0)

        var xNext = ar[i+1].x;
        var yNext = ar[i+1].y;

        var screenXNext = map(xNext, x1, x2, 0, width - 1);
        var screenYNext = map(yNext, y1, y2, height - 1, 0)

        line(screenX, screenY, screenXNext, screenYNext);
    }
}

// Returns an object with values of the function 
// calculated for n points in between x1 and x2
// Also returns as part of the object the min and max of y values
function getFunctionValues(fn, x1, x2, n)
{
    var ar = [];
    var min = Infinity;
    var max = -Infinity;

    var step = (x2 - x1) / n;

    for(var x = x1; x <= x2; x += step)
    {
        var y = fn(x);
        ar.push( {x: x, y: y} );

        if (y < min)
            min = y;

        if (y > max)
            max = y;
    }

    return { values: ar, min: min, max: max };
}
