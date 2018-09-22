// #SKETCHNAME Plane and objects

// #BEGINSCENE Intro
background("lightblue");

textSize(24);
textAlign(CENTER);
text("Plane and objects", width / 2, 50);

var pIntro = sprite('plane');

textSize(14);
text("Press any key to start the game...", width / 2, height - 9);

function loop()
{
    pIntro.y += sin(frameCount * 0.1);
}

function keyPressed()
{
    showScene("Game");
}

function mousePressed()
{
    showScene("Game");
}

// #BEGINSCENE Game
var p = sprite('plane', 150, 300, 0.2);

var maxObjects = 9;
var bullets = [];
var objects = [];

var isHit = false;

function enter()
{
    background('lightblue');

    p.x = 150;
    p.y = 300;
    p.velocity.y = 0;
    p.rotation = 0;
    p.rotationSpeed = 0;
    p.show('fly');
    isHit = false;

    createObjects();
    bullets = [];
}

function loop()
{
    readKeys();
    
    clear();
    updateObjects();
    displayObjects();
    updateBullets();
    displayBullets();
    
    checkStatus();
    displayStats();
}

function readKeys()
{
    if (isHit)
        return;
    
    if ( keyIsDown( UP_ARROW ) && p.y > 0  )
    {
        p.y -= 5;
    }
    else if ( keyIsDown( DOWN_ARROW) && p.y < height - 30 )
    {
        p.y += 5;
    }
    
    if ( keyIsDown( RIGHT_ARROW) && p.x < width - 50 )
    {
        p.x += 5;
    }
    else if ( keyIsDown( LEFT_ARROW) && p.x > 0 )
    {
        p.x -= 5;
    }
    
    if ( keyIsDown (32) )  // SPACE
    {
        p.show('shoot');
        createBullet();
    }
    else
    {
        p.show('fly');
    }
}

function createObjects()
{
    objects = [];
    
    for(var i = 0; i < maxObjects; i++)
    {
        var obj = { x : random(width, width * 2), 
                    y : random(0, height), 
                    r : random(20, 30),
                    color : random(['LightPink', 'LightSalmon', 'PapayaWhip', 'LemonChiffon', 'LightGreen', 'MediumAquamarine', 'Tan', 'Beige']),
                    hit : false
                };
                
        objects.push(obj);
    }
}

function checkStatus()
{
    if (isHit && p.y > height)
    {
        showScene("Status", false);
    }
    else if ( objects.length == 0 )
    {
        showScene("Status", true);
    }
}

function updateObjects()
{
    if (isHit)
        return;
        
    for(var i = objects.length - 1; i >= 0; i--)
    {
        o = objects[i];
        
        if (o.hit)
        {
            if (o.r >= 0)
            {
                o.r--;
            }
            else
            {
                objects.splice(i, 1);
                
            }
            
            continue;
        }
        
        o.x -= 5;
        if (o.x < 0)
        {
            o.x = width;
            o.y = random(height);
        }

        checkCollision(o);
    }
}

function displayObjects()
{
    stroke(0);
    
    for(var o of objects)
    {
        fill(o.color);
        circle(o.x, o.y, o.r);
    }
}

function createBullet()
{
    if (frameCount % 5 != 0)
        return;
    
    var bullet = { x : p.x, y : p.y };
    bullets.push(bullet);
}

function updateBullets()
{
    for(var i = bullets.length - 1; i >= 0; i--)
    {
        var bullet = bullets[i];
        bullet.x += 10;
        
        if (bullet.x > width)
        {
            bullets.splice(i, 1);
        }
    }
}

function displayBullets()
{
    fill('brown');
    noStroke();
    
    for(var bullet of bullets)
    {
        circle(bullet.x, bullet.y, 5);
    }
}

function displayStats()
{
    fill(0);
    
    text(objects.length, 10, height - 10);
}


function checkCollision(o)
{
    if (o.hit)
        return;

    var hit = collisionCircleRect(o.x, o.y, o.r, p.x - 48, p.y - 32, 96, 60);
    if (hit)
    {
        isHit = true;
        
        p.show('crash');
        p.velocity.y = 9;
        p.rotationSpeed = 9;
    }
    
    for(var i = bullets.length - 1; i >= 0; i--)
    {
        var bullet = bullets[i];
        hit = collisionCircleCircle(o.x, o.y, o.r, bullet.x, bullet.y, 5);
        if (hit)
        {
            o.hit = true;
            bullets.splice(i, 1);
        }
    }
}


// #BEGINSCENE Status
function enter()
{
    var win = PublicVars.Arguments;

    clear();
    textAlign(CENTER);
    text(win ? "You win!" : "You loose.", width / 2, height / 2);

    text("Press R to restart...", width / 2, height - 10);
}


function keyPressed()
{
    if (key == 'R')
    {
        showScene("Game");
    }
}
