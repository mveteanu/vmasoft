
function WebFile()
{
    // --------------- Begin public functions ------------------
    
    function get(id, onSuccess, onError)
    {
        var url = getUrl(id);
        
        fetch(url)
            .then(function(response) { 
                    return response.text();
                } )
            .then(function(text) { 
                if (onSuccess) 
                    onSuccess(text); 
                } )
            .catch(function(error) {
                if (onError)
                    onError(error)
            });
    }

    // --------------- Begin private functions ------------------

    function getUrl(id)
    {
        return "sketches/" + id + ".js";
    }

    return {
        get : get
    }
}
