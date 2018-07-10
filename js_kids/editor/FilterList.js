var FilterListEvents = {
    OnItemSelected : "itemselected"
}


function FilterList(idList)
{
    var oList;
    var oTagsContainer;
    var oItemsContainer;
    var oSearch;

    var arAddedTags = getTags(false);
    var arAddedItems = [];
    var itemTemplate = "";
    var oMapEventes = new Map();

    _init();

    // ----------- Begin public functions ----------------------

    function setItemTemplate(_itemTemplate)
    {
        itemTemplate = _itemTemplate;
    }

    function addItem(name, tags, data)
    {
        var txt = buildItemHtml(data);

        var oItem = html.appendElement(txt, oItemsContainer);
        oItem.addEventListener("click", handleItemClick)
        arAddedItems.push( { Name : name, Tags : tags, Element : oItem } );

        addTags(tags);

        return oItem;
    }

    // Register a new event listner
    function addEventListener(eventName, fn)
    {
        oMapEventes.set(eventName, fn);
    }

    // ---------------- Begin private functions --------------------

    function _init()
    {
        oList = html.findElement(idList);
        oTagsContainer = html.findFirstElement("filterlisttags", oList);
        oItemsContainer = html.findFirstElement("filterlistcontent", oList);
        
        oSearch = html.findFirstTag("input", oList);
        oSearch.addEventListener("keyup", handleSearch);
        oSearch.addEventListener("search", handleSearch);
    }
   

    function buildItemHtml(data)
    {
        if (!data)
            return itemTemplate;

        var txt = itemTemplate;

        for(var i = 0; i < data.length; i++)
            txt = txt.replace("$data" + i, data[i]);

        return txt;
    }

    function addTags(arTags)
    {
        if (!arTags || arTags.length == 0)
            return;

        for(var tag of arTags)
            addTag(tag);
    }

    // Add a new tag to the tags area if doesn't exist already
    function addTag(tag)
    {
        if (!tag)
            return;

        tag = tag.trim();

        if (arAddedTags.indexOf(tag) >= 0)
            return;

        arAddedTags.push(tag);

        var txt = `<div class="filterlisttag">${tag}</div>\n`;
        var oTag = html.appendElement(txt, oTagsContainer);
        oTag.addEventListener("click", handleTagClick);

        return oTag;
    }

    function findTag(tag)
    {
        if (!tag)
            return null;

        var arTags = html.findElements("filterlisttag", oTagsContainer);
        if (!arTags)
            return null;
        
        var upperTag = tag.trim().toUpperCase();
        
        for(var i = 0; i < arTags.length; i++)
        {
            var currTag = arTags[i];
            if (currTag.innerText.trim().toUpperCase() == upperTag)
                return currTag;
        }

        return null;
    }

    // Get an array with the added tags. If bSelected, only selected tags are returned.
    function getTags(bSelected)
    {
        var ar = [];
        
        var arTags = html.findElements("filterlisttag", oTagsContainer);
        if (!arTags)
            return ar;

        for(var i = 0; i < arTags.length; i++)
        {
            var currTag = arTags[i];
            if (!currTag)
                continue;

            var currTagText = currTag.innerText.trim();
            if (!currTagText)
                continue;

            if (!bSelected || currTag.classList.contains("selected"))
                ar.push(currTagText);
        }

        return ar;
    }


    // Filter items showing only the ones that have any of the specified tags
    function filterItems(name, arTags)
    {
        var bShowAll = (!arTags || arTags.length == 0) && !name;

        for(var i = 0; i < arAddedItems.length; i++)
        {
            var currItem = arAddedItems[i];
            if (bShowAll)
            {
                html.showInlineElement(currItem.Element, true);
                continue;
            }

            var bShow = hasAnyTag(currItem, arTags) && matchItem(currItem, name);
            html.showInlineElement(currItem.Element, bShow);
        }
    }

    function matchItem(item, name)
    {
        if (!item)
            return false;

        if (!item.Name)
            return false;

        return item.Name.toUpperCase().indexOf( name.toUpperCase() ) >= 0;
    }

    function hasAnyTag(item, arTags)
    {
        if (!arTags || arTags.length == 0)
            return true;
        
        if (!item)
            return false;

        if (!item.Tags)
            return false;
        
        for(var i = 0; i < item.Tags.length; i++)
        {
            var tag = item.Tags[i];

            if (arTags.indexOf(tag) >= 0)
                return true;
        }

        return false;
    }

    function handleSearch(e)
    {
        filterItemsUI();
    }

    function handleTagClick(e)
    {
        var oTag = this;
        oTag.classList.toggle("selected");

        filterItemsUI();
    }

    function filterItemsUI()
    {
        var search = oSearch.value;
        var ar = getTags(true);

        filterItems(search, ar);
    }

    function handleItemClick(e)
    {
        var oItem = this;
        var item = findAddedItemByElement(oItem);
        if (!item)
            return;

        var eventArgs = { Item : item };
        fireEvent(FilterListEvents.OnItemSelected, eventArgs);
    }

    function findAddedItemByElement(element)
    {
        if (!element)
            return null;
        
        for(var item of arAddedItems)
        {
            if (item.Element == element)
                return item;
        }

        return null;
    }

    function fireEvent(eventName, eventArgs)
    {
        var fn = oMapEventes.get(eventName);
        if (fn != null)
        {
            fn(oList, eventArgs);
        }
    }


    return {
        setItemTemplate : setItemTemplate,
        addItem : addItem,
        addEventListener : addEventListener
    }
}
