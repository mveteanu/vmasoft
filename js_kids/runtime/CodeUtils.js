
function CodeUtils(code)
{
    var sCode = code;

    var arPublicEvents = ["loop", "enter"];
    var arPublicVars = []; //[ "PublicVars" ];

    var sWithObject = "";

    var arDetectedFunctions = [];

    // Add specified events to the public events array
    // Usually: mouseClicked, keyPressed, ...
    function addP5Events(arEvents)
    {
        arPublicEvents = arPublicEvents.concat(arEvents);
    }

    // Set the "with" keyword that will wrap the scene code (if specified)
    function setWith(withName)
    {
        sWithObject = withName;
    }


    // Parse the code and sets internal variables with information about code
    function parse()
    {
        arDetectedFunctions = detectEvents();
    }

    
    // Returns true if the scene code has loop() function defined
    function hasLoop()
    {
        return arDetectedFunctions.indexOf("loop") >= 0;
    }

    
    // Return true if the scene code has enter() function defined
    function hasEnter()
    {
        return arDetectedFunctions.indexOf("enter") >= 0;
    }


    // Converts the scene code to a function
    function getSceneFunction()
    {
        // if (!sCode)
        //     return null;
        
        var sPrefixCode = getScenePrefixCodeAsText();
        var sReturnLine = getSceneReturnAsText();

        var sFnCode = sPrefixCode + "\n" + sCode + "\n" + sReturnLine + "\n";

        if (sWithObject)
        {
            sFnCode = "with (sceneFunctionArgs." + sWithObject + ") \n {\n" + 
                    sFnCode +
                    "}\n";
        }

        return new Function("sceneFunctionArgs", sFnCode);
    }


    // --------- Begin private functions ------------------


    // Returns an array with detected public events
    function detectEvents()
    {
        var arDetectedFunctions = [];

        if (arPublicEvents)
        {
            for(var i = 0; i < arPublicEvents.length; i++)
            {
                var fn = arPublicEvents[i];
                if(hasFunction(fn))
                    arDetectedFunctions.push(fn);
            }
        }

        return arDetectedFunctions;
    }


    // Returns true if the specified code contains the specified function
    // Works by doing text processing on the code
    function hasFunction(sFunctionName)
    {
        if (!sFunctionName || !sCode)
            return false;
        
        //TODO: Improve the logic for detecting if specified function is part of the code
        //to cover scenarios such as extra white spaces ... or the other declaration var loop = function()
        return sCode.indexOf("function " + sFunctionName + "(") >= 0;
    }


    // Returns the line of code that should represent the return from scene closure
    function getSceneReturnAsText()
    {
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

            function preload()
            {
            }

            function background()
            {
                sceneFunctionArgs.SceneBackground = arguments;
            }`;
    }



    return { addP5Events : addP5Events,
            setWith : setWith,
            parse : parse,
            hasLoop : hasLoop,
            hasEnter : hasEnter,
            getSceneFunction : getSceneFunction }
}
