var ar = [];
var sortRound;


function loop()
{
    if (frameCount % 15 != 0)
        return;

    clear();
    
    if ( !sortArray(ar) )
    {
        ar = generateArray( width / 8, 0, height );
        sortRound = 1;
    }

    displayArray( ar );
}


function sortArray(ar)
{
    var sortPerformed = false;
    
    for(var i = 0; i < ar.length - 1; i++)
    {
        var a = ar[i].n;
        if (a > ar[i+1].n)
        {
            ar[i].n = ar[i+1].n;
            ar[i+1].n = a;
            
            ar[i].color = "red";

            sortPerformed = true;
        }
        else
        {
            ar[i].color = "black";
        }
    }

    return sortPerformed;
}

function generateArray(n, x1, x2)
{
    var ar = [];

    for(var i = 0; i < n; i++)
    {
        ar.push( { n : round(random(x1, x2)), color: "black" } );
    }

    return ar;
}


function displayArray(ar)
{
    var n = ar.length;
    
    for(var i = 0; i < n; i++)
    {
        var no = ar[i].n;
        
        var x = map(i, 0, n, 0, width);
        
        strokeWeight(4);
        stroke(ar[i].color);
        line(x, height - no, x, height);

        var r = floor(i / 15);
        var c = i - r * 15;

        stroke("white");
        fill(ar[i].color);
        text(no, c * 30, r * 12 + 30);
    }

    stroke("white");
    text("Round: " + sortRound++, 0, 12)
}

