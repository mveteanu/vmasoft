// #SKETCHNAME Cycle scenes
preload('Field', 'Scene', 'Mountains');

var scene = 0;
var scenes = ['Field', 'Scene', 'Mountains'];

background(scenes[scene]);
var p = sprite('adventure_girl', 400, 450, 0.5);

function loop()
{
    if(keyIsDown(RIGHT_ARROW))
    {
        p.show('run')
        p.mirrorX(1);
        p.x += 5;
    }
    else if(keyIsDown(LEFT_ARROW))
    {
        p.show('run')
        p.mirrorX(-1);
        p.x -= 5;
    }
    else
    {
        p.show('idle');
    }
    
    if (p.x > width)
    {
        p.x = 0;
        scene = mod(scene + 1, scenes.length);
        background(scenes[scene]);
    }
    else if (p.x < 0)
    {
        p.x = width;
        scene = mod(scene - 1, scenes.length);
        background(scenes[scene]);
    }
    
}

function mod(n, p) 
{
    return n - p * Math.floor( n / p );
}
