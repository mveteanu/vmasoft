
function Sketch()
{
    const P5Events = ["mouseClicked", "keyPressed"];

    var scenes = [];
    var scene = null;

    var oAssetsCache = AssetsCache();
    var oAssetsData = AssetsData();

    var displayLoadingScreen = false;

    // Wire relevant p5.js events, except setup()
    // If you don't call this method, you need to manually wire events
    function wire()
    {
        var o = window;

        // Wire draw manually to improve speed...
        o.draw = draw;

        // This loop will wire automatically all P5 events to each scene like this:
        // o.mouseClicked = function() { handleEvent("mouseClicked"); }
        for(var i = 0; i < P5Events.length; i++)
        {
            let sEvent = P5Events[i]; // let is necesary to set the scope at the level of for
            o[sEvent] = function() { handleEvent(sEvent) };
        }
    }


    // Check the local HTML for scripts with a custom language attribute
    // and adds the scripts as scenes
    function addScenesFromHtml(languageAttr)
    {
        var arAllScripts = document.getElementsByTagName("script");

        for(var i = 0; i < arAllScripts.length; i++)
        {
            var script = arAllScripts[i];

            if (script.getAttribute("language") == languageAttr)
            {
                addScene( script.id, script.text );
            }
        }
    }

  
    // Add a new scene to the sketch
    function addScene(sceneName, sceneCode)
    {
        var foundSceneIndex = findSceneIndex(sceneName);

        var oSceneWrapper = getSceneWrapper(sceneName, sceneCode);

        if (foundSceneIndex >= 0)
        {
            // Replace the scene... 
            // Note: in a previous version, I used to verify the new code against scene code and cancel adding the scene if the code was the same
            scenes[foundSceneIndex] = oSceneWrapper;
        }
        else
        {
            // Add the new scene in the scenes array 
            scenes.push(oSceneWrapper);
        }

        // Reset current scene (... need to decide if this is something we need ...)
        scene = null;
    }


    // Run the sketch
    // First will download the assets and then show the first scene of the sketch
    function run()
    {
        if (scenes.length == 0)
            return;

        GlobalVars = {};

        allSprites.removeSprites();

        displayLoadingScreen = true;

        downloadAssets( 
            () => {
                displayLoadingScreen = false;
                showScene(0);
            }, 
            () => {
                console.log("downloadAssets reported some errors...")
            }
        );
    }



    // Resets the sketch and depending on parameter also the image cache...
    // Note: Normally the image cache should not be cleared on reset() to avoid re-download of assets
    function reset(bClearAssetsCache)
    {
        scene = null;
        scenes = [];
        GlobalVars = {};

        if (bClearAssetsCache)
        {
            oAssetsCache.clearCache();
        }
    }


    // Return the index of a scene in the internal collection
    function findSceneIndex(sceneName)
    {
        for(var i = 0; i < scenes.length; i++)
        {
            var o = scenes[i]; 
            if ( o.sceneName == sceneName )
                return i;
        }

        return -1;
    }


    // Finds a particular scene by name or index
    // Return a scene object wrapper 
    function findScene(sceneNameOrIndex)
    {
        var sceneIndex = (typeof sceneNameOrIndex === 'number')
                                        ? sceneNameOrIndex
                                        : findSceneIndex(sceneNameOrIndex);

        return (sceneIndex >= 0 && sceneIndex < scenes.length) ? scenes[sceneIndex] : null;
    }


    function getCurrentScene()
    {
        return scene;
    }

    // Show the scene specified by name
    // The function justs sets the current scene... in order for the main loop to know what to call
    function showScene(sceneNameOrIndex, sceneArgs)
    {
        var o = findScene(sceneNameOrIndex);

        if ( o == null )
            return;

        if ( o.sceneExecuted && o.oScene == null )
            return;

        // Re-arm the enter function at each show of the scene
        o.enterExecuted = false;

        // inject sceneArgs as a property of the scene
        o.oSceneData.PublicVars.Arguments = sceneArgs;
        o.oSceneData.PublicVars.PreviousScene = scene != null ? scene.sceneName : "";

        scene = o;
    }


    // Show the next scene in the collection
    // Useful if implementing demo applications 
    // where you want to advance scenes automatically
    function showNextScene(sceneArgs)
    {
        if ( scenes.length == 0 )
            return;

        var nextSceneIndex = 0;

        if ( scene != null )
        {
            // search current scene... 
            // can be optimized to avoid searching current scene...
            var i = findSceneIndex( scene.sceneName );
            nextSceneIndex = i < scenes.length - 1 ? i + 1 : 0;
        }

        var nextScene = scenes[nextSceneIndex];
        showScene( nextScene.sceneName, sceneArgs );
    }


    // Returns the specified scene PublicVars object
    function getPublicVars(sceneNameOrIndex)
    {
        var oSceneWrapper = findScene(sceneNameOrIndex);
        if (!oSceneWrapper)
            return {};

        var oSceneData = oSceneWrapper.oSceneData;
        if (!oSceneData)
            return {};

        return oSceneData.PublicVars;
    }

    // --------- Begin Private Functions ------------
        

    // This is the main draw() dispatcher of the sketch...
    function draw()
    {
        // take the current scene in a variable to protect it in case
        // it gets changed by the user code in the events such as enter()...
        var currScene = scene;

        if (displayLoadingScreen)
        {
            background("White");
            text("Loading...", width / 2, height / 2);
            return;
        }

        if ( currScene == null )
        {
            background("White");    // wipe the screen and return
            return;                 // most likely there are no scene in the sketch...
        }

        if ( !currScene.sceneExecuted )
        {
            _executeScene(currScene);
        }

        if ( currScene.hasEnter && !currScene.enterExecuted  )
        {
            // apply the background also here to be safe, in case the scene doesn't have a loop()...
            _applySceneBackground(currScene);

            currScene.oScene.enter();
            currScene.enterExecuted = true;
        }

        if ( currScene.hasLoop )
        {
           _applySceneBackground(currScene);

            _drawSprites(currScene.spritesGroup, (o) => o.depth <= 0);

            currScene.oScene.loop();

            _drawSprites(currScene.spritesGroup, (o) => o.depth > 0);
        }

        // If the scene doesn't have enter() or loop() functions... then run the main code of the scene
        // Note: use enterExecuted flag to execute the main code just once per each scene show... (just like the enter() function)
        if (!currScene.hasEnter && !currScene.hasLoop && !currScene.enterExecuted)
        {
            // apply the background also here to erase the screen when showing scene, in case the scene doesn't set a background...
            _applySceneBackground(currScene);

            _executeScene(currScene);
            currScene.enterExecuted = true;

            // Draw all sprites for the current scene...
            //_drawSprites(currScene.spritesGroup);

            // TODO / NOTES for static scebes: 
            //    - Currently for static scenes, the EasyFunction->sprite is doing the drawing of each sprite (advantage is that you can overlap stamps with p5.js drawings)
            //      however cannot alter the sprite object properties such as sprite("test").x += 100; in that static scene... only by displaying from here can do this (see commented line)
            //
            //    - In case of scenes without a loop, sprites are static... I can make sprites animate
            //      by doing all p5 drawing functions write offscrean into an image... and then in the draw() display that image and all the sprites...
        }
    }


    // Draw sprites from the arGrp if the specified function run on each sprite returns true
    function _drawSprites(arGrp, fnCondition)
    {
        //sort by depth
        arGrp.sort(function(a, b) {
          return a.depth - b.depth;
        });

        for(var o of arGrp)
        {
            if (fnCondition == null || fnCondition(o))
            {
                o.display();    // p5.Play function
            }
        }
    }


    function _executeScene(currScene)
    {
        currScene.oScene = currScene.fnScene( currScene.oSceneData );
        currScene.hasLoop = "loop" in currScene.oScene;
        currScene.hasEnter = "enter" in currScene.oScene;

        currScene.sceneExecuted = true;
    }
    

    function _applySceneBackground(toScene)
    {
        var currScene = toScene != null ? toScene : scene; // if no argument is transmited... use current scene
        
        var bkArgs = currScene.oSceneData.SceneBackground;
        if (bkArgs == null)
            bkArgs = ["White"]; // ... assume "White" if the scene didn't set any background

        background.apply(window, bkArgs);
    }

    // Returns an object that wrapps the scene function and it's attributes
    function getSceneWrapper(sceneName, sceneCode)
    {
        var oCodeUtils = CodeUtils();
        oCodeUtils.addP5Events(P5Events);

        // Evaluates the code of the scene using Function()
        // and returns an anonymous function representing the scene code
        var fnScene = oCodeUtils.getSceneFunction(sceneCode, sceneName);
        if (!fnScene)
            return;

        // This structure will be visible to the code running inside a scene
        var oSceneData = { 
                            PublicVars: {},
                            SceneBackground : ["White"],
                            backgroundCallBack : _applySceneBackground
                        };

        return {   sceneName : sceneName,
                   sceneCode : sceneCode,
                   fnScene : fnScene,
                   oSceneData : oSceneData,
                   oScene : null,
                   hasLoop : false,
                   hasEnter : false,
                   sceneExecuted : false,
                   enterExecuted : false,
                   spritesGroup : new Group()
                };
    }  


    // Handle a certain even for a scene... 
    // It is used by the anonymous functions from the wire() function
    function handleEvent(sEvent)
    {
        if ( scene == null || scene.oScene == null )
            return;

        var fnSceneEvent = scene.oScene[sEvent];
        if (fnSceneEvent)
            fnSceneEvent();
    }


    // Detects images and sounds assets in the code of all scenes 
    // ... and then downloads the assets
    // The fnDownloadComplete is triggered at the end of download (even if errors)
    // If errors, then the fnError is triggered once before the fnDownloadComplete
    // Normally on fnDownloadComplete the user can call the showScene functions...
    function downloadAssets(fnDownloadComplete, fnError)
    {
        // get the code in all the scenes as a big string
        var code = scenes.reduce( (acc, curr) => acc.sceneCode + curr.sceneCode );
        
        var oFinder = AssetsFinder(code, oAssetsData);
        var arImages = oFinder.getImages();
        var arSounds = oFinder.getSounds();

        oAssetsCache.downloadAssets(arImages, arSounds, fnDownloadComplete, fnError);
    }


    return { wire : wire, 
            addScene : addScene, 
            addScenesFromHtml : addScenesFromHtml,
            findScene : findScene,
            getCurrentScene : getCurrentScene,
            run : run,
            reset : reset,
            getPublicVars : getPublicVars,
            showScene : showScene,
            showNextScene : showNextScene,
            _AssetsCache : oAssetsCache,
            _AssetsData : oAssetsData
            }
}
