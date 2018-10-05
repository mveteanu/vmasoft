
function TabEditor(tabControlName, pagesContainerName)
{
    var tc;

    _init();

    // ---------- Begin public functions ---------------------

    function addCode(name, code)
    {
        name = name ? name : "Code" + getPageCount();
        code = code ? code : "";
        
        var o = tc.addPage(name);
        var editor = addPageEditor(o.Page);
        editor.setValue(code, 1);

        return o;
    }

    function addAllCode(ar)
    {
        if (!ar)
            return;
        
        for(var i = 0; i < ar.length; i++)
        {
            var o = ar[i];
            if (!o)
                continue;

            addCode( o.Name, o.Code );
        }
    }

    function getAllCode()
    {
        var n = getPageCount();
        var ar = [];

        for(var i = 0; i < n; i++)
        {
            var o = getCode(i);
            ar.push(o);
        }

        return ar;
    }

    function getCode(id)
    {
        var o = tc.findPage(id);
        if (!o)
            return null;

        var oData = { Name : "", Code : ""}

        oData.Name = tc.getPageName(o);
        
        var editor = getEditor(o);
        if (!editor)
            return oData;

        oData.Code = editor.getValue();
        
        return oData;
    }


    function getEditor(id)
    {
        var oHeader = tc.findPage(id);
        var oContainer = tc.findPageContainer(oHeader);
        var oEditorDiv = getEditorDiv(oContainer);

        if (!oEditorDiv)
            return null;

        // Calling ace.edit on an already instatiated editor will return the instance
        // https://stackoverflow.com/questions/25452304/how-to-get-ace-editor-object-from-its-div-id
        return ace.edit(oEditorDiv);
    }


    function selectPage(id)
    {
        return tc.selectPage(id);
    }

    function getPageCount()
    {
        return tc.getPageCount();
    }

    function clear()
    {
        return tc.clear();
    }

    // ---------- Begin private functions --------------------

    function _init()
    {
        tc = TabControl(tabControlName, pagesContainerName);
        tc.addEventListener(TabControlEvents.OnPageChanged, handlePageChanged);
        tc.addEventListener(TabControlEvents.OnBeforeAdd, handlePageNew);
        tc.addEventListener(TabControlEvents.OnAfterAdd, handlePageAfterAdd);
        tc.addEventListener(TabControlEvents.OnBeforeRename, handlePageRename);
        tc.addEventListener(TabControlEvents.OnBeforeRemove, handlePageRemove);
    }

    function handlePageChanged(sender, eventArgs)
    {
    }
    
    function handlePageNew(sender, eventArgs)
    {
    }
    
    function handlePageAfterAdd(sender, eventArgs)
    {
        var oPageContent = eventArgs.Page;
        addPageEditor(oPageContent);
    }

    function handlePageRename(sender, eventArgs)
    {
        var pageName = eventArgs.PageName;
        eventArgs.Cancel = pageName.length >= 30;
    }

    function handlePageRemove(sender, eventArgs)
    {
        var pageName = eventArgs.PageName;
        if (!pageName)
            return;

        var o = getCode(pageName)
        if (!o)
            return;

        if (o.Code && o.Code.trim().length > 0)
        {
            dialogs.warning("<b>" + pageName + " has code!</b><br><br>If you want to remove the scene, delete all the code in the scene first!");
            eventArgs.Cancel = true;
        }
    }

    function addPageEditor(oPageContent)
    {
        var oEditorDiv = getEditorDiv(oPageContent);

        var editor = ace.edit(oEditorDiv);
        editor.setTheme("ace/theme/chrome");
        editor.session.setMode("ace/mode/javascript");
        //editor.session.$worker.send("changeOptions", [{asi: true}]); ??? 
        //editor.setHighlightActiveLine(false);

        return editor;
    }

    function getEditorDiv(oPageContent)
    {
        // Put the editor on the tabpage iteself... (maybe I should create a new DIV inside tabpage)
        return oPageContent;
    }

    return {
        addAllCode : addAllCode,
        getAllCode : getAllCode,
        addCode : addCode,
        getCode : getCode,
        selectPage : selectPage,
        getPageCount : getPageCount,
        clear : clear
    }
        
}
