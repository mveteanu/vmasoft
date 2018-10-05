
function TutorialProvider()
{

    // ----------- Begin public functions --------------------

    async function getTutorial(id)
    {
        var data = await _getTutorial(id);
        if (!data)
            return null;

        var o = JSON.parse(data);
        o.Id = id;

        return o;
    }

    async function getPage(oPage, oTutorial)
    {
        var url = getPageUrl(oPage, oTutorial);
        var r = await fetch(url);

        return r.text();
    }

    function getPageUrl(oPage, oTutorial)
    {
        if (!oPage || !oPage.Page)
            return "";
        
        return "tutorials/" + oTutorial.Id + "/" + oPage.Page;
    }


    function getSketchUrl(oPage, oTutorial)
    {
        if (!oPage || !oPage.Sketch)
            return "";

        return "tutorials/" + oTutorial.Id + "/" + oPage.Sketch;
    }


    // ----------- Begin private functions ----------------------


    async function _getTutorial(id)
    {
        var url = getTutorialUrl(id);

        var response = await fetch(url);
        return response.ok ? response.text() : "";
    }

    function getTutorialPath(id)
    {
        return "tutorials/" + id;
    }

    function getTutorialUrl(id)
    {
        return "tutorials/" + id + "/index.json";
    }


    return {
        getTutorial : getTutorial,
        getPageUrl : getPageUrl,
        getPage : getPage,
        getTutorialPath : getTutorialPath,
        getSketchUrl : getSketchUrl
    }

}
