

function Sketch()
{
    const P5Events = [  "mouseClicked", 
                        "mousePressed", 
                        "mouseReleased", 
                        "mouseMoved", 
                        "mouseDragged", 
                        "doubleClicked", 
                        "mouseWheel", 
                        "keyPressed", 
                        "keyReleased", 
                        "keyTyped", 
                        "touchStarted", 
                        "touchMoved", 
                        "touchEnded", 
                        "deviceMoved", 
                        "deviceTurned", 
                        "deviceShaken" ];

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
            o[sEvent] = function() { return handleEvent(sEvent); };  // return false for mouse based events...?!
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


    // Add scenes from an array of objects { Name, Code }
    function addScenes(ar)
    {
        if (!ar)
            return;

        for(var o of ar)
        {
            if (o)
            {
                addScene(o.Name, o.Code);
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

        // Disable p5.play camera since it appears to cause some issues with persistance of attributes after the draw() cycle...
        // ... for a different workaround with camera.on please check backup v8
        camera.off();

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

        if (currScene.errorMessage)
        {
            background("White");
            text("Error: " + currScene.errorMessage, width / 2, height / 2);
            return;
        }

        if ( !currScene.sceneExecuted )
        {
            _executeScene(currScene);

            if (OFFSCREEN_RENDERING)
            {
                // If the loose code draw something in the initial buffer...
                if (!_bufferEmpty(currScene.oSceneData.ScreenBuffer))
                {
                    currScene.oSceneData.ScreenBuffer_init = createGraphics(width, height);
                    currScene.oSceneData.ScreenBuffer_init.pixelDensity(1);
                    currScene.oSceneData.ScreenBuffer_init.image(currScene.oSceneData.ScreenBuffer, 0, 0);
                }
            }
        }

        if ( currScene.hasEnter && !currScene.enterExecuted  )
        {
            currScene.oScene.enter();
            currScene.enterExecuted = true;
        }

        _applySceneBackground(currScene);
        _drawSprites(currScene.spritesGroup, (o) => o.depth <= 0);

        if (OFFSCREEN_RENDERING)
        {
           if ( currScene.hasLoop )
           {
               currScene.oSceneData.ScreenBuffer.clear();

               // If there is content in the initial buffer apply it then execute loop() on top...
               if (currScene.oSceneData.ScreenBuffer_init)
                   currScene.oSceneData.ScreenBuffer.image(currScene.oSceneData.ScreenBuffer_init, 0, 0);

               _setScreenBufferP5Variables(currScene.oSceneData.ScreenBuffer);
               currScene.oScene.loop();

               image(currScene.oSceneData.ScreenBuffer, 0, 0);
           }
           else
           {
                if (currScene.oSceneData.ScreenBuffer_init)
                    image(currScene.oSceneData.ScreenBuffer_init, 0, 0);
           }
        }
        else
        {
            if ( currScene.hasLoop )
            {
                currScene.oScene.loop();
            }
            else
            {
                image(currScene.oSceneData.ScreenBuffer, 0, 0);
            }
        }

       _drawSprites(currScene.spritesGroup, (o) => o.depth > 0);
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

    // Returns true if an offscreen buffer is totally empty
    function _bufferEmpty(buff)
    {
        buff.loadPixels();
    
        for(var i = 0; i < buff.pixels.length; i++)
        {
            if (buff.pixels[i] != 0)
                return false;
        }
    
        return true;
    }
        

    function _executeScene(currScene)
    {
        try
        {
            currScene.oScene = currScene.fnScene( currScene.oSceneData );
            currScene.sceneExecuted = true;
        }
        catch(e)
        {
            currScene.errorMessage = e.message;
        }
    }
    

    function _applySceneBackground(toScene)
    {
        var currScene = toScene != null ? toScene : scene; // if no argument is transmited... use current scene
        
        var bkArgs = currScene.oSceneData.SceneBackground;
        if (bkArgs == null)
            bkArgs = ["White"]; // ... assume "White" if the scene didn't set any background

        p5.prototype.background.apply(window, bkArgs);
    }


    function _setScreenBufferP5Variables(g)
    {
        if (!g)
            return;

        g.mouseX = mouseX;
        g.mouseY = mouseY;
        g.pmouseX = pmouseX;
        g.pmouseY = pmouseY;
        g.mouseButton = mouseButton;
        g.mouseIsPressed = mouseIsPressed;
        g.key = key;
        g.keyCode = keyCode;
        g.keyIsPressed = keyIsPressed;
    }


    // Returns an object that wrapps the scene function and it's attributes
    function getSceneWrapper(sceneName, sceneCode)
    {
        var oScreenBuffer = null;
        var oScreenBuffer_init = null;
        
        var oCodeUtils = CodeUtils(sceneCode);
        oCodeUtils.addP5Events(P5Events);
        oCodeUtils.parse();

        var hasLoop = oCodeUtils.hasLoop();
        var hasEnter = oCodeUtils.hasEnter();
        
        if (!hasLoop || OFFSCREEN_RENDERING)
        {
            oScreenBuffer = createGraphics(width, height);
            oScreenBuffer.pixelDensity(1);

            // ... the scene code will be wrapped with a "with" statement (... obsolete technique !)
            oCodeUtils.setWith("ScreenBuffer");
        }

        // Evaluates the code of the scene using Function()
        // and returns an anonymous function representing the scene code
        var fnScene;
        var fnSceneError = "";
        try
        {
            fnScene = oCodeUtils.getSceneFunction();
        }
        catch(e)
        {
            fnSceneError = e.message;
        }

        // if (!fnScene)
        // {
        //     fnSceneError = "No code.";
        // }

        // This structure will be visible to the code running inside a scene
        var oSceneData = { 
                            PublicVars: {},
                            SceneBackground : ["White"],
                            ScreenBuffer : oScreenBuffer,
                            ScreenBuffer_init : oScreenBuffer_init
                        };

        return {   sceneName : sceneName,
                   sceneCode : sceneCode,
                   fnScene : fnScene,
                   oSceneData : oSceneData,
                   oScene : null,
                   hasLoop : hasLoop,
                   hasEnter : hasEnter,
                   sceneExecuted : false,
                   enterExecuted : false,
                   errorMessage : fnSceneError,
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
        if (!fnSceneEvent)
            return;

        // If an off-screen buffer is used (like in the case of static scenes)
        // ... then sync a few common variables with the off-screen buffer
        _setScreenBufferP5Variables(scene.oSceneData.ScreenBuffer);
        
        if (OFFSCREEN_RENDERING)
        {
            scene.oSceneData.ScreenBuffer.clear();
        }

        try
        {
            fnSceneEvent();
        }
        catch(e)
        {
            scene.errorMessage = sEvent + "()\n" + e.message;
        }

        if (OFFSCREEN_RENDERING)
        {

            if (!_bufferEmpty(scene.oSceneData.ScreenBuffer))
            {
                if (!scene.oSceneData.ScreenBuffer_init)
                {
                    scene.oSceneData.ScreenBuffer_init = createGraphics(width, height);
                    scene.oSceneData.ScreenBuffer_init.pixelDensity(1);
                }
                scene.oSceneData.ScreenBuffer_init.image(scene.oSceneData.ScreenBuffer, 0, 0);
            }
            
        }
    }



    // Detects images and sounds assets in the code of all scenes 
    // ... and then downloads the assets
    // The fnDownloadComplete is triggered at the end of download (even if errors)
    // If errors, then the fnError is triggered once before the fnDownloadComplete
    // Normally on fnDownloadComplete the user can call the showScene functions...
    function downloadAssets(fnDownloadComplete, fnError)
    {
        // get the code in all the scenes as a big string
        var code = "";
        for(var o of scenes)
            code += o.sceneCode;
        
        var oFinder = AssetsFinder(code, oAssetsData);
        var arImages = oFinder.getImages();
        var arSounds = oFinder.getSounds();

        oAssetsCache.downloadAssets(arImages, arSounds, fnDownloadComplete, fnError);
    }


    return { wire : wire, 
            draw : draw,
            addScene : addScene, 
            addScenes : addScenes,
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
