
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
    var btnTutorial;
    var tcEditor;
    var barBackgrounds;
    var barSprites;
    var barSounds;
    var tutorial;
    var lblSketchTitle;
    var btnEditTitle;
    var btnSave;
    var btnFork;
    var btnReload;

    var mode = ShellMode.Both;

    var oParams = Parameters();

    var addedSketch = null;
    
    var isReadOnly = false;

    _init();

    // -------- Begin public methods ------------

    function onresize()
    {
        reconfigureShell();
    }


    function addFromUrl()
    {
        if (oParams.isTutorial())
        {
            html.showElement(btnTutorial, true);
            loadTutorial( oParams.getTutorialId() );
        }        
        else
        {
            html.showElement(btnTutorial, false);
            addSketchById( oParams.getSketchId() );
        }
    }

    function loadTutorial(id)
    {
        tutorial.load(id);
    }

    function addSketchById(id, onLoad)
    {
        sketchProvider.get( id, function(data) {
            var o = addOrInitSketch(data);

            if (onLoad)
                onLoad(o);
        } );
    }


    function addSketchByUrl(sketchUrl, onLoad)
    {
        sketchProvider.getByUrl( sketchUrl, function(data) {
            var o = addOrInitSketch(data);
            setReadOnly(true);

            if (onLoad)
                onLoad(o);
        } );
    }


    function addSketchFromString(sketchText)
    {
        var pk = TextPacker();
        
        var o = pk.unpack(sketchText);
        return addOrInitSketch(o);
    }


    function addOrInitSketch(o)
    {
        if (!o)
        {
            o = {
                Id : "",
                Name : "",
                Files : [ { Name : "Code", Code : "" } ]
            }
        }

        addSketch(o);
        showScene(0);
        //run();

        return o;
    }


    function addSketch(o)
    {
        if (!o)
            return;

        tcEditor.clear();
        resetSketch();

        if (!o.Name)
            o.Name = "Untitled";

        addedSketch = o;
        setName(o.Name);
        tcEditor.addAllCode(o.Files);

        setReadOnly(o.ReadOnly ? true : false);
    }

    function setOriginalSketch(o)
    {
        addedSketch = o;
    }

    function setReadOnly(readOnly)
    {
        isReadOnly = readOnly;

        html.showInlineElement( btnEditTitle, !readOnly );
        
        html.showInlineElement( btnFork, readOnly );
        html.showInlineElement( btnSave, !readOnly );
        html.showInlineElement( btnReload, readOnly );
    }


    function getSketch()
    {
        var o = {
            Id : addedSketch ? addedSketch.Id : "",
            Name : getName(),
            Files : tcEditor.getAllCode()
        }

        return o;
    }

    function getSketchAsString()
    {
        var o = getSketch();

        var pk = TextPacker();
        return pk.pack(o);
    }

    function setName(name)
    {
        lblSketchTitle.innerText = name;
    }

    function getName()
    {
        return lblSketchTitle.innerText;
    }

    function hasChanges()
    {
        var pk = TextPacker();
        
        var addedSketchText = pk.pack(addedSketch);
        var currentSketchText = getSketchAsString();

        return addedSketchText != currentSketchText;
    }

    function showScene(sceneName)
    {
        tcEditor.selectPage(sceneName);
    }

    function run()
    {
        var arCode = tcEditor.getAllCode();
        if (!arCode || arCode.length == 0 || !arCode[0].Code )
            return false;
        
        showOutput();
        runCode(arCode);

        btnPlay.className = "stopbutton fas fa-stop";

        return true;
    }

    function loadAssets()
    {
        barBackgrounds.load();
        barSprites.load();
        barSounds.load();
    }

    // -------- Begin private methods -------------

    function _init()
    {
        shell = html.findFirstElement("shell");
        editor = html.findFirstElement("editor");
        actionBar = html.findFirstElement("actionbar");
        output = html.findFirstElement("output");
        codeBar = html.findFirstElement("codebar");
        btnCodeFullScreen = html.findElement("btnCodeFullScreen");
        btnTutorial = html.findElement("tutorialButton");
        lblSketchTitle = html.findElement("lblSketchTitle");
        btnEditTitle = html.findElement("btnEditTitle");
        btnSave = html.findElement("btnSave");
        btnFork = html.findElement("btnFork");
        btnReload = html.findElement("btnReload");
        tcEditor = TabEditor("tabcontrol", "pages");
        sketchProvider = SketchProvider();
        barBackgrounds = BackgroundsBar("barBackgrounds", "barBackgroundsPages");
        barSprites = SpritesBar("barSprites", "barSpritesPages");
        barSounds = SoundsBar("barSounds", "barSoundsPages");
        tutorial = Tutorial();

        addActionBarEventListers(actionBar);
        addButtonEventHandler("btnOutputFullScreen", handleOutputFullScreenButtonClick);
        addButtonEventHandler("btnCodeFullScreen", handleCodeFullScreenButtonClick);
        addButtonsEventHandlers("closesidebar", handleSidebarCloseButtonClick);
        addButtonEventHandler("btnPlay", handlePlayButtonClick);
        addButtonEventHandler("btnReload", handleSketchReload);

        lblSketchTitle.addEventListener('blur', handleEditTitleExit, false);
        lblSketchTitle.addEventListener('dblclick', handleEditTitleButtonClick, false);
        lblSketchTitle.addEventListener('keypress', handleEditTitleKeyPress, false);

        addButtonEventHandler("btnEditTitle", handleEditTitleButtonClick);

        onresize();
    }
    
    function isScreenSmall()
    {
        if (findSideBarVisible() != null && window.innerWidth < 1600) 
            return true;

        return html.isScreenSmall();
    }

    function reconfigureShell()
    {
        var bIsBigScreen = !isScreenSmall();

        var bShowCode = mode == ShellMode.Code || mode == ShellMode.Both;
        var bShowOutput = mode == ShellMode.Output || (bIsBigScreen && mode == ShellMode.Both);

        html.showElement(editor, bShowCode);
        html.showElement(output, bShowOutput);

        html.showElement(btnCodeFullScreen, bIsBigScreen);

        // Re-size visible side-bar to accomodate phone type screen sizes
        var oBar = findSideBarVisible();
        if (oBar != null)
        {
            var w = (window.innerWidth < 550 ? window.innerWidth - 50 : 500) + "px";
            oBar.style.width = w;
            oBar.style.minWidth = w;
        }
    }


    function runCode(arCode)
    {
        if (!oSketch)
            return;

        oSketch.reset();
        oSketch.addScenes(arCode);
        oSketch.run();
    }

    function resetSketch()
    {
        if (!oSketch)
            return;

        oSketch.reset();

        btnPlay.className = "playbutton fas fa-play";
    }

    function isSketchRunning()
    {
        if (!oSketch)
            return false;

        return oSketch.getSceneCount() > 0;
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
        if (!isSketchRunning())
        {
            run();
        }
        else
        {
            resetSketch();
        }
    }

    function handleSketchReload(e)
    {
        if (!addedSketch || !isReadOnly)
            return;

        if (!hasChanges())
        {
            dialogs.notify("No changes.", 1);
            return;
        }

        dialogs.confirm("<b>Reload original sketch ?</b><br><br>Note: If you want to preserve the changes you did to this sketch, cancel this action and use 'Save a Copy' first.",
                ["Yes", "No"], function() {
                    addedSketch.ReadOnly = true;
                    addOrInitSketch(addedSketch);
                });
    }

    function handleEditTitleExit(e)
    {
        var sketchName = this.innerText.trim();

        // Don't allow empty sketch names...
        if (!sketchName)
            this.innerText = "Untitled";
        
        this.setAttribute("contenteditable", false);
    }

    function handleEditTitleKeyPress(e)
    {
        if (e.keyCode == 13)
            this.blur();
    }

    function handleEditTitleButtonClick()
    {
        if (isReadOnly)
            return;

        lblSketchTitle.setAttribute("contenteditable", true);
        lblSketchTitle.focus();
    }

    function showOutput()
    {
        var bOutputVisible = html.isDivVisible(output);

        if (!bOutputVisible)
        {
            html.showElement(output, true);
        }

        if (isScreenSmall())
        {
            html.showElement(editor, false);
            mode = ShellMode.Output;
        }
        else
        {
            mode = ShellMode.Both;
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

        // ... hack... show editor temporary just for the small screen detection ...
        html.showElement(editor, true);

        if (isScreenSmall() )
        {
            html.showElement(editor, true);
            html.showElement(output, false);
            mode = ShellMode.Code;

            resetSketch();
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

        if (isScreenSmall())
            return;
        
        var bOutputVisible = html.isDivVisible(output);

        mode = bOutputVisible ? ShellMode.Code : ShellMode.Both;

        html.showElement(output, !bOutputVisible);
    }


    function closeEditor()
    {
        var bHasChanges = oParams.isTutorial() ? tutorial.hasChanges() : hasChanges();
        if (bHasChanges)
        {
            dialogs.confirm("<b>Return to home page ?</b><br><br>Note: It appears that you have unsaved changes. Are you sure you want to discard them ?", ["Yes", "No"], returnToIndex);
        }
        else
        {
            returnToIndex();
        }
    }

    function returnToIndex()
    {
        window.location.href = "index.html";
    }

    function handleActionButtonClick(e)
    {
        var barName = this.getAttribute("sidebar");
        if (!barName)
        {
            //shell.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            closeEditor();           
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

    function findSideBarVisible()
    {
        var allBars = findSideBars();
        
        for(var i = 0; i < allBars.length; i++)
        {
            var bar = allBars[i];
            if (html.isDivVisible(bar))
                return bar;
        }

        return null;
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

        reconfigureShell();
    }


    return {
        onresize : onresize,
        addFromUrl : addFromUrl,
        addSketch : addSketch,
        addSketchById : addSketchById,
        addSketchByUrl : addSketchByUrl,
        addSketchFromString : addSketchFromString,
        getSketch : getSketch,
        getSketchAsString : getSketchAsString,
        setOriginalSketch : setOriginalSketch,
        setReadOnly : setReadOnly,
        run : run,
        runCode : runCode,
        showScene : showScene,
        loadAssets : loadAssets,
        showSidebar : showSidebar,
        loadTutorial : loadTutorial
    };

}
