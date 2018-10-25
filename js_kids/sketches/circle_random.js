// #SKETCHNAME Circle random
const colors = ["Teal", "IndianRed", "Yellow", "Blue", "Green", "Violet", "Maroon"];

var ar = [];

circ(400, 300, 100);
randomize();

function loop()
{
    clear();
    
    update();
    display();
}

function mousePressed()
{
    randomize();
}

function randomize()
{
    for(var o of ar)
    {
        o.x = floor(random(800));
        o.y = floor(random(600));
    }
}

function circ(x, y, r)
{
    for(var i = 0; i < 360; i += 10)
    {
        var xp = floor(x + r * sin(i));
        var yp = floor(y + r * cos(i));
        
        ar.push( { xp : xp, yp : yp, c : random(colors) } );
    }
}

function update()
{
    for(var o of ar)
    {
        if (o.x < o.xp)
            o.x++;
        else if (o.x > o.xp)
            o.x--;

        if (o.y < o.yp)
            o.y++;
        else if (o.y > o.yp)
            o.y--;
    }
}

function display()
{
    noStroke();
    
    for(var o of ar)
    {
        fill(o.c);
        circle(o.x, o.y, 5);
    }
}
