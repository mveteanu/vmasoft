
function WebFile()
{
    // --------------- Begin public functions ------------------
    
    function get(id, onSuccess, onError)
    {
        var url = getSketchUrl(id);

        getFromUrl(url, onSuccess, onError);
    }

    function getFromUrl(url, onSuccess, onError)
    {
        // use the 'Easy Function' loadText
        loadText(url, onSuccess, onError);
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
