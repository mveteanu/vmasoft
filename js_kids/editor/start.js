
var oShell;
var html;

html = HtmlUtils();

window.onload = function() 
{
    oShell = Shell();
    oShell.addScene("Intro", "var x = 'Intro';");
}

window.onresize = function()
{
    oShell.onresize();
}
