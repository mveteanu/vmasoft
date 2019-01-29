// #SKETCHNAME Fibonacci list
// #BEGINSCENE Code
const numbers = require("BigNumbers");

const setSize = 10;
const rowSize = (height - 20) / setSize;

var arFibonacci = [];
nextFibonaccis(arFibonacci, setSize);

// keep track of the set that will be displayed on screen
var index = 0;

// if true, the numbers are formatted with group separator
var format = true;

function loop()
{
    clear();
    
    display();
    displayInformation();
}

function keyPressed()
{
    if (keyCode === RIGHT_ARROW)
    {
        index += setSize;
        
        if(index >= arFibonacci.length)
            nextFibonaccis(arFibonacci, setSize);
    }
    else if (keyCode === LEFT_ARROW)
    {
        if (index >= setSize)
            index -= setSize;
    }
    else if (key.toUpperCase() === "F")
    {
        format = !format;
    }
}

// Display the set of Fibonacci numbers that start at index
function display()
{
    textAlign(LEFT, TOP);
    noStroke();
    fill(0);

    for(var i = 0; i < setSize; i++)
    {
        var s = arFibonacci[index + i];
        
        if (format)
            s = numbers.format(s);
        
        var line = "F(" + (index + i) + ") = " + s;
        text(line, 10, rowSize * i, 750, rowSize);
    }
}

function displayInformation()
{
    push();
    fill("Navy");
    
    text("Press LEFT and RIGHT arrows to navigate Fibonacci numbers. F to toggle formatting.", 10, height - 20);
    text("F(n)=F(n-2)+F(n-1)", 500, height - 20);
    
    var n = index + 9;
    var s = arFibonacci[n];
    
    var line = "F(" + (n) + ") has " + s.length + " digits.";
    text(line, 670, height - 20);
    
    pop();
}

// Adds a new set of n Fibonacci numbers to the specified array
function nextFibonaccis(ar, n)
{
    for(var i = 0; i < n; i++)
    {
        nextFibonacci(ar);
    }
}

// Adds the next Fibonacci number to the specified array
function nextFibonacci(ar)
{
    var n = ar.length;
    
    if (n === 0)
    {
        ar.push("0");
        return;
    }
    
    if (n === 1)
    {
        ar.push("1");
        return;
    }

    var p1 = ar[n - 1];
    var p2 = ar[n - 2];

    var p = numbers.add(p1, p2);

    ar.push(p);
}
// #BEGINSCENE BigNumbers
// Adds numbers specified by strings s1 and s2
// s1 and s2 should contain only positive integer numbers (0 ...)
function add(s1, s2)
{
    var n = max(s1.length, s2.length);
    var c = "";
    var carry = 0;
    
    var s = "";
    
    for(var i = 0; i < n; i++)
    {
        var c1 = charFromRight(s1, i);
        var c2 = charFromRight(s2, i);
        
        [c, carry] = addChars(c1, c2, carry);
        
        if (c.length !== 1)
            return "ERROR";
        
        s = c + s;
    }
    
    if (carry)
        s = "1" + s;
    
    return s;
}

// Format a big number specified as string and returns a string
function format(s)
{
    var txt = "";
    var n = s.length;

    for(var i = 1; i <= n; i++)    
    {
        var c = s[n - i];
        
        txt = c + txt;
        
        if (i < n && i % 3 === 0)
            txt = ", " + txt;
    }
    
    return txt;
}


// Returns from strings the character specified by position ... counting from right
// Function returns "0" if position is bigger than the string length
function charFromRight(s, position)
{
    var n = s.length;
    
    if (position >= n)
        return "0";
        
    return s[n - position - 1];
}

// Adds (using carry) two single digit numbers specified as chars
// Returns the single digit result plus carry
function addChars(c1, c2, carry)
{
    var n1 = charToDigit(c1);
    var n2 = charToDigit(c2);

    if (isNaN(n1) || isNaN(n2))
        return ["", 0];
    
    var n = n1 + n2 + carry;
    
    var code = (n % 10) + 48;
    var chr = String.fromCharCode(code);
    
    return [chr, n >= 10 ? 1 : 0];
}

// Convert a char containing a digit to a number
function charToDigit(chr)
{
    var code = chr.charCodeAt(0);
    if (code < 48 || code > 57)
        return NaN;
        
    return code - 48;
}
