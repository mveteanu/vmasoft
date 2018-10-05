// #SKETCHNAME Input text
// #BEGINSCENE Input
var buffer = "";
var t = 0;
var tmax = 8;

background('Field')

textSize(32);
fill(0);
noStroke();

function loop()
{
    clear();
    text("Enter your name:", 100, 100);    
    
    displayText(100, 140);
}

function keyPressed()
{
    if(keyCode == ENTER && buffer.length > 0)
    {
        showScene("DisplayText", buffer)
    }
    else if (keyCode == BACKSPACE)
    {
        buffer = buffer.substr(0, buffer.length - 1);
    }
    else if ((keyCode >= 65 && keyCode <= 90) || keyCode == 32  )
    {
        buffer += key;
    }
}

function displayText(atx, aty)
{
    text(buffer + (t <= tmax ? "_" : ""), atx, aty);
    
    t++;
    if ( t >= tmax * 2 )
        t = 0;
}
// #BEGINSCENE DisplayText
function enter()
{
    clear();

    textAlign(CENTER, CENTER);
    textSize(24);

    var msg = PublicVars.Arguments;
    text("Hello " + msg, width / 2, height /2);
}

function keyPressed()
{
    showScene("Input");
}