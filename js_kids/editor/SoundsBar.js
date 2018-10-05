
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
            fillList("lstSoundsEffects", mapSounds, "sound");

        var mapMusic = oSketch._AssetsData.getMusics();
        if (mapMusic)
            fillList("lstSoundsMusic", mapMusic, "music");
    }


    function fillList(lstId, map, usage)
    {
        var lst = FilterList(lstId);
        lst.addEventListener(FilterListEvents.OnItemSelected, handleSoundSelected);
        lst.setItemTemplate(`<div class="filterlistitem sound" draggable="true"><i class="fas fa-volume-up"></i><div style='padding-top: 5px;'>$Name</div></div>`);
    
        map.forEach( (value, key, map) => {
            value.DragText = usage + "('" + value.Name + "');\n";
            lst.addItem( value.Name, value.Tags, value );
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
