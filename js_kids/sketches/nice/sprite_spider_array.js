
var spider = [  
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,0,1],
    [1,0,1,0,0,1,0,1],
    [1,0,1,0,0,1,0,1],
    [0,0,1,0,0,1,0,0] 
];

var dotSize = 4;

var y = 0;
var x = random(width);
var clr = 0;

function loop()
{
    clear();

    fill(clr);
    putSprite(spider, x, y, dotSize);

    stroke(1);
    line(x + dotSize * 4, 0, x + dotSize * 4, y);

    y+=5;

    if (y > height)
    {
        y = 0;
        x = random(width);
        clr = random(1) >= 0.5 ? 'red' : 'black'
    }
}

function putSprite(sprite, spriteX, spriteY, dotSize)
{
    noStroke();

    for(var i = 0; i < sprite.length; i++)
    {
        var ar = sprite[i];

        for(var j = 0; j < ar.length; j++)
        {
            var x = spriteX + j * dotSize;
            var y = spriteY + i * dotSize;

            if (ar[j] == 1)
                rect(x, y, dotSize, dotSize);
        }
    }
}
