
function loop()
{
    clear();

    //pointCircle();
    //circleCircle();
    //circleRect();
    //pointRect();
    rectRect();
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
