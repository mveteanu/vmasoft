// #SKETCHNAME Falling Balls

// #BEGINSCENE Intro

var startGame = false;

function enter()
{
    background('Scene');
    cursor(ARROW);    
}

function loop()
{
    clear();
    drawIntroScreen();        
}

function mouseClicked()
{
    if (startGame)
    {
        showScene( "Game" );
    }
}

function drawIntroScreen()
{
    var ballX = width / 2;
    var ballY = height / 2;
    var ballSize = height / 2;

    stroke(1);
    fill("yellow");
    ellipse( ballX, ballY, ballSize );

    noStroke();
    fill("black");

    textSize(24);
    textAlign(CENTER);
    text("Catch\nthe\nfalling balls", width / 2, height / 2 - 30);

    if ( Math.floor(frameCount / 30) % 2 === 0 ) 
    {
        textSize(12);
        text("Click the ball to start the game...", width / 2, height - 20);
    }

    if ( dist( mouseX, mouseY, ballX, ballY ) < ballSize / 2  )
    {
        noFill();
        stroke(1);
        ellipse( ballX, ballY, ballSize + 10 );
        startGame = true;
    }
}


// #BEGINSCENE Game


var maxBallsDropped = 10;

var balls;
var ballsDropped;
var ballsCaught;

function initGame()
{
    balls = [];
    ballsDropped = 0;
    ballsCaught = 0;

    for(var i = 0; i < 10; i++)
    {
        addBall(balls);
    }
}

function enter()
{
    background('Scene');
    noCursor();

    textSize(12);
    textAlign(LEFT);

    initGame();
}

function loop()
{
    clear();

    displayBalls(balls);
    updateBalls(balls);
    displayNeedle();

    displayStats();
}


function displayNeedle()
{
    stroke(1);
    noFill();
    triangle(mouseX, mouseY, mouseX - 10, mouseY + 10, mouseX - 8, mouseY + 15);
}

function displayGlobalBalls()
{
    displayBalls(balls);
}

function catchBall(ball)
{
    if ( ballsDropped < maxBallsDropped )
    {
        ballsCaught++;
        initBall(ball);
    }
}

function displayBalls(arBalls)
{
    for(var i = 0; i < arBalls.length; i++)
    {
        displayBall( arBalls[i] );
    }
}

function displayBall(ball)
{
    fill(ball.color);
    stroke(1);
    ellipse(ball.x, ball.y, ball.size);

    if ( dist( mouseX, mouseY, ball.x, ball.y ) < ball.size / 2 )
    {
        noFill();
        ellipse(ball.x, ball.y, ball.size + 5);

        catchBall(ball);
    }
}

function displayStats()
{
    fill("black");
    noStroke();
    text( "Caught: " + ballsCaught, 10, height - 40);
    text( "Dropped: " + ballsDropped, 10, height - 20);
}


function updateBalls(arBalls)
{
    for(var i = 0; i < arBalls.length; i++)
    {
        updateBall( arBalls[i] );
    }
}

function updateBall(ball)
{
    ball.y += ball.size / 20 + ballsCaught / 100;

    // test if hits the ground
    if ( ball.y > height )
    {
        ballsDropped++;

        if ( ballsDropped >= maxBallsDropped )
        {
            showScene( "GameOver", ballsCaught );
        }

        // reinit the ball
        initBall(ball);
    }
}

function addBall(arBalls)
{
    var ball = { x : 0, y : 0, color : "", size: 10 };
    initBall(ball);

    arBalls.push(ball);
}

function initBall(ball)
{
    ball.x = random(10, width - 10);
    ball.y = 10;
    ball.color = random(["white", "yellow", "green", "blue", "red"]);
    ball.size = random(10, 30);
}



// #BEGINSCENE GameOver

function enter()
{
    background('Scene');
    cursor(ARROW);
}

function loop()
{
    clear();

    fill("black");
    noStroke();
    textSize( map( sin(frameCount * 0.1), 0, 1, 24, 32) );
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2);

    textSize(12);
    text("Score: " + PublicVars.Arguments, width / 2, height / 2 + 20);

    text("Click mouse button to restart game...", width / 2, height - 20);
}

function mouseClicked()
{
    showScene( "Intro" );
}
