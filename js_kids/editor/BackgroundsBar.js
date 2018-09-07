
function BackgroundsBar(tcBackgrounds, tcBackgroundsPages)
{
    var oDivBackgrounds;
    var oUsageArea;
    var oExampleValue;

    _init();

    function load()
    {
        initColors();
        initImages();
        initAnimatedImages();
        initScrollingImages();
        initEffects();
    }

    function _init()
    {
        var tc = TabControl(tcBackgrounds, tcBackgroundsPages)
        
        var tcPages = html.findElement(tcBackgroundsPages);

        oDivBackgrounds = html.findElement(tcBackgrounds);
        oUsageArea = html.findFirstElement("sidebarusage", oDivBackgrounds);
        oExampleValue = html.findFirstElement("examplevalue", oUsageArea);

        oExampleValue.addEventListener("click", handleExampleClick, false);
    }

    function initColors()
    {
        var colors = {
            Red : [ "IndianRed", "LightCoral", "Salmon", "DarkSalmon", "LightSalmon", "Crimson", "Red", "FireBrick", "DarkRed" ],
            Pink : [ "Pink", "LightPink", "HotPink", "DeepPink", "MediumVioletRed", "PaleVioletRed" ],
            Orange : [ "LightSalmon", "Coral", "Tomato", "OrangeRed", "DarkOrange", "Orange" ],
            Yellow : [ "Gold", "Yellow", "LightYellow", "LemonChiffon", "LightGoldenrodYellow", "PapayaWhip", "Moccasin", "PeachPuff", 
                        "PaleGoldenrod", "Khaki", "DarkKhaki" ],
            Purple : [ "Lavender", "Thistle", "Plum", "Violet", "Orchid", "Fuchsia", "Magenta", "MediumOrchid", "MediumPurple", "RebeccaPurple", 
                        "BlueViolet", "DarkViolet", "DarkOrchid", "DarkMagenta", "Purple", "Indigo", "SlateBlue", "DarkSlateBlue", "MediumSlateBlue" ],
            Green : [ "GreenYellow", "Chartreuse", "LawnGreen", "Lime", "LimeGreen", "PaleGreen", "LightGreen", "MediumSpringGreen", "SpringGreen", 
                        "MediumSeaGreen", "SeaGreen", "ForestGreen", "Green", "DarkGreen", "YellowGreen", "OliveDrab", "Olive", "DarkOliveGreen", 
                        "MediumAquamarine", "DarkSeaGreen", "LightSeaGreen", "DarkCyan", "Teal" ],
            Blue : [ "Aqua", "Cyan", "LightCyan", "PaleTurquoise", "Aquamarine", "Turquoise", "MediumTurquoise", "DarkTurquoise", "CadetBlue", "SteelBlue", 
                    "LightSteelBlue", "PowderBlue", "LightBlue", "SkyBlue", "LightSkyBlue", "DeepSkyBlue", "DodgerBlue", "CornflowerBlue", "MediumSlateBlue", 
                    "RoyalBlue", "Blue", "MediumBlue", "DarkBlue", "Navy", "MidnightBlue" ],
            Brown : [ "Cornsilk", "BlanchedAlmond", "Bisque", "NavajoWhite", "Wheat", "BurlyWood", "Tan", "RosyBrown", "SandyBrown", "Goldenrod", "DarkGoldenrod", 
                    "Peru", "Chocolate", "SaddleBrown", "Sienna", "Brown", "Maroon" ],
            White : [ "White", "Snow", "HoneyDew", "MintCream", "Azure", "AliceBlue", "GhostWhite", "WhiteSmoke", "SeaShell", "Beige", "OldLace", "FloralWhite", 
                    "Ivory", "AntiqueWhite", "Linen", "LavenderBlush", "MistyRose" ],
            Gray : [ "Gainsboro", "LightGray", "Silver", "DarkGray", "Gray", "DimGray", "LightSlateGray", "SlateGray", "DarkSlateGray", "Black" ]
        };
        
        var lst = FilterList("lstColors");
        lst.addEventListener(FilterListEvents.OnItemSelected, handleItemSelected);

        lst.setItemTemplate(`<div class="filterlistitem color" draggable="true"><div style='width: 100%; height: 30px; margin-bottom: 2px; background-color:$Color'></div><div>$ColorName</div></div>`);

        for(var c of colors.Red) 
            lst.addItem( c, ["Red"], wrapColor(c));
        for(var c of colors.Pink) 
            lst.addItem( c, ["Pink"], wrapColor(c));
        for(var c of colors.Orange) 
            lst.addItem( c, ["Orange"], wrapColor(c));
        for(var c of colors.Yellow) 
            lst.addItem( c, ["Yellow"], wrapColor(c));
        for(var c of colors.Purple) 
            lst.addItem( c, ["Purple"], wrapColor(c));
        for(var c of colors.Green) 
            lst.addItem( c, ["Green"], wrapColor(c));
        for(var c of colors.Blue) 
            lst.addItem( c, ["Blue"], wrapColor(c));
        for(var c of colors.Brown) 
            lst.addItem( c, ["Brown"], wrapColor(c));
        for(var c of colors.White) 
            lst.addItem( c, ["White"], wrapColor(c));
        for(var c of colors.Gray) 
            lst.addItem( c, ["Gray"], wrapColor(c));
    }

    function wrapColor(c)
    {
        return {
            Color : c,
            ColorName : c,
            DragText : "background('" + c + "');\n"
        };
    }


    function initImages()
    {
        if (!oSketch || !oSketch._AssetsData)
            return;

        var mapBackgrounds = oSketch._AssetsData.getBackgrounds();
        if (!mapBackgrounds)
            return;


        var lst = FilterList("lstImages");
        lst.addEventListener(FilterListEvents.OnItemSelected, handleItemSelected);

        lst.setItemTemplate(`<div class="filterlistitem image"><img width="100%" src="$Thumb"><div>$Name</div></div>`);

        mapBackgrounds.forEach( (value, key, map) => {
            if (value)
            {
                value.DragText = "background('" + value.Name + "');\n";
                lst.addItem( value.Name, value.Tags, value );
            }
        } );
    }

    function initAnimatedImages()
    {
        var lst = FilterList("lstEffects");
        lst.addEventListener(FilterListEvents.OnItemSelected, handleItemSelected);

        lst.setItemTemplate(`<div class="filterlistitem"><div>$Name</div></div>`);
    }

    function initScrollingImages()
    {
        var lst = FilterList("lstEffects");
        lst.addEventListener(FilterListEvents.OnItemSelected, handleItemSelected);

        lst.setItemTemplate(`<div class="filterlistitem"><div>$Name</div></div>`);
    }


    function initEffects()
    {
        var lst = FilterList("lstEffects");
        lst.addEventListener(FilterListEvents.OnItemSelected, handleItemSelected);

        lst.setItemTemplate(`<div class="filterlistitem"><div>$Name</div></div>`);
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
