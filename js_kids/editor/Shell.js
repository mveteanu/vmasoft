
var ShellMode = {
    Code : 1,
    Output : 2,
    Both : 3
}

var minWidth = 1024;

function Shell()
{
    var shell;
    var editor;
    var actionBar;
    var output;
    var codeBar;
    var btnCodeFullScreen;
    var tcEditor;

    var mode = ShellMode.Both;

    _init();

    // -------- Begin public methods ------------

    function onresize()
    {
        reconfigureShell();
    }

    function addScene(sceneName, sceneCode)
    {
        tcEditor.addPage(sceneName, sceneCode);
    }

    // -------- Begin private methods -------------

    function _init()
    {
        shell = html.findFirstElement("shell");
        editor = html.findFirstElement("editor");
        actionBar = html.findFirstElement("actionbar");
        output = html.findFirstElement("output");
        codeBar = html.findFirstElement("codebar");
        btnCodeFullScreen = html.findElement("btnCodeFullScreen")
        tcEditor = TabEditor("tabcontrol", "pages");

        addActionBarEventListers(actionBar);
        addButtonEventHandler("btnOutputFullScreen", handleOutputFullScreenButtonClick);
        addButtonEventHandler("btnCodeFullScreen", handleCodeFullScreenButtonClick);
        addButtonsEventHandlers("closesidebar", handleSidebarCloseButtonClick);
        addButtonEventHandler("btnPlay", handlePlayButtonClick);

        onresize();
    }

    function reconfigureShell()
    {
        var bIsBigScreen = !html.isScreenSmall();
        var bShowCode = mode == ShellMode.Code || mode == ShellMode.Both;
        var bShowOutput = mode == ShellMode.Output || (bIsBigScreen && mode == ShellMode.Both);

        html.showElement(editor, bShowCode);
        html.showElement(output, bShowOutput);

        html.showElement(btnCodeFullScreen, bIsBigScreen);

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
        var btn = html.findElement(btnId);
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
        var bOutputVisible = html.isDivVisible(output);

        if (!bOutputVisible)
        {
            html.showElement(output, true);
        }

        if (html.isScreenSmall())
        {
            html.showElement(editor, false);
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

        var bEditorVisible = html.isDivVisible(editor);

        if (html.isScreenSmall())
        {
            html.showElement(editor, true);
            html.showElement(output, false);
            mode = ShellMode.Code;
        }
        else
        {
            mode = bEditorVisible ? ShellMode.Output : ShellMode.Both;
            html.showElement(editor, !bEditorVisible);
        }
    }

    function handleCodeFullScreenButtonClick(e)
    {
        e.cancelBubble = true;

        if (html.isScreenSmall())
            return;
        
        var bOutputVisible = html.isDivVisible(output);

        mode = bOutputVisible ? ShellMode.Code : ShellMode.Both;

        html.showElement(output, !bOutputVisible);
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

        showSidebar(bar, !html.isDivVisible(bar));

        e.cancelBubble = true;
    }


    function findSideBar(barName)
    {
        var bar = html.findElement(barName);
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
            html.showElement(currBar, currBar == oBar ? bShow : false);
        }

        // Usually on the phones...
        if (oBar != null && html.isDivVisible(oBar))
        {
            oBar.style.width = (window.innerWidth < 500 ? window.innerWidth : 500) + "px";
        }
    }


    return {
        onresize : onresize,
        addScene : addScene
    };

}