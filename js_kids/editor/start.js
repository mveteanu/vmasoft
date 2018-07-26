
var oShell;
var html;

html = HtmlUtils();
dialogs = Dialogs();

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

window.onbeforeunload = function()
{
}
