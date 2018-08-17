
var spider = [  
    0b00111100,
    0b01111110,
    0b11011011,
    0b11111111,
    0b10111101,
    0b10100101,
    0b10100101,
    0b00100100 
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
        var ar = numberToBinary( sprite[i], 8 );

        for(var j = 0; j < ar.length; j++)
        {
            var x = spriteX + j * dotSize;
            var y = spriteY + i * dotSize;

            if (ar[j] == 1)
                rect(x, y, dotSize, dotSize);
        }
    }
}


function numberToBinary(n, noBits)
{
    var s = n.toString(2);
    var delta = noBits - s.length;

    var ar = [];

    for(var i = 0; i < delta; i++)
    {
        ar.push(0);
    }

    for(var i = 0; i < s.length; i++)
    {
        var chr = s[i];
        ar.push( chr == "1" ? 1 : 0 );
    }

    return ar;
}
