// #SKETCHNAME Run on circle
var x = width / 2;
var y = height / 2;
var r = 200;

var p1 = {x : 0, y : 0, angle : 0, speed : random(1, 5)};
var p2 = {x : 0, y : 0, angle : 0, speed : random(5, 10)};

var points = [];
var maxPoints = 30;


function loop()
{
    clear();
    
    update();
    display();
}

function update()
{
    updatePoint(p1);
    updatePoint(p2);
    
    points.push({x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y});
    if (points.length > maxPoints)
        points.shift();
}

function updatePoint(p)
{
    p.x = x + r * cos(p.angle);
    p.y = y - r * sin(p.angle);
    p.angle += p.speed;
}

function display()
{
    for(var i = 0; i < points.length; i++)
    {
        var p = points[i];
        
        var a = map(i, 0, points.length, 0, 255);
        stroke(random(255), random(255), random(255), a);
        line(p.x1, p.y1, p.x2, p.y2);
        
        circle(p.x1, p.y1, 5);
        circle(p.x2, p.y2, 5);
    }
}
