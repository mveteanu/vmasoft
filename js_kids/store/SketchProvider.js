
function SketchProvider()
{
    var web = WebFile();
    var db = null; // should instatiate the firebase provider...
    var pk = TextPacker();

    // ----------- Begin public functions --------------------

    function get(sketchId, onLoad)
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
                        o.Id = sketchId;
                        
                        o.ReadOnly = true;  // I should set .ReadOnly = true for web sketches ... and DB sketches loaded from DB but from other users...

                        if (onLoad)
                            onLoad(o);
                    }, 
                    function() {
                        if (onLoad)
                            onLoad(null);
                    });
    }


    function getByUrl(sketchUrl, onLoad)
    {
        if(!sketchUrl)
        {
            if (onLoad)
                onLoad(null);

                return;
        }

        web.getFromUrl(sketchUrl,
                    function(data) {
                        
                        var o = pk.unpack(data);

                        if (onLoad)
                            onLoad(o);
                    }, 
                    function() {
                        if (onLoad)
                            onLoad(null);
                    });
    }


    // ----------- Begin private functions ----------------------

    // Function verifies id format and returns if the sketch is a web file or should be loaded from web db...
    function isWebSketch(id)
    {
        return true;
    }

    return {
        get : get,
        getByUrl : getByUrl
    }
}
