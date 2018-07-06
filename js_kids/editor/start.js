
var oShell;
var html;

html = HtmlUtils();

window.onload = function() 
{
    oShell = Shell();
    oShell.addFromUrl();
}

window.onresize = function()
{
    oShell.onresize();
}
