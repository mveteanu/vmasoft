
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

    async function load(id)
    {
        var data = await tutorialProvider.getTutorial(id);
        await loadFromObject(data);
    }

    async function loadFromObject(data)
    {
        if (!data)
        {
            html.showElement(tutorialButton, false);
            return;
        }

        oTutorial = data;

        oShell.showSidebar(barTutorial, true)
        
        tutorialTitle.innerText = oTutorial.Name ? oTutorial.Name : "Tutorial";
        await displayPage(0, oTutorial);
    }


    async function displayPage(pageIndex, oTutorial)
    {
        if (!oTutorial || !oTutorial.Pages || oTutorial.Pages.length == 0)
            return;

        if (pageIndex > oTutorial.Pages.length - 1 || pageIndex < 0 )
            return;

        currPage = pageIndex;

        var oPage = oTutorial.Pages[pageIndex];
        tutorialSubtitle.innerText = oPage.Name ? oPage.Name : "";

        await loadPage(oPage, oTutorial);
        
        tutorialPage.innerText = (pageIndex + 1) + " / " + oTutorial.Pages.length;

        tutorialBack.disabled = true;
        tutorialNext.disabled = true;

        var data = await loadSketch(oPage, oTutorial);
        tutorialBack.disabled = pageIndex == 0;
        tutorialNext.disabled = pageIndex == oTutorial.Pages.length - 1;
    }

    
    async function loadPage(oPage, oTutorial)
    {
        if (!oPage.Html)
        {
            var text = await tutorialProvider.getPage(oPage, oTutorial);
            oPage.Html = markdownToHtml(text);
        }
        
        renderHtml(oPage.Html, tutorialIframe);
    }

    async function loadSketch(oPage, oTutorial)
    {
        if (oPage.UserSketch)
        {
            var o = oShell.addSketchFromString(oPage.UserSketch);
            oShell.setReadOnly(true);
            setOriginalSketch(oPage.OriginalSketch);

            return o;
        }
        
        var sketchUrl = tutorialProvider.getSketchUrl(oPage, oTutorial);

        var o = await oShell.addSketchByUrl(sketchUrl);
        oPage.OriginalSketch = oShell.getSketchAsString();  // reads back the sketch from shell and not 'data'...

        return o;
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
    }


    function markdownToHtml(text)
    {
        var converter = new showdown.Converter({tables: true, emoji : true});
        var html = converter.makeHtml(text);

        return html;
    }


    function renderHtml(html, objDiv)
    {
        objDiv.innerHTML = html;

        highlightCodeBlocks(objDiv);
        processTutorialLinks(objDiv);
    }
    

    function highlightCodeBlocks(objDiv)
    {
        if (!objDiv)
            return;
        
        var ar = objDiv.getElementsByTagName("code");

        for(var i = 0; i < ar.length; i++)
        {
            var o = ar[i];

            o.setAttribute("class", "javascript");
            hljs.highlightBlock(o);
        }
    }

    function processTutorialLinks(objDiv)
    {
        if (!objDiv)
            return;
        
        var allLinks = objDiv.getElementsByTagName("a");
        if (!allLinks || allLinks.length == 0)
            return;

        var protocol = "tutorial://";

        for(var i = 0; i < allLinks.length; i++)
        {
            var o = allLinks[i];

            if (!o || !o.href)
                continue;

            if (!o.href.startsWith(protocol))
            {
                o.target = "_new";
                continue;
            }

            var tutorialId = o.href.substr(protocol.length)
            if (!tutorialId)
                continue;

            o.href="code.html?t=" + tutorialId;

            o.onclick = function(e) {
                if (hasChanges())
                {
                    dialogs.confirm("<b>Discard changes ?</b><br><br>Note: You have unsaved changes in the current tutorial. Do you want to discard these changes and navigate to the new tutorial ?", ["Yes", "No"], 
                    function() {
                        parent.oShell.loadTutorial(tutorialId);
                        
                        //Navigate by changing the Url
                        //window.location.href = o.href;
                    });
                }
                else
                {
                    parent.oShell.loadTutorial(tutorialId);
                    //window.location.href = o.href;
                }

                return false;
            };
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
