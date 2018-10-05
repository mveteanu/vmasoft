// #BEGINSCENE Game

var xShip;
var bullets;
var aliens;
var stars = [];
var speed = 2.5;
var alienSize = 25;

var startTime;

background("black");
createStars( stars );

function enter()
{
    aliens = [];
    bullets = [];
    createAliens( aliens );
    xShip = width / 2;

    startTime = Date.now();
}


function loop()
{
    clear();
    displayStars( stars );
    updateStars( stars );

    checkKeys();
    displayShip();
    displayBullets( bullets );
    updateBullets( bullets );
    displayAliens( aliens );
    updateAliens( aliens );

    displayStats();
}

function displayStats()
{
    fill("white"); 
    text( aliens.length, 10, height - 20 );
}

function createStars( ar )
{
    for(var i = 0; i < 1000; i++)
    {
        var star = { x : random(width), y : random(height) };
        ar.push( star );
    }
    
}

function updateStars( ar )
{
    for(var i = 0; i < 1000; i++)
    {
        ar[i].y++;
        if (ar[i].y > height )
        {
            ar[i].y = 0;
        }
    }
}

function displayStars( ar )
{
    stroke("white");

    for(var i = 0; i < ar.length; i++)
    {
        point( ar[i].x, ar[i].y );
    }
}

function createAliens(arAliens)
{
    for(var row = 0; row < 3; row++)
    {
        for(var col = 0; col < 10; col++)
        {
            var alien = { x : 30 + col * 30, y : 30 + row * 30  };
            arAliens.push( alien );
        }
    }
}

function displayAliens(arAliens)
{
    for(var i = 0; i < arAliens.length; i++)
    {
        var alien = arAliens[i];
        displayAlien( alien.x, alien.y );
    }
}

function updateAliens(arAliens)
{
    var changeDir = false;
    
    for(var i = 0; i < arAliens.length; i++)
    {
        var alien = arAliens[i];

        alien.x += speed;

        if ( alien.x > width || alien.x < 0 )
        {
            moveAliensDown(arAliens);
            changeDir = true;
        }
    }

    if ( changeDir )
    {
        speed *= -1;
    }
}

function moveAliensDown(arAliens)
{
    for(var i = 0; i < arAliens.length; i++)
    {
        var alien = arAliens[i];
        alien.y += 10;

        if ( alien.y > height - 40 )
        {
            showScene("Status", -1);
        }
    }
}

function displayAlien(x, y)
{
    var d = sin(frameCount * 0.1);

    stroke("black");
    fill("white");

    ellipse(x, y, alienSize);

    ellipse( x - 5, y - 5, 5 + d);
    ellipse( x + 5, y - 5, 5 + d);

    fill("black");
    ellipse( x - 5, y - 5, 3);
    ellipse( x + 5, y - 5, 3);

    line (x - 5 - d * 2, y + 5, x + 5 + d * 2, y + 5);
}

function findHitAlien( bullet )
{
    for(var i = 0; i < aliens.length; i++)
    {
        var alien = aliens[i];
        var distToBullet = dist(alien.x, alien.y, bullet.x, bullet.y);

        if ( distToBullet < alienSize / 2 )
        {
            return i;
        }
    }

    return -1;
}

// var ar = [ a, b ]   --> ar[0], ar[1] 
// var o = { x : 0, y : 0  }  --> o.x, o.y
function createBullet(arBullets)
{
    var bullet = { x : xShip + 20, y : height - 25  };
    arBullets.push(bullet);

    return bullet;
}

function displayBullet( bullet )
{
    ellipse( bullet.x, bullet.y, 10 );
}

function displayBullets( arBullets )
{
    for( var i = 0; i < arBullets.length; i++ )
    {
        var bullet = arBullets[i];
        displayBullet(bullet);
    }
}


function updateBullets( arBullets )
{
    for( var i = arBullets.length - 1; i >= 0; i-- )
    {
        var bullet = arBullets[i];
        bullet.y -= 10 ;

        if ( bullet.y < 0 )
        {
            arBullets.splice( i, 1 );
        }

        var hitAlienIndex = findHitAlien(bullet);
        if ( hitAlienIndex != -1 )
        {
            aliens.splice( hitAlienIndex, 1 );
            arBullets.splice( i, 1 );

            if (aliens.length == 0)
            {
                var seconds = getElapsedSeconds();
                showScene("Status", seconds);
            }
        }

    }
}


function checkKeys()
{
    if ( keyIsDown(LEFT_ARROW) && xShip > 0 )
    {
        xShip -= 3;
    }
    
    if ( keyIsDown(RIGHT_ARROW) && xShip < width - 40 )
    {
        xShip += 3;
    }

    if ( keyIsDown( 32 ) )
    {
        if ( frameCount % 3 == 0)
        {
            createBullet( bullets );
        }
    }
}

function displayShip()
{
    rect( xShip, height - 20, 40, 10 );
    triangle(xShip, height - 20, xShip + 20, height - 30, xShip + 40, height - 20)
}


function getElapsedSeconds()
{
    var currTime = Date.now();
    var millis = currTime - startTime;
    var seconds = millis / 1000;

    return seconds;
}


// #BEGINSCENE Status


function enter()
{
    background('black');
    fill('white');
    textAlign(CENTER);
    clear();

    var seconds = PublicVars.Arguments;
    if (seconds > 0)
    {
        textSize(24);
        text("You win!!!", 400, 300);

        textSize(14);
        text("You destroyed all aliens in " + seconds + " seconds!", 400, 350);
    }
    else
    {
        textSize(24);
        text("You loose!!!", 400, 300);
    }

    textSize(14);
    text("Press R to restart the game...", width / 2, height - 20);
}

function keyPressed()
{
    if (key == "R")
    {
        showScene("Game");
    }
}
