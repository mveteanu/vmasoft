// #SKETCHNAME Breakout

// #BEGINSCENE Game

var paddleWidth = 60;
var brickWidth = 50;
var brickHeight = 20;
var brickSpace = 20;
var rowSpace = 10;

var xPaddle;
var yPaddle;

var ball;
var ballsLeft;

var bricks = [];

background("teal");
fill("white");

function enter()
{
    initGame();
}

function initGame()
{
    bricks = createBricks();
    ballsLeft = 3;
    
    initBall();
}

function initBall()
{
    xPaddle = width / 2;
    yPaddle = height - 20;

    ball = {
        radius : 5,
        x : 0,
        y : 0,
        xvel : 5,
        yvel : -5,
        inMotion : false
    };
}

function loop()
{
    clear();

    readKeys();
    displayBricks();
    displayPaddle();

    updateBall();
    displayBall();

    checkForCollision();

    displayStats();
}

function displayStats()
{
    push();
    fill('black');
    noStroke();

    text("Balls: " + ballsLeft, 10, height - 20);
    text("Bricks: " + bricks.length, 10, height - 6);

    pop();
}

function isInsideRectangle(x, y, xr, yr, wr, hr)
{
    return (x >= xr && x <= xr + wr && 
            y >= yr && y <= yr + hr);
}

function updateBall()
{
    if ( !ball.inMotion )
    {
        ball.x = xPaddle + paddleWidth / 2;
        ball.y = yPaddle - ball.radius;
    }
    else
    {
        updateBallInMotion();
    }
}

function updateBallInMotion()
{
    ball.x += ball.xvel;
    ball.y += ball.yvel;

    if ( ball.x < 0 || ball.x > width )
    {
        ball.xvel *= -1;
    }
    else if ( ball.y < 0 )
    {
        ball.yvel *= -1;
    }
    else if ( ball.y >= yPaddle - ball.radius && 
        (ball.x > xPaddle && ball.x < xPaddle + paddleWidth) )
    {
        ball.yvel *= -1;
    }
    else if ( ball.y > height )
    {
        ballsLeft--;
        
        if (ballsLeft >= 0)
        {
            initBall();
        }
        else
        {
            initGame();
        }
    }
}

function checkForCollision()
{
    var brickIndex = getHitBrick();
    if ( brickIndex == -1 )
    {
        return;
    }

    bricks.splice(brickIndex, 1);
    ball.yvel *= -1;

    if ( bricks.length == 0 )
    {
        initGame();
    }
}


// Iterate through all the bricks and check
// if the ball hits any bricks.
// Returns the index of the brick that is hit ... or -1
function getHitBrick()
{
    for(var i = 0; i < bricks.length; i++)
    {
        var brick = bricks[i];

        if ( isInsideRectangle( ball.x, ball.y, brick.x, brick.y, brickWidth, brickHeight ) )
        {
            return i;
        }
    }

    return -1;
}

function displayBall()
{
    ellipse( ball.x, ball.y, ball.radius * 2 );
}

function readKeys()
{
    if ( keyIsDown( LEFT_ARROW ) && xPaddle > 0  )
    {
        xPaddle -= 5;
    }
    else if ( keyIsDown( RIGHT_ARROW) && xPaddle < width - paddleWidth )
    {
        xPaddle += 5;
    }
    else if ( keyIsDown (32) )  // SPACE
    {
        ball.inMotion = true;
    }
}

function createBricks()
{
    var noBricks = Math.floor((width - brickSpace) / ( brickWidth + brickSpace ));
    var arBricks = [];

    for(var row = 0; row < 3; row++)
    {    
        for(var col = 0; col < noBricks; col++ )
        {
            var x = col * ( brickWidth + brickSpace ) + brickSpace;
            var y = row * (brickHeight + rowSpace) + rowSpace;
            
            var brick = { x : x, y : y };
            arBricks.push(brick);
        }
    }

    return arBricks;
}

function displayBricks()
{
    for(var i = 0; i < bricks.length; i++)
    {
        var brick = bricks[i];
        rect( brick.x, brick.y, brickWidth, brickHeight );
    }
}

function displayPaddle()
{
    rect( xPaddle, yPaddle, paddleWidth, 10 );
}
