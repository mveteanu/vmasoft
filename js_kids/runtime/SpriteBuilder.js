
function SpriteBuilder(oAssetsData, oAssetsCache)
{
    // Returns a p5.Play sprite object by loading the metadata information of specified spriteName
    function getSprite(spriteName, p1, p2, p3)
    {
        if (oAssetsData == null || !spriteName)
            return null;

        // Check if the spriteName contains also the animation in format sprite.animation
        var p = spriteName.indexOf(".");
        if (p >= 0)
        {
            var spriteAnimation = spriteName.substr(p + 1, spriteName.length - p - 1);
            spriteName = spriteName.substr(0, p);
        }

        var oSpriteData = oAssetsData.getSprite(spriteName);
        if (oSpriteData == null)
            return null;

        var arAnimations = oSpriteData.Animations;
        if (arAnimations == null || !Array.isArray(arAnimations))
            return null;

        if (arAnimations.length == 0)
            return null;
            
        const [x, y, scale] = processParameters(p1, p2, p3);

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

        if (spriteAnimation)
            oSprite.changeAnimation(spriteAnimation);

        oSprite.scale = scale;

        return augmentSprite(oSprite);
    }

    function processParameters(p1, p2, p3)
    {
        var x = width / 2;
        var y = height / 2;
        var scale = 1;

        if (p1 != null)
        {
            scale = p1;
        }

        if (p2 != null)
        {
            x = p1;
            y = p2;
            scale = 1;
        }

        if (p3 != null)
        {
            scale = p3;
        }

        return [x, y, scale];
    }

    function augmentSprite(oSprite)
    {
        if (!oSprite)
            return oSprite;

        oSprite.show = function(animationName) {
            oSprite.changeAnimation(animationName);
        }

        Object.defineProperties(oSprite, { 
            "x" : {
                    get() { return oSprite.position.x; },
                    set(value) { oSprite.position.x = value; }
                    },
            "y" : {
                get() { return oSprite.position.y; },
                set(value) { oSprite.position.y = value; }
                }
            });

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
