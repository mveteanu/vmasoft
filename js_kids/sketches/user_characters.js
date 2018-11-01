// #SKETCHNAME User defined characters

// On a 8x8 grid, draw the characters that you want to write.
// We sugest to write your name... then convert from binary to hex and put the numbers here
// (based on characters from // based on characters from: github.com/dhepper/font8x8/)
var chars = {
    C : [ 0x3C, 0x66, 0xC0, 0xC0, 0xC0, 0x66, 0x3C, 0x00 ],
    O : [ 0x38, 0x6C, 0xC6, 0xC6, 0xC6, 0x6C, 0x38, 0x00 ],
    D : [ 0xF8, 0x6C, 0x66, 0x66, 0x66, 0x6C, 0xF8, 0x00 ],
    I : [ 0x78, 0x30, 0x30, 0x30, 0x30, 0x30, 0x78, 0x00 ],
    N : [ 0xC6, 0xE6, 0xF6, 0xDE, 0xCE, 0xC6, 0xC6, 0x00 ],
    G : [ 0x3C, 0x66, 0xC0, 0xC0, 0xCE, 0x66, 0x3E, 0x00 ],
}

noStroke();
fill("Teal");

printText("CODING", 100, 200, 13);


function printText(text, x, y, size)
{
    for(var i = 0; i < text.length; i++)
    {
        var chr = text[i];
        
        var xc = x + i * 8 * size;
        printChar(chr, xc, y, size);
    }
}

function printChar(chr, x, y, size)
{
    var bmp = chars[chr];
    
    if (bmp == null)
        return;
    
    for(var row = 0; row < bmp.length; row++)
    {
        var txtNo = numberToBinary(bmp[row], 8);
        
        for(var col = 0; col < txtNo.length; col++)
        {
            var xr = x + col * size;
            var yr = y + row * size;
            
            if (txtNo[col] == "1")
            {
                circle(xr + size / 2, yr + size / 2, size / 2 - 1);
            }
        }
    }
}

function numberToBinary(n, bits)
{
    var txt = n.toString(2);
    
    while(txt.length < bits)
        txt = "0" + txt;
        
    return txt;
}
