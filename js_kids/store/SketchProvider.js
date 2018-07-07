
function SketchProvider()
{
    // ----------- Begin public functions --------------------

    var web;
    var db;
    var pk;

    var sketchId = "";

    _init();

    function loadFromUrl(onLoad)
    {
        if(!sketchId)
        {
            if (onLoad)
                onLoad(null);

                return;
        }

        var loader = isWebSketch(sketchId) ? web : db;

        loader.get(sketchId,
                    function(data) {
                        
                        var o = pk.unpack(data);

                        if (!o)
                            sketchId = "";

                        if (onLoad)
                            onLoad(o);
                    }, 
                    function() {
                        sketchId = "";
                        
                        if (onLoad)
                            onLoad(null);
                    });
    }

    function getSketchId()
    {
        return sketchId;
    }

    // ----------- Begin private functions ----------------------

    function _init()
    {
        web = WebFile();
        db = null; // should instatiate the firebase provider...
        pk = TextPacker();

        sketchId = getUrlParameter();
    }

    // Function verifies id format and returns if the sketch is a web file or should be loaded from web db...
    function isWebSketch(id)
    {
        return true;
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

    return {
        loadFromUrl : loadFromUrl,
        getSketchId : getSketchId
    }
}
