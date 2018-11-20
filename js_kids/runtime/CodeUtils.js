
function CodeUtils(code)
{
    var sCode = code;

    var arPublicVars = []; //[ "PublicVars" ];

    var sWithObject = "";

    var arDetectedFunctions = [];


    // Set the "with" keyword that will wrap the scene code (if specified)
    function setWith(withName)
    {
        sWithObject = withName;
    }


    // Parse the code and sets internal variables with information about code
    function parse()
    {
        arDetectedFunctions = getFunctions(sCode);
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
            sFnCode = "with (sceneFunctionArgs." + sWithObject + ") \n{\n" + 
                    sFnCode +
                    "}\n";
        }

        return new Function("sceneFunctionArgs", sFnCode);
    }


    // --------- Begin private functions ------------------

    // Returns an array with all the functions from a script
    function getFunctions(script)
    {
        if (!script)
            return [];
        
        var arLines = script.split("\n");
        
        var ar = [];
        var inComment = 0;
        var inFunction = 0;
    
        for(var line of arLines)
        {
            line = line.trimLeft();
    
            if (line.startsWith("//"))
                continue;
            
            // ... needs update to better handle multi-line comments
            if (line.indexOf("/*") >= 0)
                inComment++;
            
            if (line.indexOf("*/") >= 0 && inComment >= 0)
                inComment--;
    
            if (inComment === 0 && inFunction === 0 && line.startsWith("function"))
            {
                var fn = getFunction(line);
                ar.push(fn);
            }

            if (inComment === 0 && inFunction === 0 && line.startsWith("class"))
            {
                var fn = getClass(line);
                ar.push(fn);
            }

            if (!inComment)
            {
                if (line.indexOf("{") >= 0)
                    inFunction++;
    
                if (line.indexOf("}") >= 0 && inFunction >= 0)
                    inFunction--;
            }
        }
    
        return ar;
    }


    function getClass(line)
    {
        var keyword = "class";

        var i1 = keyword.length + 1;

        var i2 = line.indexOf("\n", i1);

        if (i2 < 0)
            i2 = line.indexOf("\r", i1);

        if (i2 < 0)
            i2 = line.indexOf(" ", i1);

        if (i2 < 0)
            i2 = line.indexOf("\t", i1);

        if (i2 < 0)
            i2 = line.indexOf("{", i1);

        if (i2 < 0)
            i2 = line.length;

        if (i1 >= line.length || i1 >= i2)
            return null;
            
        var fn = line.substr(i1, i2 - i1);

        return fn.trim();
    }

       
    // Returns the function name from a function code line
    function getFunction(line)
    {
        var keyword = "function";
    
        var i1 = keyword.length;
        var i2 = line.indexOf("(", i1);
    
        if (i1 >= line.length || i1 >= i2)
            return null;
    
        var fn = line.substr(i1, i2 - i1);
    
        return fn.trim();
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
        return `var PublicVars = sceneFunctionArgs.PublicVars;
var sceneArgs = PublicVars.Arguments;

function preload()
{
}

function background()
{
    sceneFunctionArgs.SceneBackground = arguments;
}

function frameRate()
{
    p5.prototype.frameRate.apply(window, arguments);
}

function cursor()
{
    p5.prototype.cursor.apply(window, arguments);
}

function noCursor()
{
    p5.prototype.noCursor.apply(window, arguments);
}

`;
    }


    return { setWith : setWith,
            parse : parse,
            hasLoop : hasLoop,
            hasEnter : hasEnter,
            getSceneFunction : getSceneFunction }
}
