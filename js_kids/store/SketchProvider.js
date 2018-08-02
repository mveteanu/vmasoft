
function SketchProvider(_db)
{
    var web = WebFile();
    var db = DBFile(_db);
    var pk = TextPacker();

    // ----------- Begin public functions --------------------

    async function get(sketchId)
    {
        if(!sketchId)
            return null;

        var webSketch = isWebSketch(sketchId);
        var loader = webSketch ? web : db;

        var data = await loader.get(sketchId);
        var o = pk.unpack(data);

        if (!o)
            return o;

        o.Id = sketchId;
        o.ReadOnly = webSketch || !(await db.ownFile(sketchId));

        return o;
    }


    async function getByUrl(sketchUrl)
    {
        if(!sketchUrl)
            return null;

        var data = await web.getFromUrl(sketchUrl);
        var o = pk.unpack(data);

        return o;
    }

    async function save(objSketch, id)
    {
        var txt = pk.pack(objSketch)
        if (!txt)
            return null;

        return db.save(txt, id);
    }

    // ----------- Begin private functions ----------------------

    // Function verifies id format and returns if the sketch is a web file or should be loaded from web db...
    function isWebSketch(id)
    {
        return id && id.length <= 5;
    }

    return {
        get : get,
        getByUrl : getByUrl,
        save : save
    }
}
