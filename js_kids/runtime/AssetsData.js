
// AssetsData encapsulate the JSON objects containing metadata about all available assets (images and sounds)
function AssetsData()
{
    var Assets = {};

    _init();
    
    function getBackgrounds()
    {
        return Assets.Backgrounds;
    }

    // Get DTO of specified background
    function getBackground(sName)
    {
        return Assets.Backgrounds.get(sName);
    }

    function getSprites()
    {
        return Assets.Sprites;
    }

    // Get DTO of specified sprite
    function getSprite(sName)
    {
        return Assets.Sprites.get(sName);
    }

    function getMusics()
    {
        return Assets.Music;
    }

    // Get DTO of specified music
    function getMusic(sName)
    {
        return Assets.Music.get(sName);
    }

    function getSounds()
    {
        return Assets.Sounds;
    }

    // Get DTO of specified sound
    function getSound(sName)
    {
        return Assets.Sounds.get(sName);
    }

    // Get an array with all the images for the specified background
    function getBackgroundImages(sName)
    {
        var o = Assets.Backgrounds.get(sName);
        return _asArray(o, "Images");        
    }

    // Get an array with all the images for the specified sprite
    function getSpriteImages(sName)
    {
        var ar = [];        
        var o = Assets.Sprites.get(sName);
        if (!o)
            return ar;

        var arAnimations = o.Animations;
        
        if (arAnimations == null)
            return ar;

        if (!Array.isArray(arAnimations))
            return ar;

        for(var oAnim of arAnimations)
        {
            var arAnim = _asArray(oAnim, "Images");
            ar = ar.concat(arAnim);
        }

        return ar;
    }

    // Get an array with sound files for the specified sound
    // Normally the array should have 1 element
    function getSoundFiles(sName)
    {
        var o = Assets.Sounds.get(sName);
        return _asArray(o, "File");        
    }

    // Get an array with sound files for the specified music
    // Normally the array should have 1 element    
    function getMusicFiles(sName)
    {
        var o = Assets.Music.get(sName);
        return _asArray(o, "File");        
    }

    function _asArray(o, propertyName)
    {
        if (!o)
            return [];

        if (!(propertyName in o))
            return [];

        var ar = o[propertyName];
        if (!ar)
            return [];

        if (typeof ar == "string")
            return [ar];

        if (Array.isArray(ar))
            return ar;

        return [];
    }

    function _init()
    {
        Assets.Backgrounds = _getAssetsMap(_oBackgroundsAssets, "Backgrounds");
        Assets.Sprites = _getAssetsMap(_oSpritesAssets, "Sprites");
        Assets.Sounds = _getAssetsMap(_oSoundsAssets, "Sounds");
        Assets.Music = _getAssetsMap(_oMusicAssets, "Music");
    }

    // Converts the JSON object with assets in a Map structure for quick search
    function _getAssetsMap(oJSON, propertyName)
    {
        var map = new Map();
        
        if ( oJSON == null )
            return map;

        if ( !(propertyName in oJSON) )
            return map;

        var ar = oJSON[propertyName];
        if (!Array.isArray(ar))
            return map;

        for(var o of ar)
        {
            if (o != null && o.Name)
            {
                map.set(o.Name, o);
            }
        }

        return map;
    }

    return { getBackgrounds : getBackgrounds,
            getBackground : getBackground,
            getSprites : getSprites,
            getSprite : getSprite,
            getMusics : getMusics,
            getMusic : getMusic,
            getSounds : getSounds,
            getSound : getSound, 
            getBackgroundImages : getBackgroundImages,
            getSpriteImages : getSpriteImages,
            getSoundFiles : getSoundFiles,
            getMusicFiles : getMusicFiles
    }
}
