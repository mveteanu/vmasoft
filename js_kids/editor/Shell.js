
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

    var mode = ShellMode.Both;

    var oParams = Parameters();

    var sketchId = "";

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

        sketchId = o.Id;
        setName(o.Name);
        tcEditor.addAllCode(o.Files);
    }


    function getSketch()
    {
        var o = {
            Id : sketchId,
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
        if (!name)
            name = "Untitled";
    }

    function getName()
    {
        return "Untitled";
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

        onresize();
    }
    
    function isScreenSmall()
    {
        if (sideBarVisible() && window.innerWidth < 1600) 
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

        // Usually on the phones...
        if (window.innerWidth < 500)
        {
            showSidebar();
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

    function sideBarVisible()
    {
        var allBars = findSideBars();
        
        for(var i = 0; i < allBars.length; i++)
        {
            var bar = allBars[i];
            if (html.isDivVisible(bar))
                return true;
        }

        return false;
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
        run : run,
        runCode : runCode,
        showScene : showScene,
        loadAssets : loadAssets,
        showSidebar : showSidebar,
        loadTutorial : loadTutorial
    };

}
