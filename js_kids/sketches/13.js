
var x = 0;
var y = 0;
var dx = 1;
var dy = 1;

background('clouds')
fill('white');

function loop()
{
    stroke(random(255), random(255), random(255))
    circle(x, y, 30);
    x+=dx;
    y+=dy;
    
    if (x>width || x<0)
        dx *= -1;
        
    if (y>height || y<0)
        dy *= -1;
}

function mouseClicked()
{
    showScene("Scene1");
}


// #BEGINSCENE Scene1

strokeWeight(3)
fill('red')

function loop()
{
    circle(100, 100, 100)
}

function mouseClicked()
{
    showScene("Code")
}
