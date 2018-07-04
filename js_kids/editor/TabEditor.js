
function TabEditor(tabControlName, pagesContainerName)
{
    var tc;

    _init();

    // ---------- Begin public functions ---------------------

    function addPage(name, code)
    {
        var o = tc.addPage(name);
        var txt = addPageEditor(o.Page);
        txt.setValue(code);
        tc.selectPage(o.Header);
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
        console.log("page changed: " + eventArgs.PageName);
    }
    
    function handlePageNew(sender, eventArgs)
    {
        //eventArgs.Cancel = true;
        //return;
    
        console.log("New page: " + eventArgs.PageName);
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
    
        console.log("Page rename: " + pageName);
    }

    function handlePageRemove(sender, eventArgs)
    {
        console.log("Page remove: " + eventArgs.PageName);
    }

    function addPageEditor(oPageContent)
    {
        //var txt = `<textarea style='width:100%;flex-growth:1;'></textarea>\n`;
        //var oText = html.appendElement(txt, oPageContent);

        //return oText;

        var editor = ace.edit(oPageContent);
        editor.setTheme("ace/theme/chrome");
        editor.session.setMode("ace/mode/javascript");
        //editor.setHighlightActiveLine(false);

        return editor;
    }

    return {
        addPage : addPage
    }
        
}
