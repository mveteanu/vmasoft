
function TutorialProvider()
{

    // ----------- Begin public functions --------------------

    function getTutorial(id, onLoad)
    {
        _getTutorial(id, 
                        function(data){
                            var o = JSON.parse(data);
                            o.Id = id;

                            if (onLoad)
                                onLoad(o);
                        },
                        function(){
                            if (onLoad)
                                onLoad(null);
                        });
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


    function _getTutorial(id, onSuccess, onError)
    {
        var url = getTutorialUrl(id);

        loadText(url, onSuccess, onError);
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
