// #SKETCHNAME Pop balloons
// #BEGINSCENE Game
var noBalloons = 50;
var speed = 1;

var balloons = [];
var hit = 0;
var missed = 0;
var score = 0;

var p = sprite('adventure_girl', 100, 450, 0.5);
p.depth = -1;

function enter()
{
    balloons = [];
    addBalloons();
    
    hit = 0;
    missed = 0;
    score = 0;
}

function loop()
{
    clear();
    drawBalloons();
    updateBalloons();
    displayStats();
    updatePlayer();
    checkFinish();
}

function keyPressed()
{
    sound('laser1')
    checkHit();
}

function checkFinish()
{
    if (hit + missed == noBalloons)
    {
        showScene("Score", score);
    }
}

function addBalloons()
{
    var colors = ["Lime", "Red", "Green", "Orange", "Violet", "Teal", "Pink", "Magenta", "Navy"];
    var chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    for(var i = 0; i < noBalloons; i++)
    {
        var balloon = {
            x : random(10, width - 10),
            y : random(-height * (noBalloons / 10), 0),
            chr : random(chars),
            r : 20,
            color : random(colors),
            speed : speed,
            hit : false,
            missed : false
        }
        
        balloons.push(balloon);
    }
}

function drawBalloons()
{
    for(var i = 0; i < balloons.length; i++)
    {
        var o = balloons[i];

        if (o.r > 0)
        {
            noStroke();

            fill(o.color);
            circle(o.x, o.y, o.r);

            if (!o.hit)
            {
                fill(255, 255, 255, 100);
                circle(o.x, o.y, 10);
                
                fill(0);
                textAlign(CENTER, CENTER);
                text(o.chr, o.x, o.y);
            }
            
            if (o.hit && o.r > 15)
            {
                stroke(0);
                strokeWeight(1);
                line(180, 450, o.x, o.y);
            }
        }
    }
}

function updateBalloons()
{
    for(var i = 0; i < balloons.length; i++)
    {
        var o = balloons[i];
        o.y += o.speed;
        
        if (o.hit && o.r > 0)
        {
            o.r--;
        }
        
        if (!o.missed && !o.hit && o.y >= height)
        {
            missed++;
            o.missed = true;
            score -= 10;
        }
    }
}

function checkHit()
{
    var prevHit = hit;
    
    for(var i = 0; i < balloons.length; i++)
    {
        var o = balloons[i];
        
        if (o.y >= 0 && o.y <= height)
        {
            if (o.chr == key && !o.hit)
            {
                o.hit = true;
                hit++;
                
                score += (o.y < 20 || o.y > height - 20) ? 20 : 10;

                break;
            }
        }
    }
    
    if (prevHit == hit)
    {
        score--;
    }
}

function updatePlayer()
{
    p.show(keyIsPressed ? "shoot" : "idle");
}

function displayStats()
{
    textAlign(LEFT, LEFT);
    fill(0);
    
    text("Score: " + score, 10, 10)
    text("Hit: " + hit, 10, 24);
    text("Missed: " + missed, 10, 38);

    text("Use keyboard to pop balloons...", 10, height - 10);
}

// #BEGINSCENE Score
function enter()
{
    clear();
    fill(0);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    
    text("Your score: " + PublicVars.Arguments, width / 2, height / 2);
    
    textSize(14);
    text("Press any key to retry...", width / 2, height - 15);
}

function keyPressed()
{
    showScene("Game");
}
