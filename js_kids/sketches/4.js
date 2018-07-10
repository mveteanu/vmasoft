
// This sketch is to test the offscreen buffer when used also with loop()

fill('lime');
background('pink');
circle(200, 200, 30);
rect(10, 10, 10, 10);
var p = sprite('player', 100, 100);

var x = 1;
var y = 1;
var xd = 1;
var yd = 1;

function loop()
{
  clear();

  circle(x, y, 30);  
  x+=xd;
  y+=yd;
  
  if (x > width || x < 0)
  {
    background(random(255));
    xd *= -1;
  }

  if (y > height || y < 0)
  {
    background(random(255));
    yd *= -1;
  }

 p.position.x += xd;

}
