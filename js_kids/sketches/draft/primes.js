printPrimes(10000, 10);

// Returns the next m primes greater or equal to n
// in an array
function printPrimes(n, m)
{
    var currNo = n - 1;

    for(var i = 0; i < m; i++)
    {
        currNo = getNextPrime(currNo + 1);
        println(currNo);
    }
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
