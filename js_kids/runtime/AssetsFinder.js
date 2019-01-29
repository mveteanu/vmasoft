
function AssetsFinder(code, oData)
{
    var arPreload = findAllParameters(code, "preload");

    // Gets a list with all the image paths used in the specified code
    // The list is returned by checking against the assets metadata
    function getImages()
    {
        if (oData == null)
            return [];
        
        var arBackgroundsImages = [];
        var arSpritesImages = [];

        var arBackgroundsNames = findBackgroundNames().concat(arPreload);
        var arSpritesNames = findSpriteNames().concat(arPreload);

        for(var sBackground of arBackgroundsNames)
        {
            var ar = oData.getBackgroundImages(sBackground);
            arBackgroundsImages = arBackgroundsImages.concat(ar);
        }

        for(var sSprite of arSpritesNames)
        {
            var ar = oData.getSpriteImages(sSprite);
            arSpritesImages = arSpritesImages.concat(ar);
        }

        return arBackgroundsImages.concat(arSpritesImages);
    }


    // Get a list with all the sound paths used in the specified code
    // The list is returned by checking against the assets metadata
    function getSounds()
    {
        if (oData == null)
            return [];

        var arMusicFiles = [];
        var arSoundFiles = [];

        var arMusicNames = findMusicNames().concat(arPreload);
        var arSoundNames = findSoundNames().concat(arPreload);

        for(var sMusic of arMusicNames)
        {
            var ar = oData.getMusicFiles(sMusic);
            arMusicFiles = arMusicFiles.concat(ar);
        }

        for(var sSound of arSoundNames)
        {
            var ar = oData.getSoundFiles(sSound);
            arSoundFiles = arSoundFiles.concat(ar);
        }

        return arMusicFiles.concat(arSoundFiles);
    }

    // ----------------- Begin private functions -----------------------


    function findBackgroundNames()
    {
        return findFirstParameter(code, "background");
    }

    function findSpriteNames()
    {
        var ar = findFirstParameter(code, "sprite");

        for(var i = 0; i < ar.length; i++ )
        {
            ar[i] = _getSpriteName(ar[i]);
        }

        return ar;
    }

    // Returns just the sprite name without the optional animation part
    function _getSpriteName(spriteName)
    {
        if (!spriteName)
            return;

        var p = spriteName.indexOf(".");
        if (p == -1)
            return spriteName;

        return spriteName.substring(0, p);
    }

    function findMusicNames()
    {
        return findFirstParameter(code, "music");
    }

    function findSoundNames()
    {
        return findFirstParameter(code, "sound");
    }

    
    // ------------- Code parsing functions --------------------------------


    // Find all parameters of specified function
    function findAllParameters(code, fnName)
    {
        var ar = [];
        var pos = 0;

        var arFunctions = _findFunction(code, fnName);

        for(var position of arFunctions)
        {
            var oPar = _findAllParameters(code, fnName, position);
            if (oPar)
                ar = ar.concat(oPar.values);
        }

        return ar;
    }


    function _findAllParameters(code, fnName, startPos)
    {
        var pos = code.indexOf(fnName, startPos);
        if (pos < 0)
            return null;

        var fromIndex = _eatSpaceFind(code, ["("], pos + fnName.length);
        if (fromIndex < 0)
            return null;

        var toIndex = code.indexOf(")", fromIndex);
        if (toIndex < 0)
            return null;

        var txtParams = code.substring(fromIndex + 1, toIndex);
        if (!txtParams)
            return null;

        var arParams = txtParams.split(",");
        for(var i = 0; i < arParams.length; i++)
        {
            arParams[i] = _trimQuotes(arParams[i]);
        }

        return { values: arParams, fromIndex : fromIndex, toIndex : toIndex };
    }


    // Returns an array with values of first string parameters of specified function
    function findFirstParameter(code, fnName)
    {
        var ar = [];
        var pos = 0;

        var arFunctions = _findFunction(code, fnName);

        for(var position of arFunctions)
        {
            var oPar = _findFirstParameter(code, fnName, position);
            if (oPar)
                ar = ar.concat(oPar.value);
        }

        return ar;
    }

    // Find the first parameter of specified function starting with specified position
    function _findFirstParameter(code, fnName, startPos)
    {
        var pos = code.indexOf(fnName, startPos);
        if (pos < 0)
            return null;

        var fromIndex = _eatSpaceFind(code, ["("], pos + fnName.length);
        if (fromIndex < 0)
            return null;

        fromIndex = _eatSpaceFind(code, [`"`, `'`, "`"], fromIndex + 1);
        if (fromIndex < 0)
            return null;

        var quoteChar = code[fromIndex];

        var toIndex = code.indexOf(quoteChar, fromIndex + 1);
        if (toIndex < 0)
            return null;

        var value = code.substring(fromIndex + 1, toIndex);
        return { value:value, fromIndex:fromIndex, toIndex:toIndex };
    }


    function _findFunction(code, fnName)
    {
        var ar = [];
        var pos = 0;

        while(true)
        {
            pos = code.indexOf(fnName, pos);
            if (pos < 0)
                break;

            ar.push(pos);
            pos += fnName.length;
        }

        return ar;
    }


    function _trimQuotes(txt)
    {
        if(!txt)
            return txt;

        var s = txt.trim();
        var arQuotes = [`"`, `'`, "`"];

        var fromIndex = arQuotes.indexOf( s[0] ) >= 0 ? 1 : 0;
        var toIndex = arQuotes.indexOf( s[s.length - 1] ) >= 0 ? s.length - 1 : s.length;
        
        return s.substring(fromIndex, toIndex);
    }



    // Search allText for one of the specified chars in the array and returns it's position if found
    // The function starts at specified position and ignores white spaces
    function _eatSpaceFind(allText, arExpectedChars, startPos)
    {
        if (!allText || !arExpectedChars)
            return -1;

        var i = startPos;
        var n = allText.length;

        while(i < n)
        {
            var c = allText[i];
            if (c == " " || c == "\t" || c == "\r" || c == "\n")
            {
                i++;
                continue;
            }

            if (arExpectedChars.indexOf(c) >= 0)
                return i;
            
            break;
        }

        return -1;
    }
    

    return { getImages : getImages,
            getSounds : getSounds
    }
}
