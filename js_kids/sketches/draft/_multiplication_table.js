println("Multiplication table");
println("====================");

for(var i = 1; i <= 10; i++)
{
    printTable(i);
    println();
}

function printTable(n)
{
    for(var i = 1; i <= 10; i++)
    {
        var line = n + " * " + i + " = " + n * i;
        println(line);
    }
}
