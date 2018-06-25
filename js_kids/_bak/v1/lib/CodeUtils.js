
function CodeUtils()
{
    var arPublicEvents = ["loop", "enter"];
    var arPublicVars = []; //[ "PublicVars" ];

    // Add specified events to the public events array
    // Usually: mouseClicked, keyPressed, ...
    function addP5Events(arEvents)
    {
        arPublicEvents = arPublicEvents.concat(arEvents);
    }

    // Returns true if the specified code contains the specified function
    // Works by doing text processing on the code
    function hasFunction(sCode, sFunctionName)
    {
        if (!sFunctionName || !sCode)
            return false;
        
        //TODO: Improve the logic for detecting if specified function is part of the code
        //to cover scenarios such as extra white spaces ... or the other declaration var loop = function()
        return sCode.indexOf("function " + sFunctionName + "()") >= 0;
    }


    // Returns an array with detected public events
    function detectEvents(sCode)
    {
        var arDetectedFunctions = [];

        if (arPublicEvents)
        {
            for(var i = 0; i < arPublicEvents.length; i++)
            {
                var fn = arPublicEvents[i];
                if(hasFunction(sCode, fn))
                    arDetectedFunctions.push(fn);
            }
        }

        return arDetectedFunctions;
    }


    // Returns the line of code that should represent the return from scene closure
    function getSceneReturnAsText(sCode)
    {
        var arDetectedFunctions = detectEvents(sCode);

        var sReturn = "return {";
        
        var n = arDetectedFunctions.length;

        for(var i = 0; i < n; i++) 
        {
            var fn = arDetectedFunctions[i];
            sReturn += fn + " : " + fn;
            if(i < n - 1)
                sReturn += ", ";
        }

        for(var i = 0; i < arPublicVars.length; i++)
        {
            if ( n > 0 || i > 0 )
                sReturn += ", ";
                sReturn += arPublicVars[i] + " : " + arPublicVars[i];
        }

        sReturn += "};"

        return sReturn;
    }

    function getScenePrefixCodeAsText()
    {
        return `
            var PublicVars = sceneFunctionArgs.PublicVars;

            function background()
            {
                sceneFunctionArgs.SceneBackground = arguments;

                if (sceneFunctionArgs.backgroundCallBack)
                {
                    sceneFunctionArgs.backgroundCallBack();
                }
            }`;
    }


    // Converts the scene code to a function
    function getSceneFunction(sCode)
    {
        if (!sCode)
            return null;
        
        var sPrefixCode = getScenePrefixCodeAsText();
        var sReturnLine = getSceneReturnAsText(sCode);
        var sFnCode = sPrefixCode + "\n" + sCode + "\n" + sReturnLine + "\n";

        return new Function("sceneFunctionArgs", sFnCode);
    }


/*
    // Returns the text of the Scene function (complete with the closure return line)
    function getSceneFunctionAsText(sCode, sFunctionName)
    {
        if (!sFunctionName || !sCode)
            return "";
        
        var sReturnLine = getSceneReturnAsText(sCode);

        return "function " + sFunctionName + "() {\n" + sCode + "\n" + sReturnLine + "\n}";
    }
*/

    return { addP5Events : addP5Events,
            getSceneFunction : getSceneFunction }
}
