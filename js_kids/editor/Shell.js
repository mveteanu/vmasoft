
var ShellMode = {
    Code : 1,
    Output : 2,
    Both : 3
}

function Shell()
{
    var editor;
    var actionBar;
    var codeArea;
    var outputArea;

    var minWidth = 1024;

    var mode = ShellMode.Both;

    _init();

    function _init()
    {
        editor = findFirstObject("editor");
        actionBar = findFirstObject("actionbar");
        codeArea = findFirstObject("codearea");
        outputArea = findFirstObject("outputarea");

        addActionBarEventListers(actionBar);
        addButtonEventHandler("btnOutputFullScreen", handleOutputFullScreenButtonClick);
        addButtonEventHandler("btnCodeFullScreen", handleCodeFullScreenButtonClick);
        addButtonsEventHandlers("closesidebar", handleSidebarCloseButtonClick);
        addButtonEventHandler("btnPlay", handlePlayButtonClick);

        onresize();
    }

    function onresize()
    {
        reconfigureShell();
    }

    function reconfigureShell()
    {
        var bShowCode = mode == ShellMode.Code || mode == ShellMode.Both;
        var bShowOutput = mode == ShellMode.Output || (!isScreenSmall() && mode == ShellMode.Both);

        showDiv(editor, bShowCode);
        showDiv(outputArea, bShowOutput);
    }

    function findFirstObject(className)
    {
        var ar = document.getElementsByClassName(className);
        if (!ar || ar.length == 0)
            return null;

        return ar[0];
    }

    function addActionBarEventListers(actionBar)
    {
        var actionButtons = actionBar.getElementsByClassName("actionbarbutton");

        for(var i = 0; i < actionButtons.length; i++)
        {
            var btn = actionButtons[i];
            btn.addEventListener('click', handleActionButtonClick, false);
        }
    }

    function addButtonEventHandler(btnId, fnHandler)
    {
        var btn = document.getElementById(btnId);
        if (!btn)
            return;

        btn.addEventListener('click', fnHandler, false);
    }

    function addButtonsEventHandlers(btnClassName, fnHandler)
    {
        var allButtons = document.getElementsByClassName(btnClassName);
        if (!allButtons || allButtons.length == 0)
            return;

        for(var i = 0; i < allButtons.length; i++)
        {
            var btn = allButtons[i];
            btn.addEventListener('click', fnHandler, false);
        }
    }

    function handlePlayButtonClick(e)
    {
        showOutput();
    }

    function showOutput()
    {
        var bOutputVisible = isDivVisible(outputArea);

        if (!bOutputVisible)
        {
            showDiv(outputArea, true);
        }

        if (isScreenSmall())
        {
            showDiv(editor, false);
            mode = ShellMode.Output;
        }
    }

    function handleSidebarCloseButtonClick(e)
    {
        showSidebar();
    }

    function handleOutputFullScreenButtonClick(e)
    {
        e.cancelBubble = true;

        var bEditorVisible = isDivVisible(editor);

        if (isScreenSmall())
        {
            showDiv(editor, true);
            showDiv(outputArea, false);
            mode = ShellMode.Code;
        }
        else
        {
            mode = bEditorVisible ? ShellMode.Output : ShellMode.Both;
            showDiv(editor, !bEditorVisible);
        }
    }

    function handleCodeFullScreenButtonClick(e)
    {
        e.cancelBubble = true;

        if (isScreenSmall())
            return;
        
        var bOutputVisible = isDivVisible(outputArea);

        mode = bOutputVisible ? ShellMode.Code : ShellMode.Both;

        showDiv(outputArea, !bOutputVisible);
    }

    
    function handleActionButtonClick(e)
    {
        var barName = this.getAttribute("sidebar");
        if (!barName)
        {
            console.log("Return to home page...");
            return;
        }
        
        var bar = findSideBar(barName);
        if (!bar)
            return;

        showSidebar(bar, !isDivVisible(bar));

        e.cancelBubble = true;
    }


    function findSideBar(barName)
    {
        var bar = document.getElementById(barName);
        return bar;
    }


    function findSideBars()
    {
        var allBars = document.getElementsByClassName("sidebar");
        return allBars;
    }


    // Show or Hide the specified sidebar
    // If no parameter is sent, the function will hide all sidebars
    function showSidebar(oBar, bShow)
    {
        var allBars = findSideBars();

        for(var i = 0; i < allBars.length; i++)
        {
            var currBar = allBars[i];
            showDiv(currBar, currBar == oBar ? bShow : false);
        }
    }


    function showDiv(oDiv, bShow)
    {
        if (!oDiv)
            return;

        oDiv.style.display = bShow ? "inherit" : "none";
    }
    

    function isDivVisible(oDiv)
    {
        if(!oDiv)
            return false;

        //return oDiv.style.display == "block";
        return oDiv.offsetHeight > 0;
    }


    function isScreenSmall()
    {
        return window.innerWidth < minWidth;
    }


    return {
        onresize : onresize
    };

}
