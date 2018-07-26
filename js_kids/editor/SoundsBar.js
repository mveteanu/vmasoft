
function SoundsBar(tcSounds, tcSoundsPages)
{
    var oDivSounds;
    var oUsageArea;
    var oExampleValue;

    _init();


    function load()
    {
        if (!oSketch || !oSketch._AssetsData)
            return null;

        var mapSounds = oSketch._AssetsData.getSounds();
        if (mapSounds)
            fillList("lstSoundsEffects", mapSounds, handleSoundSelected);

        var mapMusic = oSketch._AssetsData.getMusics();
        if (mapMusic)
            fillList("lstSoundsMusic", mapMusic, handleMusicSelected);
    }


    function fillList(lstId, map, fnClick)
    {
        var lst = FilterList(lstId);
        lst.addEventListener(FilterListEvents.OnItemSelected, fnClick);
        lst.setItemTemplate(`<div class="filterlistitem sound"><i class="fas fa-volume-up"></i><div style='padding-top: 5px;'>$data0</div></div>`);
    
        map.forEach( (value, key, map) => {
            lst.addItem( value.Name, value.Tags, [ value.Name ] );
        } );
    }

    function _init()
    {
        var tc = TabControl(tcSounds, tcSoundsPages)
        
        oDivSounds = html.findElement(tcSounds);
        oUsageArea = html.findFirstElement("sidebarusage", oDivSounds);
        oExampleValue = html.findFirstElement("examplevalue", oUsageArea);

        oExampleValue.addEventListener("click", handleExampleClick, false);
    }

    function handleSoundSelected(sender, eventArgs)
    {
        if (!eventArgs || !eventArgs.Item)
            return;

        oExampleValue.innerHTML = "sound( '" + eventArgs.Item.Name + "' ) <i class='far fa-copy'></i>";
    }

    function handleMusicSelected(sender, eventArgs)
    {
        if (!eventArgs || !eventArgs.Item)
            return;

        oExampleValue.innerHTML = "music( '" + eventArgs.Item.Name + "' ) <i class='far fa-copy'></i>";
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
