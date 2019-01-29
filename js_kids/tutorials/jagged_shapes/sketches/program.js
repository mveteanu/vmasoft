// #BEGINSKETCH Jagged shapes
draw();

function mouseClicked()
{
    clear();
    
    draw();
}

function draw()
{
    jcircle(400, 300, 100);
    
    jline(100, 400, 500, 500);
    
    jrect(200, 50, 300, 100);
}

function jcircle(x, y, r)
{
    var delta = r / 20;
    
    beginShape();
    for(var angle = 0; angle < 360; angle += 10)
    {
        var xp = x + r * cos(angle);
        var yp = y + r * sin(angle);
        
        xp += random(-delta, delta);
        yp += random(-delta, delta);

        vertex(xp, yp);
    }
    endShape(CLOSE);
}

function jline(x1, y1, x2, y2)
{
    var d = dist(x1, y1, x2, y2);
    
    beginShape();
    vertex(x1, y1);
    for(var i = 10; i < d; i += 10)
    {
        var [x, y] = getXY(x1, y1, x2, y2, i);
        
        x += random(-3, 3);
        y += random(-3, 3);
        
        vertex(x, y);
    }
    vertex(x2, y2);
    endShape();
}

function jrect(x, y, w, h)
{
    jline(x, y, x + w, y);
    jline(x + w, y, x + w, y + h);
    jline(x + w, y + h, x, y + h);
    jline(x, y + h, x, y);
}

// Returns the coordinates of a point found at distance d from x1, y1
// on a line defined by x1, y1 and x2, y2
function getXY(x1, y1, x2, y2, d)
{
    var angle = atan2( y2 - y1, x2 - x1 );

    var x = x1 + d * cos(angle);
    var y = y1 + d * sin(angle);
    
    return [x, y];
}
