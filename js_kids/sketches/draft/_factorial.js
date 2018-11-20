for(var i = 1; i <= 10; i++)
{
    printFactorial(i);
}

function printFactorial(n)
{
    var p = factorial(n);
    
    var txt = n + "! = " + p + " = ";
    
    for(var i = 1; i < n; i++)
    {
        txt += i + "*";
    }
    
    txt += n;
    
    println(txt);
}

function factorial(n)
{
    var p = 1;
    
    for(var i = 1; i <= n; i++)
    {
        p *= i;
    }
    
    return p;
}
