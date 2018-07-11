
function SpritesBar(tcSprites, tcSpritesPages)
{
    var oDivSprites;
    var oUsageArea;
    var oExampleValue;

    _init();

    function load()
    {
        var mapSprites = getSprites();
        if (!mapSprites)
            return;

        var lstStatic = FilterList("lstSpriteStatic");
        lstStatic.addEventListener(FilterListEvents.OnItemSelected, handleItemSelected);
        lstStatic.setItemTemplate(`<div class="filterlistitem image"><img style="height:155px; max-width:100%;" src="$data1"><div>$data0</div></div>`);
        
        var lstAnimated = FilterList("lstSpriteAnimated");
        lstAnimated.addEventListener(FilterListEvents.OnItemSelected, handleItemSelected);
        lstAnimated.setItemTemplate(`<div class="filterlistitem image"><img style="height:155px; max-width:100%" src="$data1"><div>$data0</div></div>`);

        mapSprites.forEach( (value, key, map) => {
                addSprite(value, lstStatic, lstAnimated)
        } );
    }


    function _init()
    {
        var tc = TabControl(tcSprites, tcSpritesPages)
        
        oDivSprites = html.findElement(tcSprites);
        oUsageArea = html.findFirstElement("sidebarusage", oDivSprites);
        oExampleValue = html.findFirstElement("examplevalue", oUsageArea);
    }

    function addSprite(value, lstStatic, lstAnimated)
    {
        if (!value || !value.Animations)
            return;

        var lst = isAnimated(value) ? lstAnimated : lstStatic;

        lst.addItem( value.Name, value.Tags, [ value.Name, value.Thumb ] );
    }

    function isAnimated(value)
    {
        if ( value.Animations.length > 1 )
            return true;

        var animation = value.Animations[0];
        if (animation.Images.length > 1)
            return true;

        if (animation.Frames || animation.InferFrames)
            return true;

        return false;
    }

    function getSprites()
    {
        if (!oSketch || !oSketch._AssetsData)
            return null;

        return oSketch._AssetsData.getSprites();
    }

    function handleItemSelected(sender, eventArgs)
    {
        if (!eventArgs || !eventArgs.Item)
            return;

        oExampleValue.innerText = "sprite( '" + eventArgs.Item.Name + "' )";
    }
    
    return {
        load : load
    }

}
