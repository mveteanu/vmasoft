
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
        return response.text();
    }


    function getTutorialUrl(id)
    {
        return "tutorials/" + id + "/index.json";
    }


    return {
        getTutorial : getTutorial,
        getPageUrl : getPageUrl,
        getSketchUrl : getSketchUrl
    }

}
