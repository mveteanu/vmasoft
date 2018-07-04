
function AssetsCache()
{
    // Keeps a cache of images { Path, ObjData }
    var arImagesCache = [];
    
    // Keeps a cache of sounds { Path, ObjData }
    var arSoundsCache = [];

    
    // TODO: 
    //    - Switch to use Map() instead of arrays for the caches in order to improve performance
    //    - Implement cache capacity management to prevent out-of-memory in case that assets from difference sketches accumulate over time...
    

    // Clears the internal cache... therefore releasing memory...
    function clearCache()
    {
        arImagesCache = [];
        arSoundsCache = [];
    }


    // Download images and sounds from specified arrays
    // The download complete callback is always called at the end (even if errors).
    // If errors then the fnError is triggered once before the fnDownloadComplete
    function downloadAssets(arImages, arSounds, fnDownloadComplete, fnError)
    {
        var count = 2; // images and sounds
        var err = 0;

        downloadImages(arImages, onDownloadComplete, onDownloadError);
        downloadSounds(arSounds, onDownloadComplete, onDownloadError);

        function onDownloadComplete()
        {
            count--;
            onCompleteTriggerCallbacks();
        }

        function onDownloadError()
        {
            err++;
        }

        function onCompleteTriggerCallbacks()
        {
            if (count > 0)
                return;

            if (err > 0)
            {
                if(fnError)
                    fnError();
            }

            if(fnDownloadComplete)
                fnDownloadComplete();
        }
    }

    
    // Download images from the specified array
    // The download complete is triggered always at the end (even if errors). If errors the fnError is triggered once before the fnDownloadComplete
    function downloadImages(arCandidateImages, fnDownloadComplete, fnError)
    {
        downloadAssetsHelper(arCandidateImages, arImagesCache, loadImage, fnDownloadComplete, fnError);
    }


    // Download sounds from the specified array
    // The download complete is triggered always at the end (even if errors)
    function downloadSounds(arCandidateSounds, fnDownloadComplete, fnError)
    {
        downloadAssetsHelper(arCandidateSounds, arSoundsCache, loadSound, fnDownloadComplete, fnError);
    }


    // arCandidateAssets = array of assets that needs to be downloaded
    // arAssetsCache = points to the specific cache structure for the assets (the previous assets will be first verified if already in cache)
    // fnLoader = function that will do the download (e.g. loadImage, loadSound)
    // fnDownloadComplete = complete callback. This callback will always be triggered at the end of download (If errors, this callback will be triggered after the errors callback)
    // fnError = error callback. This is triggered once before the download complete trigger... but only if errors
    function downloadAssetsHelper(arCandidateAssets, arAssetsCache, fnLoader, fnDownloadComplete, fnError)
    {
        // Eliminate from list already downloaded images and duplicates
        var arAssets = reducePaths(arCandidateAssets, arAssetsCache);

        var count = arAssets.length;
        var err = 0;

        // If no asset is supposed to be downloaded... trigger the callbacks and return
        if (count == 0)
        {
            onCompleteTriggerCallbacks();
            return;
        }

        // let is necesary in this case...
        for(let assetPath of arAssets)
        {
            fnLoader( assetPath, 
                (objData) => {
                    count--;
        
                    addToCache( assetPath, objData, arAssetsCache );
                 
                    onCompleteTriggerCallbacks();
                }, 
                () => {
                    count--;
                    err++;

                    onCompleteTriggerCallbacks();
                }
            );
        }
    
        function onCompleteTriggerCallbacks()
        {
            // If didn't download all the assets...
            if ( count > 0 )
                return;

            // First trigger the error callback if any errors...
            if (err > 0)
            {
                if (fnError)
                    fnError();
            }

            // ... then trigger the complete callback
            if (fnDownloadComplete)
                fnDownloadComplete();
        }
    }


    // Reduce the array of provided paths, eliminating
    // downloaded paths and duplicates
    function reducePaths(arPaths, arCacheOfObjects)
    {
        var ar = [];
        
        for(var path of arPaths)
        {
            // If is not already in the cache...
            if ( getFromCache(path, arCacheOfObjects) == null )
            {
                // and not a duplicate
                if ( ar.indexOf(path) == -1 )
                {
                    // ... then add it to the return array
                    ar.push(path);
                }
            }
        }

        return ar;
    }


    // Returns an object wrapper from the cache based on index or path information
    function getFromCache(indexOrPath, arCacheOfObjects)
    {
        // ... check if argument is number...
        if (typeof indexOrPath === 'number')
        {
            if (indexOrPath >= 0 && indexOrPath < arCacheOfObjects.length)
            {
                return arCacheOfObjects[indexOrPath];
            }
        }

        // ... otherwise assume path
        for(var o of arCacheOfObjects)
        {
            if (o.Path == indexOrPath)
                return o;
        }

        return null;
    }

    function addToCache(path, obj, arCacheOfObjects)
    {
        arCacheOfObjects.push({
            Path : path,
            ObjData : obj
        });
    }

    // Returns the number of images in the cache
    function getImageCount()
    {
        return arImagesCache.length;
    }

    // Returns the number of songs in the cache
    function getSoundCount()
    {
        return arSoundsCache.length;
    }

    // Retrieves and returns the image object from the cache (... or null if not found)
    // TODO: Maybe I should return a generic image if the one requested is not found...
    function getImage(indexOrPath)
    {
        var o = getFromCache(indexOrPath, arImagesCache);
        if ( o != null )
        {
            return o.ObjData;
        }

        return null;
    }

    // Retrieves and returns an array of objects specified by their path information
    function getImages(arPaths)
    {
        var ar = [];
        if (arPaths == null || !Array.isArray(arPaths))
            return ar;

        for(var path of arPaths)
        {
            ar.push( getImage(path) );
        }

        return ar;
    }

    // Retrieves and returns the sound object from the cache (... or null if not found)
    // TODO: Maybe I should return a generic sound if the one requested is not found...
    function getSound(indexOrPath)
    {
        var o = getFromCache(indexOrPath, arSoundsCache);
        if ( o != null )
        {
            return o.ObjData;
        }

        return null;
    }


    return { downloadAssets : downloadAssets,
            downloadImages : downloadImages,
            downloadSounds : downloadSounds,
            clearCache : clearCache,
            getImageCount : getImageCount,
            getSoundCount : getSoundCount,
            getImage : getImage,
            getSound : getSound,
            getImages : getImages
    }
}
