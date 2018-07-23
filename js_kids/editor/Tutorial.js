
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

        html.showElement(barTutorial, true);
        
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
  

    function storeUserSketch(pageIndex, oTutorial)
    {
        if (!oTutorial || !oTutorial.Pages || oTutorial.Pages.length == 0)
            return;

        if (pageIndex > oTutorial.Pages.length - 1 || pageIndex < 0 )
            return;

        var oPage = oTutorial.Pages[pageIndex];
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

    function handleBackButtonClick(e)
    {
        storeUserSketch(currPage, oTutorial);

        currPage--;
        displayPage(currPage, oTutorial);
    }

    function handleNextButtonClick(e)
    {
        storeUserSketch(currPage, oTutorial);
        
        currPage++;
        displayPage(currPage, oTutorial);
    }

    return {
        load : load
    }
}
