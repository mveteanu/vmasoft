
function Sketch()
{
    const P5Events = ["mouseClicked", "keyPressed"];
    
    var scenes = [];
    var scene = null;

    const oDefaultSceneArgs = { 
                backgroundCallBack : function(){ background.apply(window, arguments);} 
            };

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


    // Add a new scene to the sketch
    function addScene(sceneName, sceneCode)
    {
        var foundSceneIndex = findSceneIndex(sceneName);
        if (foundSceneIndex >= 0)
        {
            var foundScene = scenes[foundSceneIndex];
            
            // Cancel adding the scene if it has the same code as the one already added...
            if ( foundScene.sceneCode == sceneCode )
                return;
        }
        
        var oCodeUtils = CodeUtils();
        oCodeUtils.addP5Events(P5Events);

        var fnScene = oCodeUtils.getSceneFunction(sceneCode, sceneName);
        if (!fnScene)
            return;

        //var oSceneData = {};

        // Executes the scene function to return the object with 'pointers' to scene events
        // e.g. loop, mouseClicked, etc.
        var oScene = fnScene();

        var oSceneWrapper = {   sceneName : sceneName,
                                sceneCode : sceneCode,
                                fnScene : fnScene,
                                oScene : oScene,
                                oSceneArgs : null,
                                hasLoop : "loop" in oScene,
                                hasEnter : "enter" in oScene,
                                enterExecuted : false
                            };

        if (foundSceneIndex >= 0)
        {
            // Replace the scene
            scenes[foundSceneIndex] = oSceneWrapper;
        }
        else
        {
            // Add the new scene in the scenes array 
            scenes.push(oSceneWrapper);
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

        return sceneIndex >= 0 ? scenes[sceneIndex] : null;
    }

    // Clear all the scenes from the sketch
    function clearScenes()
    {
        scene = null;
        scenes = [];
    }

    // Show the scene specified by name
    // The function justs sets the current scene... in order for the main loop to know what to call
    function showScene(sceneNameOrIndex, sceneArgs)
    {
        var o = findScene(sceneNameOrIndex);

        // Re-arm the enter function at each show of the scene
        o.enterExecuted = false;

        // inject sceneArgs as a property of the scene
        o.oScene.PublicVars.Arguments = sceneArgs;                                      // TODO: <---- this is not good since cannot access arguments from the loose code...
        //o.oSceneArgs = sceneArgs;

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


    // This is the main draw() dispatcher of the sketch...
    function draw()
    {
        // take the current scene in a variable to protect it in case
        // it gets changed by the user code in the events such as enter()...
        var currScene = scene;
        
        if ( currScene == null || currScene.oScene == null )
        {
            background("White");    // wipe the screen...
            return;
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

            currScene.oScene.loop();

            // Call p5.play function to draw sprites...
            drawSprites();
        }

        // If the scene doesn't have enter() or loop() functions... then re-run the main code of the scene
        // (this code run before when the scene was added)
        // Note: use enterExecuted flag to execute the main code just once per each scene show... (just like the enter() function)
        if (!currScene.hasEnter && !currScene.hasLoop && !currScene.enterExecuted)
        {
            currScene.oScene = currScene.fnScene(oDefaultSceneArgs);
            currScene.enterExecuted = true;
        }
    }

    function _applySceneBackground(currScene)
    {
        var bkArgs = currScene.oScene.PublicVars.SceneBackground;
        if (bkArgs == null)
            bkArgs = ["White"];

        background.apply(window, bkArgs);
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


    // Returns the specified scene PublicVars object
    function getPublicVars(sceneNameOrIndex)
    {
        var oSceneWrapper = findScene(sceneNameOrIndex);
        if (!oSceneWrapper)
            return null;

        var oScene = oSceneWrapper.oScene;
        if (!oScene)
            return null;

        return oScene.PublicVars;    
    }


    return { wire : wire, 
            addScene : addScene, 
            findScene : findScene,
            clearScenes : clearScenes,
            getPublicVars : getPublicVars,
            showScene : showScene,
            showNextScene : showNextScene }
}
