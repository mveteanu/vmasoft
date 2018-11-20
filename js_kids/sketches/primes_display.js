// #SKETCHNAME Display primes
noStroke();
fill(0);
textAlign(CENTER, CENTER);

const noRows = 20;
const noCols = 5;

// number of primes per page
const noPrimes = noRows * noCols;

var arPrimes = [];
var speed = 1;
var found = 0;

function loop()
{
    clear();
    
    nextPrimes();
    printNumbers(arPrimes);
    printInformations();
    
    readKeys();
}

function readKeys()
{
    if (keyIsDown(RIGHT_ARROW))
    {
        speed++;
    }
    else if (keyIsDown(LEFT_ARROW))
    {
        if (speed > 0)
            speed--;
    }
}

function printInformations()
{
    push();
    
    fill("Navy");
    
    text("Use LEFT and RIGHT vary speed or pause.", 130, height - 10);
    text("Speed: " + speed, width / 2, height - 10);
    text("Primes found: " + found, width - 100, height - 10);

    pop();
}

// Print numbers from array ar that will fit on the screen (noRows * noCols)
function printNumbers(ar)
{
    var rowHeight = (height - 20) / noRows;
    var colWidth = width / noCols;
    
    for(var row = 0; row < noRows; row++)
    {
        for(var col = 0; col < noCols; col++)
        {
            var x = col * colWidth + colWidth / 2;
            var y = row * rowHeight + rowHeight / 2;
            
            var index = row + col * noRows;
            
            text(ar[index], x, y);
        }
    }
}

// Generate new primes
function nextPrimes()
{
    repeat(speed, () => 
    {
        var startAt = 2;
        
        if (arPrimes.length > 0)
            startAt = arPrimes.peek() + 1;
            
        arPrimes = getNextPrimes(startAt, noPrimes);
        found += arPrimes.length;
    });
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
