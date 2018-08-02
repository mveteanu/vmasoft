
function WebFile()
{
    // --------------- Begin public functions ------------------
    
    async function get(id)
    {
        var url = getSketchUrl(id);
        return getFromUrl(url);
    }

    async function getFromUrl(url)
    {
        var response = await fetch(url);
        return response.text();
    }

    
    // --------------- Begin private functions ------------------

    function getSketchUrl(id)
    {
        return "sketches/" + id + ".js";
    }


    return {
        get : get,
        getFromUrl : getFromUrl
    }
}
