
var TabControlEvents = {
    OnPageChanged : "pagechanged",
    OnBeforeRemove : "pagebeforeremove",
    OnBeforeRename : "pagerename",
    OnBeforeAdd : "pagebeforeadd",
    OnAfterAdd : "pageafteradd"
}

function TabControl(tabControlName, pagesContainerName)
{
    var oTabControl;
    var oHeadersContainer;
    var oPagesContainer;
    var oMenu;
    var oMapEventes = new Map();

    _init();

    // ------------- Begin public functions ----------------

    // Returns the number of pages
    function getPageCount()
    {
        var arHeaders = html.findElements("tabheader", oTabControl);
        return arHeaders ? arHeaders.length : 0;
    }

    // Returns the pageHeader object of the specified page
    function findPage(nameOrIndexOrObject)
    {
        if (typeof nameOrIndexOrObject == "string")
            return findPageByName(nameOrIndexOrObject);

        if (typeof nameOrIndexOrObject == "number")
            return findPageByIndex(nameOrIndexOrObject);

        return nameOrIndexOrObject;
    }

    
    // Returns the pageContainer object for the specified page header
    function findPageContainer(oPageHeader)
    {
        if (!oPageHeader)
            return null;

        var containerName = oPageHeader.getAttribute("page");
        return html.findFirstElementByAttrib(oPagesContainer, "page", containerName);
    }
    
    // Returns the page name for the specified header object
    function getPageName(oPage)
    {
        var oSpan = html.findFirstTag("span", oPage);
        return oSpan.innerText;
    }
    
    // Selects the specified page
    function selectPage(pageHeaderObjOrName)
    {
        var arHeaders = html.findElements("tabheader", oTabControl);
        if (!arHeaders)
            return null;

        var oPageHeader = findPage(pageHeaderObjOrName);

        if (!oPageHeader)
            return null;
        
        var selectedPage = null;

        for(let i = 0; i < arHeaders.length; i++)
        {
            var oCurrHeader = arHeaders[i];

            var oContainer = findPageContainer(oCurrHeader);

            if (oPageHeader == oCurrHeader && !html.isDivVisible(oContainer))
            {
                selectedPage = oPageHeader;
            }

            oCurrHeader.classList.toggle("selected", oPageHeader == oCurrHeader);
            html.showElement(oContainer, oPageHeader == oCurrHeader);
        }

        if (selectedPage)
        {
            var pageName = getPageName(selectedPage);
            var eventArgs = { PageName : pageName, PageContainer : oContainer };
            fireEvent(TabControlEvents.OnPageChanged, eventArgs);
        }

        return selectedPage;
    }


    // Add a new page using specified name
    function addPage(pageName)
    {
        var pageId = getNewPageId();
        
        var txt = `<div class="tabheader" draggable="true" page="${pageId}" ><span>${pageName}</span><i class="fas fa-cog"></i></div>\n`;
        var oPage = html.appendElement(txt, oHeadersContainer)

        var txt = `<div class="tabpage" page="${pageId}" style="display: none"></div>\n`;
        var oPageContainer = html.appendElement(txt, oPagesContainer);

        initPage(oPage);

        return { Header : oPage, Page : oPageContainer } ;
    }
    
    function getNewPageId()
    {
        var d = new Date();
        var n = d.getTime(); 

        return "page" + (n + oHeadersContainer.children.length);
    }
    
    function clear()
    {
        while( oHeadersContainer.firstChild )
            oHeadersContainer.removeChild(oHeadersContainer.firstChild);

        while (oPagesContainer.firstChild )
            oPagesContainer.removeChild(oPagesContainer.firstChild);
    }

    // Removes specified page
    function removePage(pageHeaderObjOrName)
    {
        // The TC should have at least one page...
        if (oHeadersContainer.children.length <= 1)
            return;

        var oPageHeader = findPage(pageHeaderObjOrName);

        if (!oPageHeader)
            return;
        
        var pageName = getPageName(oPageHeader);
        
        var eventArgs = { PageName : pageName, Cancel : false };
        fireEvent(TabControlEvents.OnBeforeRemove, eventArgs);

        if (eventArgs.Cancel)
            return;
        
        // Select the previous (or next page) before removing current page
        var oOther = findPrevOrNextPage(oPageHeader);
        selectPage(oOther);

        // Remove current page
        var oContainer = findPageContainer(oPageHeader);

        oHeadersContainer.removeChild(oPageHeader);
        oPagesContainer.removeChild(oContainer);
    }
    
    // Enter in rename mode for the specified page
    function renamePage(pageHeaderObjOrName)
    {
        var oPageHeader = findPage(pageHeaderObjOrName);

        if (!oPageHeader)
            return;

        var p = findPageInEditMode();
        if (p && p != oPageHeader)
            return;

        var oSpan = html.findFirstTag("span", oPageHeader);

        oSpan.setAttribute("contenteditable", true);
        oSpan.focus();
    }
    
    // Register a new event listner
    function addEventListener(eventName, fn)
    {
        oMapEventes.set(eventName, fn);
    }


    // ------------- Begin private functions ----------------

    function _init()
    {
        oTabControl = html.findElement(tabControlName);
        oHeadersContainer = html.findFirstElement("tabheaders", oTabControl);
        oPagesContainer = html.findElement(pagesContainerName);
        
        oMenu = html.findFirstElement("tabheadermenu", oTabControl);
        document.addEventListener("click", handleDocumentClick);

        var btnNewPage = html.findFirstElement("tabcommand", oTabControl);
        if (btnNewPage)
            btnNewPage.addEventListener("click", handlePageNewClick);

        initTabPages();
    }

    function initTabPages()
    {
        var arHeaders = html.findElements("tabheader", oTabControl);
        if (!arHeaders)
            return;
        
        for(let i = 0; i < arHeaders.length; i++)
        {
            var oPageHeader = arHeaders[i];
            initPage(oPageHeader);
        }
    }

    function initPage(oPageHeader)
    {
        oPageHeader.addEventListener('click', handlePageClick, false);

        var oSetting = html.findFirstTag("i", oPageHeader);
        if (oSetting)
        {
            oSetting.addEventListener('click', handlePageSettingsClick, false);

            var oSpan = html.findFirstTag("span", oPageHeader);
            oSpan.addEventListener('blur', handlePageEditExit, false);
            oSpan.addEventListener('dblclick', handlePageHeaderDoubleClick, false);
            oSpan.addEventListener('keypress', handlePageHeaderKeyPress, false);
        }

        var containerName = oPageHeader.getAttribute("page");
        var oContainer = html.findFirstElementByAttrib(oPagesContainer, "page", containerName);
        html.showElement(oContainer, oPageHeader.classList.contains("selected"));
    }


    function findPageInEditMode()
    {
        var arHeaders = html.findElements("tabheader", oTabControl);
        if (!arHeaders)
            return false;
        
        for(let i = 0; i < arHeaders.length; i++)
        {
            var oPageHeader = arHeaders[i];
            var oSpan = html.findFirstTag("span", oPageHeader);
            if (oSpan.getAttribute("contenteditable") == "true")
                return oPageHeader;
        }

        return null;
    }


    function handlePageClick(e)
    {
        var p = findPageInEditMode();
        if (p && p != this)
            return;

        var pageName = getPageName(this);
        selectPage(pageName);
    }


    function handlePageSettingsClick(e)
    {
        e.cancelBubble = true;

        var oPageHeader = this.parentElement;
        var pageName = getPageName(oPageHeader);

        var o = html.cumulativeOffset(oPageHeader);

        oMenu.style.left = o.left + oPageHeader.offsetWidth - 24 + "px";
        oMenu.style.top = o.top + oPageHeader.offsetHeight + 2 + "px";
        oMenu.PageHeader = oPageHeader; // reference to the tabPage that opens the menu

        html.showElement(oMenu, true);
    }


    function handleDocumentClick(e)
    {
        if (e.target == null)
            return;

        var menuItem = html.findAncestor(e.target, oMenu, 5);
        if ( menuItem != null )
        {
            var oPageHeader = oMenu.PageHeader;
            var action = menuItem.getAttribute("action");

            e.cancelBubble = true;
            handleMenuCommand(oPageHeader, action);
        }
       

        html.showElement(oMenu, false);
    }


    function handleMenuCommand(oPageHeader, action)
    {
        if (action == "rename")
        {
            renamePage(oPageHeader);
        } else if (action == "remove")
        {
            removePage(oPageHeader);
        }
    }


    function findPageByIndex(pageIndex)
    {
        var arHeaders = html.findElements("tabheader", oTabControl);
        if (!arHeaders || pageIndex < 0 || pageIndex >= arHeaders.length)
            return null;

        return arHeaders[pageIndex];
    }

    
    function findPageByName(pageName)
    {
        var arHeaders = html.findElements("tabheader", oTabControl);
        if (!arHeaders)
            return null;
        
        for(let i = 0; i < arHeaders.length; i++)
        {
            var oPageHeader = arHeaders[i];
            var currPageName = getPageName(oPageHeader);

            if (pageName == currPageName)
                return oPageHeader;
        }

        return null;
    }
    

    function findPrevOrNextPage(oPage)
    {
        var arHeaders = html.findElements("tabheader", oTabControl);
        if (!arHeaders)
            return null;
        
        for(let i = 0; i < arHeaders.length; i++)
        {
            var oCurrPage = arHeaders[i];
            if (oCurrPage == oPage)
            {
                var otherIndex = i > 0 ? i - 1 : i + 1;
                return arHeaders[otherIndex];
            }
        }

        return null;
    }


    function handlePageHeaderDoubleClick(e)
    {
        var oPageHeader = this.parentElement;
        renamePage(oPageHeader);
    }


    function handlePageEditExit(e)
    {
        var pageName = this.innerText;

        // Don't allow empty page names...
        if (!pageName)
        {
            this.focus();
            return;
        }

        var oPage = this.parentElement;

        // Don't allow duplicate page names...
        var otherPage = findPageByName(pageName);
        if (otherPage && otherPage != oPage)
        {
            this.focus();
            return;
        }

        var eventArgs = { PageName : pageName, Cancel : false };
        fireEvent(TabControlEvents.OnBeforeRename, eventArgs);

        if (eventArgs.Cancel)
        {
            this.focus();
            return;
        }

        this.setAttribute("contenteditable", false);
    }

    function handlePageHeaderKeyPress(e)
    {
        if (e.keyCode == 13)
            this.blur();
    }
    
    function handlePageNewClick(e)
    {
        // Return if a page is in edit mode
        var p = findPageInEditMode();
        if (p)
            return;

        var eventArgs = { PageName : "Scene" + oHeadersContainer.children.length, Cancel : false };
        fireEvent(TabControlEvents.OnBeforeAdd, eventArgs);

        if (eventArgs.Cancel)
            return;

        var o = addPage(eventArgs.PageName);

        if (!o)
            return;

        var eventArgs = { Header : o.Header, Page : o.Page };
        fireEvent(TabControlEvents.OnAfterAdd, eventArgs);
        
        selectPage(o.Header);
        renamePage(o.Header);
    }

    function fireEvent(eventName, eventArgs)
    {
        var fn = oMapEventes.get(eventName);
        if (fn != null)
        {
            fn(oTabControl, eventArgs);
        }
    }

    return {
        selectPage : selectPage,
        addPage : addPage,
        removePage : removePage,
        clear : clear,
        renamePage : renamePage,
        getPageCount : getPageCount,
        findPage : findPage,
        findPageContainer : findPageContainer,
        getPageName : getPageName,
        addEventListener : addEventListener
    }

}
