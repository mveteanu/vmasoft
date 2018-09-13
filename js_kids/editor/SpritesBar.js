
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
        lstStatic.setItemTemplate(`<div class="filterlistitem image" draggable="true"><img style="height:155px; max-width:100%;" src="$Thumb" title="$Tooltip"><div>$Name</div></div>`);
        
        var lstAnimated = FilterList("lstSpriteAnimated");
        lstAnimated.addEventListener(FilterListEvents.OnItemSelected, handleItemSelected);
        lstAnimated.setItemTemplate(`<div class="filterlistitem image" draggable="true"><img style="height:155px; max-width:100%" src="$Thumb" title="$Tooltip"><div>$Name</div></div>`);

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

        oExampleValue.addEventListener("click", handleExampleClick, false);
    }

    function addSprite(value, lstStatic, lstAnimated)
    {
        if (!value || !value.Animations)
            return;

        value.DragText = "sprite('" + value.Name + "');\n";
        value.Tooltip = getTooltip(value);

        var lst = isAnimated(value) ? lstAnimated : lstStatic;

        lst.addItem( value.Name, value.Tags, value );
    }
    
    function getTooltip(value)
    {
        var noAnimations = value.Animations.length;
        if (noAnimations <= 1)
            return `sprite('${value.Name}');`;

        var txt = "";

        for(var i = 0; i < noAnimations; i++)
        {
            txt += "p.show('" + value.Animations[i].Name + "');\n";
        }

        return `var p = sprite('${value.Name}');\n...\n${txt}`;
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
        if (!eventArgs || !eventArgs.Item || !eventArgs.Item.Data)
            return;

        oExampleValue.innerHTML = eventArgs.Item.Data.DragText + " <i class='far fa-copy'></i>";
    }
    
    function handleExampleClick(e)
    {
        if ( html.copyElement(oExampleValue) )
            dialogs.notify("Copied", 1);
    }

    return {
        load : load
    }

}
