
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
        //o.ReadOnly = webSketch || !(await _db.ownFile(sketchId));
        o.ReadOnly = webSketch || !ownFile(data);

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
        var user = _db.getCurrentUser();
        if (!user)
            return null;
        
        var txt = pk.pack(objSketch, user.uid)
        if (!txt)
            return null;

        return db.save(txt, id, objSketch.Name);
    }

    async function setPublic(sketchId, bPublic)
    {
        return _db.setPublic(sketchId, bPublic);
    }

    async function setName(sketchId, name)
    {
        return _db.setName(sketchId, name);
    }

    async function getMyFiles()
    {
        return _db.getMyFiles();
    }

    async function deleteFile(sketchId)
    {
        return _db.deleteFile(sketchId);
    }

    // ----------- Begin private functions ----------------------

    // Function verifies id format and returns if the sketch is a web file or should be loaded from web db...
    function isWebSketch(id)
    {
        return id && (id.length < 20 || id.indexOf("/") >= 0 );
    }

    // Note: Sketches contain user id in the comments section... therefore a brute search should find it...
    function ownFile(txt)
    {
        var user = _db.getCurrentUser();
        if (!user)
            return false;

        return txt.indexOf(user.uid) >= 0;
    }

    return {
        get : get,
        getByUrl : getByUrl,
        save : save,
        setPublic : setPublic,
        setName : setName,
        getMyFiles : getMyFiles,
        deleteFile : deleteFile
    }
}
