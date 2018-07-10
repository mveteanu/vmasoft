
var oShell;
var html;

html = HtmlUtils();

window.OnSketchReady = function()
{
    oShell = Shell();
    oShell.addFromUrl();
    oShell.loadAssets();
}

window.onresize = function()
{
    if (oShell)
    {
        oShell.onresize();
    }
}
