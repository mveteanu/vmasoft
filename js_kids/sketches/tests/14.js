background('Scene');

var p = sprite('player')
p.velocity.y = 10;

function loop()
{
    clear();
    text(allSprites.length, 10, 10)
    
    updatePlayer();    
    createDrops();
}

function updatePlayer()
{
    if (p.position.y > height - 100)
    {
        p.velocity.y = 0;
    }
    
    if (p.position.x > width - 50 || p.position.x < 50)
    {
        p.velocity.x = 0;
    }
    
    if (keyIsDown(LEFT_ARROW))
    {
        p.mirrorX(-1);
        p.velocity.x = -10;
    }
    
    if (keyIsDown(RIGHT_ARROW))
    {
        p.mirrorX(1);
        p.velocity.x = 10;
    }
}

function createDrops()
{
    var r = sprite('robot', random(width), 10);
    r.scale = 0.1;
    r.velocity.x = random(-5, 5);
    r.velocity.y = 5;
    r.life = 100;
    r.depth = -1;
    
    p.collide(r);
}

