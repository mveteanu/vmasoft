
function SpriteBuilder(oAssetsData, oAssetsCache)
{
    // Returns a p5.Play sprite object by loading the metadata information of specified spriteName
    function getSprite(spriteName, x, y)
    {
        if (oAssetsData == null)
            return null;

        var oSpriteData = oAssetsData.getSprite(spriteName);
        if (oSpriteData == null)
            return null;

        var arAnimations = oSpriteData.Animations;
        if (arAnimations == null || !Array.isArray(arAnimations))
            return null;

        if (arAnimations.length == 0)
            return null;

        if (x == null || y == null)
        {
            x = width / 2;
            y = height / 2;
        }

        // use p5.Play function to create a sprite
        var oSprite = createSprite(x, y);

        for(var i = 0; i < arAnimations.length; i++)
        {
            var oAnimationData = arAnimations[i];
            var oAnimation = getAnimation(oAnimationData);

            if (oAnimation != null)
            {
                var animationName = oAnimationData.Name != null ? oAnimationData.Name : "animation" + i;
                oSprite.addAnimation( animationName, oAnimation );
            }
        }

        return oSprite;
    }


    function getAnimation(oAnimationData)
    {
        if (oAnimationData.Images == null || !Array.isArray(oAnimationData.Images) )
            return null;

        if (oAnimationData.Images.length == 0)
            return null;

        // Returns the array of animation image objects based on the specified array of paths
        var arImageObjects = oAssetsCache.getImages(oAnimationData.Images);

        // If .Frames is present, assume a spritesheet with a mapping table
        if (oAnimationData.Frames && Array.isArray(oAnimationData.Frames))
        {
            var oSpriteSheet = loadSpriteSheet(arImageObjects[0], oAnimationData.Frames);
            var oAnimation = loadAnimation(oSpriteSheet);

            return oAnimation;
        }

        // If .InferFrames is present, assume a spritesheet with sprite dimensions specified
        if(oAnimationData.InferFrames)
        {
            var noFrames = oAnimationData.InferFrames.count || oAnimationData.InferFrames.Count;
            var widthFrame = oAnimationData.InferFrames.width || oAnimationData.InferFrames.Width;
            var heightFrame = oAnimationData.InferFrames.height || oAnimationData.InferFrames.Height;

            var oSpriteSheet = loadSpriteSheet(arImageObjects[0], widthFrame, heightFrame, noFrames);
            var oAnimation = loadAnimation(oSpriteSheet);

            return oAnimation;
        }

        // ... load the animation from the array of images
        var oAnimation = loadAnimation.apply(window, arImageObjects);
        return oAnimation;
    }

    return { getSprite : getSprite
    }
}
