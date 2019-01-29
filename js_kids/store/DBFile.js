
function DBFile(db)
{
    // --------------- Begin public functions ------------------
    
    async function get(id)
    {
        return db.getFile(id);
    }

    async function save(txt, id, title)
    {
        if (!id)
        {
            var doc = await db.createFile(txt, title);
            return doc.id;
        }
        else
        {
            await db.saveFile(id, txt, title);
            return id;
        }
    }


    // --------------- Begin private functions ------------------

    return {
        get : get,
        save : save
    }
}
