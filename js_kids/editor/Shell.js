
var ShellMode = {
    Code : 1,
    Output : 2,
    Both : 3
}

function Shell()
{
    var shell;
    var editor;
    var actionBar;
    var output;
    var codeBar;

    var minWidth = 1024;

    var mode = ShellMode.Both;

    _init();

    function _init()
    {
        shell = findFirstElement("shell");
        editor = findFirstElement("editor");
        actionBar = findFirstElement("actionbar");
        output = findFirstElement("output");
        codeBar = findFirstElement("codebar");

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
        var bIsBigScreen = !isScreenSmall();
        var bShowCode = mode == ShellMode.Code || mode == ShellMode.Both;
        var bShowOutput = mode == ShellMode.Output || (bIsBigScreen && mode == ShellMode.Both);

        showElement(editor, bShowCode);
        showElement(output, bShowOutput);

        showElement(codeBar, bIsBigScreen);

        // Usually on the phones...
        if (window.innerWidth < 500)
        {
            showSidebar();
        }
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
        var btn = findElement(btnId);
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
        var bOutputVisible = isDivVisible(output);

        if (!bOutputVisible)
        {
            showElement(output, true);
        }

        if (isScreenSmall())
        {
            showElement(editor, false);
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
            showElement(editor, true);
            showElement(output, false);
            mode = ShellMode.Code;
        }
        else
        {
            mode = bEditorVisible ? ShellMode.Output : ShellMode.Both;
            showElement(editor, !bEditorVisible);
        }
    }

    function handleCodeFullScreenButtonClick(e)
    {
        e.cancelBubble = true;

        if (isScreenSmall())
            return;
        
        var bOutputVisible = isDivVisible(output);

        mode = bOutputVisible ? ShellMode.Code : ShellMode.Both;

        showElement(output, !bOutputVisible);
    }


    function handleActionButtonClick(e)
    {
        var barName = this.getAttribute("sidebar");
        if (!barName)
        {
            console.log("Return to home page..." + shell);
            shell.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);

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
        var bar = findElement(barName);
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
            showElement(currBar, currBar == oBar ? bShow : false);
        }

        // Usually on the phones...
        if (oBar != null && isDivVisible(oBar))
        {
            oBar.style.width = (window.innerWidth < 500 ? window.innerWidth : 500) + "px";
        }
    }


    function findFirstElement(className)
    {
        var ar = document.getElementsByClassName(className);
        if (!ar || ar.length == 0)
            return null;

        return ar[0];
    }


    function findElement(id)
    {
        return document.getElementById(id);
    }


    function showElement(oElement, bShow)
    {
        if (!oElement)
            return;

        oElement.style.display = bShow ? "inherit" : "none";
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
        return window.innerWidth <= minWidth;
    }


    return {
        onresize : onresize
    };

}
