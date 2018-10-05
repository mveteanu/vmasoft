// #SKETCHNAME Snake
// #BEGINSCENE Game
var maxPoints = 100;
var speed = 5;

var points = [];
var x = 25;
var y = 25;
var dx = 0;
var dy = 0;

var moveWalls = false;

var walls = [
        {x : 0, y : 50, w : 700, h : 50 },
        {x : 100, y : 200, w : 700, h : 50},
        {x : 0, y : 350, w : 700, h : 50},
        {x : 100, y : 500, w : 700, h : 50},
        {x : 780, y : 550, w : 20, h : 50} // exit wall
    ];
    
function enter()
{
    x = 25;
    y = 25;
    dx = 0;
    dy = 0;

    moveWalls = PublicVars.Arguments;
    initSnake();
}

function loop()
{
    clear();
    
    drawPoints();
    update();
    checkCollision();

    displayWalls();
    updateWalls();
    displayInstructions();
}


function initSnake()
{
    points = [];
    
    for(var i = 0; i < maxPoints; i++)
    {
        points.push( { x : x, y : y } );
    }
}

function update()
{
    if (keyIsDown(RIGHT_ARROW))
    {
        dx = 1;
        dy = 0;
    }
    else if (keyIsDown(LEFT_ARROW))
    {
        dx = -1;
        dy = 0;
    }
    else if (keyIsDown(UP_ARROW))
    {
        dy = -1;
        dx = 0;
    }
    else if (keyIsDown(DOWN_ARROW))
    {
        dy = 1;
        dx = 0;
    }

    x += speed * dx;
    y += speed * dy;
    
    points.push( { x : x, y : y } );
    points.shift();
}

function drawPoints()
{
    var n = points.length;

    for(var i = 0; i < n; i++)
    {
        var p = points[i];

        fill(i % 2 == 0 ? "yellow" : "red");
        circle(p.x, p.y, map(i, 0, n - 1, 0, 10));
    }
}

function checkCollision()
{
    var p = points.peek();
    
    if (p.x < 0 || p.x >= width ||
        p.y < 0 || p.y >= height)
    {
        showScene("Stats", false);
        return;
    }
    
    for(var i = 0; i < walls.length - 1; i++)
    {
        var wall = walls[i];
        
        if (collisionCircleRect(p.x, p.y, 10, wall.x, wall.y, wall.w, wall.h))
        {
            showScene("Stats", false);
            return;
        }
    }
    
    var exit = walls.peek();
    if (collisionCircleRect(p.x, p.y, 10, exit.x, exit.y, exit.w, exit.h))
    {
        showScene("Stats", true);
    }
}

function displayWalls()
{
    fill('brown');
    
    for(var i = 0; i < walls.length - 1; i++)
    {
        var wall = walls[i];
        rect(wall.x, wall.y, wall.w, wall.h);
    }
    
    fill('green');
    var exit = walls.peek();
    rect(exit.x, exit.y, exit.w, exit.h);
}

function updateWalls()
{
    if (!moveWalls)
        return;
    
    for(var i = 0; i < walls.length - 1; i++)
    {
        var wall = walls[i];
        wall.dx = wall.dx || 1;
            
        wall.x += wall.dx;
        if (wall.x + wall.w > width || wall.x < 0 )
            wall.dx *= -1;
    }    
}

function displayInstructions()
{
    push();
    noStroke();
    fill(0);
    text("Use arrow keys to reach the exit...", 10, height - 10);
    pop();
}
// #BEGINSCENE Stats
var win;

function enter()
{
    clear();
    
    win = PublicVars.Arguments;
    var msg = win ? "You win!" : "You crashed..."
    
    textSize(24);
    textAlign(CENTER, CENTER);
    text(msg, width / 2, height / 2);
}

function keyPressed()
{
    showScene("Game", win);
}
