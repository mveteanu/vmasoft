
function CommandsBar(tcCommands, tcCommandsPages)
{
    var oDivCommands;

    _init();

    function load()
    {
        fetch("assets/commands.json")
        .then(function(response){
            return response.json();
        })
        .then(function(oData){
            addCommands(oData.Commands);
        })
        .catch(function(error){
        })
    }

    function addCommands(oData)
    {
        addCommandsToList("lstCmdStructure", oData.Structure);
        addCommandsToList("lstCmdEvents", oData.Events);
        addCommandsToList("lstCmdCommon", oData.Common);
        addCommandsToList("lstCmdDrawing", oData.Drawing);
        addCommandsToList("lstCmdMedia", oData.Media);
    }

    function addCommandsToList(lstName, arCommands)
    {
        var lst = createList(lstName);
        
        for(var o of arCommands)
        {
            addCommandToList(lst, o);
        }
    }

    function addCommandToList(lst, value)
    {
        value.DragText = value.Code;
        value.Tooltip = value.Desc + "\n\n" + value.Code;

        lst.addItem( value.Text, value.Tags, value );
    }

    function _init()
    {
        var tc = TabControl(tcCommands, tcCommandsPages)
        var tcPages = html.findElement(tcCommandsPages);
        oDivCommands = html.findElement(tcCommands);
    }


    function createList(lstName)
    {
        var lst = FilterList(lstName);
        lst.setItemTemplate(`<div class="filterlistitem command" draggable="true" title="$Tooltip">$Text</div>`);

        return lst;
    }
   
    return {
        load : load
    }

}
