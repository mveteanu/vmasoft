
function Tutorial()
{
    var oTutorial = null;
    var currPage = 0;
    var tutorialProvider = TutorialProvider();

    var tutorialButton;
    var barTutorial;
    var tutorialTitle;
    var tutorialSubtitle;
    var tutorialIframe;
    var tutorialBack;
    var tutorialNext;
    var tutorialPage;

    var web;

    _init();

    function load(id)
    {
        tutorialProvider.getTutorial(id, function(data) {
            loadFromObject(data);
        });
    }

    function loadFromObject(data)
    {
        if (!data)
        {
            html.showElement(tutorialButton, false);
            return;
        }

        oTutorial = data;

        //html.showElement(barTutorial, true);
        oShell.showSidebar(barTutorial, true)
        
        tutorialTitle.innerText = oTutorial.Name ? oTutorial.Name : "Tutorial";
        displayPage(0, oTutorial);
    }


    function displayPage(pageIndex, oTutorial)
    {
        if (!oTutorial || !oTutorial.Pages || oTutorial.Pages.length == 0)
            return;

        if (pageIndex > oTutorial.Pages.length - 1 || pageIndex < 0 )
            return;

        currPage = pageIndex;

        var oPage = oTutorial.Pages[pageIndex];
        tutorialSubtitle.innerText = oPage.Name ? oPage.Name : "";

        tutorialIframe.src = tutorialProvider.getPageUrl(oPage, oTutorial);
        
        tutorialPage.innerText = (pageIndex + 1) + " / " + oTutorial.Pages.length;

        tutorialBack.disabled = true;
        tutorialNext.disabled = true;

        loadSketch(oPage, oTutorial, function (data){
            tutorialBack.disabled = pageIndex == 0;
            tutorialNext.disabled = pageIndex == oTutorial.Pages.length - 1;
        });
    }

    
    function loadSketch(oPage, oTutorial, onLoad)
    {
        if (oPage.UserSketch)
        {
            var o = oShell.addSketchFromString(oPage.UserSketch);
            oShell.setReadOnly(true);
            setOriginalSketch(oPage.OriginalSketch);

            if (onLoad)
                onLoad(o);

            return;
        }
        
        var sketchUrl = tutorialProvider.getSketchUrl(oPage, oTutorial);

        oShell.addSketchByUrl(sketchUrl, function (data) {
            oPage.OriginalSketch = oShell.getSketchAsString();  // reads back the sketch from shell and not 'data'...

            if (onLoad)
                onLoad(data);
        });
    }


    function setOriginalSketch(originalSketch)
    {
        var pk = TextPacker();
        var o = pk.unpack(originalSketch);

        oShell.setOriginalSketch(o);
    }


    function hasChanges()
    {
        if (!oTutorial || !oTutorial.Pages || oTutorial.Pages.length == 0)
            return false;
        
        storeUserSketch();

        for(var i = 0; i < oTutorial.Pages.length; i++)
        {
            var oPage = oTutorial.Pages[i];
            if (oPage.UserSketch != oPage.OriginalSketch)
                return true;
        }

        return false;
    }

  
    // Persist the changes done by the user to the sketch presented by the tutorial...
    // ... changes are persisted at the level of each page.
    function storeUserSketch()
    {
        if (!oTutorial || !oTutorial.Pages || oTutorial.Pages.length == 0)
            return;

        if (currPage > oTutorial.Pages.length - 1 || currPage < 0 )
            return;

        var oPage = oTutorial.Pages[currPage];
        oPage.UserSketch = oShell.getSketchAsString();
    }


    function _init()
    {
        tutorialButton = html.findElement("tutorialButton");
        barTutorial = html.findElement("barTutorial");
        tutorialTitle = html.findElement("tutorialTitle");
        tutorialSubtitle = html.findElement("tutorialSubtitle");
        tutorialIframe = html.findElement("tutorialIframe");
        tutorialPage = html.findElement("tutorialPage");
        
        tutorialBack = html.findElement("tutorialBack");
        tutorialBack.addEventListener('click', handleBackButtonClick, false);

        tutorialNext = html.findElement("tutorialNext");
        tutorialNext.addEventListener('click', handleNextButtonClick, false);

        tutorialIframe.onload = processTutorialLinks;
    }

    function processTutorialLinks()
    {
        if (!tutorialIframe.contentWindow || !tutorialIframe.contentWindow.document)
            return;
        
        var allLinks = tutorialIframe.contentWindow.document.links;
        if (!allLinks || allLinks.length == 0)
            return;

        var protocol = "tutorial://";

        for(var i = 0; i < allLinks.length; i++)
        {
            var o = allLinks[i];

            if (o && o.href && o.href.startsWith(protocol))
            {
                var tutorialId = o.href.substr(protocol.length)
                if (!tutorialId)
                    continue;

                o.href="#";

                o.addEventListener('click', function(e) {
                    e.cancelBubble = true;

                    if (hasChanges())
                    {
                        dialogs.confirm("<b>Discard changes ?</b><br><br>Note: You have unsaved changes in the current tutorial. Do you want to discard these changes and navigate to the new tutorial ?", ["Yes", "No"], 
                        function() {
                            parent.oShell.loadTutorial(tutorialId);        
                        });
                    }
                    else
                    {
                        parent.oShell.loadTutorial(tutorialId);
                    }
                });
            }
        }
    }

    function handleBackButtonClick(e)
    {
        storeUserSketch();

        currPage--;
        displayPage(currPage, oTutorial);
    }

    function handleNextButtonClick(e)
    {
        storeUserSketch();
        
        currPage++;
        displayPage(currPage, oTutorial);
    }

    return {
        load : load,
        hasChanges : hasChanges
    }
}
