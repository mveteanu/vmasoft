// #SKETCHNAME Demo

// #BEGINSCENE Scene1

background("lightyellow");
var player = sprite("player");
player.depth = 0;
sprite("player", 100, 100);

sprite("askterisk_stretching", 500, 100);

sprite("asterisk_explode", 500, 250);

var x = 0;

PublicVars.MyName = "VMA";
GlobalVars.MyName = "VMASOFT";

function loop()
{
    clear();

    line(0, x, width, x);
    x = x + 1;

    if ( x == height )
        x = 0;

    text( "From " + PublicVars.PreviousScene + ": " + PublicVars.Arguments, 10, 10 );

    var s2vars = getPublicVars("Scene2");
    text( "Scene2 PublicVars.x = " + s2vars.x, 10, 30);
}

function mouseClicked()
{
    sound("doorbell");
    showScene("Scene2", x);
    //showNextScene(x);
}

function touchStarted()
{
    sound("doorbell");
    showScene("Scene2", x);

    return false;
}


// #BEGINSCENE Scene2

background("lightblue");


if (PublicVars.Arguments != null)
{
    background("pink");
}

var p = sprite("asterisk_explode");
//p.position.x += 100;

var x = -1;

circle(width / 2, height / 2, 50);

text( "From " + PublicVars.PreviousScene + ": " + PublicVars.Arguments, 10, 10 );

//PublicVars.x = Math.random(10);
if (!PublicVars.x)PublicVars.x = 0;
PublicVars.x++;

function enter_()
{
    if (PublicVars.Arguments != null)
    {
        background("green");
        text("Text displayed by enter(). Should be green...", 10, 30);   
    }
}

function loop_()
{
    clear();
    line(x, 0, x, height);
    x = x + 1;

    if ( x == width )
        x = 0;

    text( "From " + PublicVars.PreviousScene + ": " + PublicVars.Arguments, 10, 10 );

    PublicVars.x = x;
}

function mouseClicked()
{
    var scene1Vars = getPublicVars("Scene1");
    //console.log(scene1Vars.MyName);
    //console.log(GlobalVars.MyName);
    
    background("lime");

    showScene("Scene1", x);
    //showNextScene(x);
}

function mouseMoved()
{
    p.position.x = mouseX;
    p.position.y = mouseY;

    circle(mouseX, mouseY, 10);
}

function touchStarted()
{
    showScene("Scene1");    
}
