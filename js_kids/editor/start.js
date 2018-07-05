
var oShell;
var html;

html = HtmlUtils();


var sketch = {
    Name : "My sketch",
    Files : [
{ 
"Name" : "Intro",
"Code" : 
`var s = 'Intro';
text(s, 10, 10);

function mouseClicked()
{
    showScene("Game");
}
`
},
{ 
"Name" : "Game",
"Code" : 
`circle(400, 300, 200);

function mouseClicked()
{
    showScene("Intro");
}
`
}
] };


window.onload = function() 
{
    oShell = Shell();
    oShell.addFromUrl();

    // oShell.addSketch(sketch);
    // oShell.showScene(0);
    //oShell.run();
}

window.onresize = function()
{
    oShell.onresize();
}
