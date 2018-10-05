
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

var dotSize = 8;
fill("IndianRed");

function loop()
{
    clear();
    
    putSprite(spider, mouseX, mouseY, dotSize);
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
