
// Loads all scripts with the custom language attribute
// Returns an array of objects containing script name and script text
function _getScriptFromHTML()
{
    var arScripts = [];
    var arAllScripts = document.getElementsByTagName("script");

    for(var script of arAllScripts)
    {
        if (script.getAttribute("language") == "kidscript")
        {
            arScripts.push( { name : script.id, code : script.text} );
        }
    }

    return arScripts;
}
