
function AssetsFinder(code, oData)
{
    
    // TODO: ...
    function findBackgroundNames()
    {
        return ["clouds"];
    }

    // TODO: ...
    function findSpriteNames()
    {
        return ["player", "askterisk_stretching", "asterisk_explode"];
    }

    // TODO: ...
    function findMusicNames()
    {
        return [];
    }

    // TODO: ...
    function findSoundNames()
    {
        return ["doorbell"];
    }

    // Gets a list with all the image paths used in the specified code
    // The list is returned by checking against the assets metadata
    function getImages()
    {
        if (oData == null)
            return [];
        
        var arBackgroundsImages = [];
        var arSpritesImages = [];

        var arBackgroundsNames = findBackgroundNames();
        var arSpritesNames = findSpriteNames();

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

        var arMusicNames = findMusicNames();
        var arSoundNames = findSoundNames();

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

    return { getImages : getImages,
            getSounds : getSounds
    }
}
