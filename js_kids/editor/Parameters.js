
function Parameters()
{
    const tutorialPrefix = "t=";
    
    var par = "";

    _init();

    // Returns true if the parameter from query string doesn't start with t...
    function isSketch()
    {
        return par && !par.startsWith(tutorialPrefix);
    }

    // Get the sketch id from query string
    function getSketchId()
    {
        return isSketch() ? par : "";
    }

    // Returns true if the parameter from query string starts with t...
    function isTutorial()
    {
        return par && par.length > tutorialPrefix.length && par.startsWith(tutorialPrefix);
    }

    // Get the tutorial id from query string
    function getTutorialId()
    {
        return isTutorial() ? par.substr( tutorialPrefix.length ) : "";
    }

    // Returns the parameter after the ? in Url
    function getUrlParameter()
    {
        var p = window.location.search;
        if (!p || p.length <= 1)
            return p;

        var pNext = p.indexOf("&");

        if (pNext == -1)
            return p.substr(1);

        return p.substr(1, pNext - 1);
    }


    function _init()
    {
        par = getUrlParameter();
    }

    return { isSketch : isSketch,
            getSketchId : getSketchId,
            isTutorial : isTutorial,
            getTutorialId : getTutorialId,
            getUrlParameter : getUrlParameter
    }

}
