// #SKETCHNAME Navigate primes
noStroke();
fill(0);
textAlign(CENTER, CENTER);

const noRows = 20;
const noCols = 5;

// number of primes per page
const noPrimes = noRows * noCols;

var page = 0;
var arPrimes = [];
nextPrimes();

function loop()
{
    clear();
    
    printNumbers(arPrimes, page * noPrimes);
    printInformations();
}

function keyPressed()
{
    if (keyCode === RIGHT_ARROW)
    {
        // if displayed page is the last page...
        // then generate more primes before advancing page
        if (page + 1 === generatedPages())
            nextPrimes();
            
        page++;
    }
    else if (keyCode === LEFT_ARROW)
    {
        if (page > 0)
            page--;
    }
}

function printInformations()
{
    push();
    
    fill("Navy");
    
    text("Use LEFT and RIGHT arrows to change page.", 130, height - 10);
    text("Page " + (page + 1) + " / " + generatedPages(), width / 2, height - 10);
    text("Primes found: " + arPrimes.length, width - 250, height - 10);
    text("Max prime found: " + arPrimes.peek(), width - 100, height - 10);
    
    pop();
}

// Print numbers from array ar starting at inde startIndex
// Only numbers that will fit on the screen will be printed (noRows * noCols)
function printNumbers(ar, startIndex)
{
    var rowHeight = (height - 20) / noRows;
    var colWidth = width / noCols;
    
    for(var row = 0; row < noRows; row++)
    {
        for(var col = 0; col < noCols; col++)
        {
            var x = col * colWidth + colWidth / 2;
            var y = row * rowHeight + rowHeight / 2;
            
            var index = startIndex + row + col * noRows;
            
            text(ar[index], x, y);
        }
    }
}

function generatedPages()
{
    return arPrimes.length / noPrimes;
}

// Pushes a new set of primes into the global arPrimes array
function nextPrimes()
{
    var startAt = 2;
    
    if (arPrimes.length > 0)
        startAt = arPrimes.peek() + 1;
        
    var ar = getNextPrimes(startAt, noPrimes);

    for(var i of ar)
        arPrimes.push(i);
}


// Returns the next m primes greater or equal to n
// in an array
function getNextPrimes(n, m)
{
    var ar = [];
    var currNo = n - 1;

    while(ar.length < m)
    {
        currNo = getNextPrime(currNo + 1);
        ar.push(currNo);
    }

    return ar;
}

// Returns the next prime number that is 
// greater or equal to n
// console.log( getNextPrime(1000) );
function getNextPrime(n)
{
    while(true) // infinite loop
    {
        if ( isPrime(n) )
            return n;   // exit only if one prime number is found

        n++;    // it is OK to change n inside function
                // since n is passed by value...
    }
}

// Returns true if specified number is prime
function isPrime(n)
{
    if (n < 2)
        return false;
    
    var max = sqrt(n);
    
    for(var i = 2; i <= max; i++)
    {
        if (n % i === 0)
            return false;
    }
    
    return true;
}
