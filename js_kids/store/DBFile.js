
function DBFile(db)
{
    // --------------- Begin public functions ------------------
    
    async function get(id)
    {
        return db.getFile(id);
    }

    async function save(txt, id)
    {
        if (!id)
        {
            var doc = await db.createFile();
            if (!doc)
                return null;

            id = doc.id;
        }

        return db.saveFile(id, txt);
    }

    async function ownFile(id)
    {
        return db.ownFile(id);
    }

    // --------------- Begin private functions ------------------

    return {
        get : get,
        save : save,
        ownFile : ownFile
    }
}
