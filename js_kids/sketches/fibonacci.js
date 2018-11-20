// #SKETCHNAME Fibonacci
var n = 10;

println("Fibonacci using recursion");
println( "F(" + n + ")=" + fib1(n) );
println();

println("Fibonacci using iterative approach");
println( "F(" + n + ")=" + fib2(n) );
println();

println("Precalculate Fibonacci numbers");
var ar = getFibNumbers(n + 1);
for(var i = 0; i < ar.length; i++)
{
    println( "F(" + i + ")=" + ar[i] );
}


// Returns an array with the first n Fibonacci numbers
function getFibNumbers(n)
{
    if (n === 1)
        return [0];
    
    var ar = [0 , 1];

    if (n === 2)
        return ar;

    while(ar.length < n)
    {
        var len = ar.length;
        ar.push( ar[len - 1] + ar[len - 2] );
    }

    return ar;
}

// Finds the nth Fibonacci number using recursion
// F(0) = 0
// F(1) = 1
// F(n) = F(n-1) + F(n-2)
function fib1(n)
{
    if (n === 0)
        return 0;

    if (n === 1)
        return 1;

    return fib1(n-1) + fib1(n-2);
}

// Finds the nth Fibonacci number using iterative calculations
function fib2(n)
{
    if (n === 0)
        return 0;

    if (n === 1)
        return 1;

    var n1 = 0;
    var n2 = 1;

    for(var i = 2; i <= n; i++)
    {
        var sum = n1 + n2;

        n1 = n2;
        n2 = sum;
    }

    return n2;
}
