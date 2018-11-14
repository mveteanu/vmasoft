function generate2DMatrix(rows, cols)
{
    var arRows = new Array(rows);
    
    for(var i = 0; i < arRows.length; i++)
    {
        arRows[i] = new Array(cols);
    }
    
    return arRows;
}

function fillRandom(ar)
{
    for(var row of ar)
    {
        for(var col = 0; col < row.length; col++)
        {
            row[col] = randomChr("A", "Z");
        }
    }
}

function randomChr(chr1, chr2)
{
    var code1 = chr1.charCodeAt(0);
    var code2 = chr2.charCodeAt(0);
    
    var code = randomInt(code1, code2);
    
    return String.fromCharCode(code);
}

// Get a random int between min and max (both included)
function randomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
