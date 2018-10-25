// #SKETCHNAME Test collisions
var tests = [pointCircle, circleCircle, circleRect, pointRect, rectRect];
var currTest = 0;

function loop()
{
    clear();

    var test = tests[currTest];
    test();
    
    text(test.name, 10, height - 10);
}

function keyPressed()
{
    if (keyCode == LEFT_ARROW && currTest > 0)
    {
        currTest--;
    }
    else if (keyCode == RIGHT_ARROW && currTest < tests.length - 1)
    {
        currTest++;
    }
}

function pointCircle()
{
    var collide = collisionPointCircle(mouseX, mouseY, 400, 300, 200);
    stroke(collide ? "red" : "black");
    circle( 400, 300, 200 );
}

function circleCircle()
{
    stroke("black");
    circle(mouseX, mouseY, 50);
    
    var collide = collisionCircleCircle(mouseX, mouseY, 50, 400, 300, 200);
    stroke(collide ? "red" : "black");
    circle( 400, 300, 200 );
}

function circleRect()
{
    stroke("black");
    circle(mouseX, mouseY, 50);
    
    var collide = collisionCircleRect(mouseX, mouseY, 50, 300, 200, 200, 100);
    stroke(collide ? "red" : "black");
    rect(300, 200, 200, 100);
}

function pointRect()
{
    stroke("black");

    var collide = collisionPointRect(mouseX, mouseY, 300, 200, 200, 100);
    stroke(collide ? "red" : "black");
    rect(300, 200, 200, 100);
}

function rectRect()
{
    stroke("black");
    rect(mouseX, mouseY, 50, 30);
    
    var collide = collisionRectRect(mouseX, mouseY, 50, 30, 300, 200, 200, 100);
    stroke(collide ? "red" : "black");
    rect(300, 200, 200, 100);
}
