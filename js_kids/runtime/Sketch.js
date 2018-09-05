

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
        resetAttributes();
        
        if (sketchMusic != null)
        {
            sketchMusic.stop();
            sketchMusic = null;
        }

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

    // Returns the number of scenes in the sketch
    function getSceneCount()
    {
        if (!scenes)
            return 0;

        return scenes.length;
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

        //if (!OFFSCREEN_RENDERING) /// If not offscreen rendering... I should save scenes attributes...
        //var currAttributes = p5.Renderer.prototype.push.apply(sketchCanvas);

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
            text(currScene.errorMessage, width / 2, height / 2);
            return;
        }

        if ( !currScene.sceneExecuted )
        {
            _executeScene(currScene);
            if (currScene.errorMessage)
                return;
        }

        if ( currScene.hasEnter && !currScene.enterExecuted  )
        {
            _executeSceneEnter(currScene);
            if (currScene.errorMessage)
                return;
        }

        _applySceneBackground(currScene);
        _drawSprites(currScene.spritesGroup, (o) => o.depth <= 0);

        if ( currScene.hasLoop )
        {
            _executeSceneLoop(currScene);
            if (currScene.errorMessage)
                return;
        }

        if ( !currScene.hasLoop || OFFSCREEN_RENDERING)
        {
            image(currScene.oSceneData.ScreenBuffer, 0, 0);
        }

        _drawSprites(currScene.spritesGroup, (o) => o.depth > 0);
    }



    function _executeScene(currScene)
    {
        if (currScene.errorMessage)
            return;

        _setScreenBufferP5Variables(currScene.oSceneData.ScreenBuffer);

        try
        {
            currScene.oScene = currScene.fnScene( currScene.oSceneData );
            currScene.sceneExecuted = true;
        }
        catch(e)
        {
            currScene.errorMessage = "Runtime error\n" + e.message;
        }
    }


    function _executeSceneEnter(currScene)
    {
        if (currScene.errorMessage)
            return;

        _setScreenBufferP5Variables(currScene.oSceneData.ScreenBuffer);

        try
        {
            currScene.oScene.enter();
            currScene.enterExecuted = true;
        }
        catch(e)
        {
            currScene.errorMessage = "Runtime error in enter()\n" + e.message;
        }

        return currScene.errorMessage;
    }


    function _executeSceneLoop(currScene)
    {
        if (currScene.errorMessage)
            return;

        _setScreenBufferP5Variables(currScene.oSceneData.ScreenBuffer);

        try
        {
            currScene.oScene.loop();
        }
        catch(e)
        {
            currScene.errorMessage = "Runtime error in loop()\n" + e.message;
        }

        return currScene.errorMessage;
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

    function resetAttributes(p5Graphics)
    {
        var buff = p5Graphics ? p5Graphics : window;

        buff.noFill();
        buff.strokeWeight(1);
        buff.stroke(0);
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
        

    function _applySceneBackground(toScene)
    {
        var currScene = toScene != null ? toScene : scene; // if no argument is transmited... use current scene
        
        var bkArgs = currScene.oSceneData.SceneBackground;

        bkArgs = _checkBackgroundArguments(bkArgs);

        if (bkArgs instanceof p5.Image)
        {
            image(bkArgs, 0, 0);
        }
        else
        {
            p5.prototype.background.apply(window, bkArgs);
        }
    }

    function _checkBackgroundArguments(bkArgs)
    {
        if (bkArgs == null || bkArgs.length == 0)
            return ["White"]; // ... assume "White" if the scene didn't set any background

        var bk = oAssetsData.getBackground( bkArgs[0] );
        if (!bk)
            return bkArgs;

        var arImages = bk.Images;
        if (arImages == null || !Array.isArray(arImages) )
            return ["White"];

        var arImageObjects = oAssetsCache.getImages(arImages);
        if (!arImageObjects || arImageObjects.length == 0)
            return ["White"];

        return arImageObjects[0];
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
        g.frameCount = frameCount;
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
            resetAttributes(oScreenBuffer);

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
            fnSceneError = "Invalid code\n" + e.message;
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

        if (scene.errorMessage)
            return;

        var fnSceneEvent = scene.oScene[sEvent];
        if (!fnSceneEvent)
            return;

        // If an off-screen buffer is used (like in the case of static scenes)
        // ... then sync a few common variables with the off-screen buffer
        _setScreenBufferP5Variables(scene.oSceneData.ScreenBuffer);
        
        try
        {
            fnSceneEvent();
        }
        catch(e)
        {
            scene.errorMessage = "Runtime error in " + sEvent + "()\n" + e.message;
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
            getSceneCount : getSceneCount,
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
