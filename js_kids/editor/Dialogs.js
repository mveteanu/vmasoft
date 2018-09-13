
function Dialogs()
{
    var defaultTitle = "CodeBeanz";
    
    alertify.defaults.transition = "zoom";

    function alert(message, fn)
    {
        alertify.alert(defaultTitle, message, fn);
    }

    function confirm(message, arButtons, fnOnOK)
    {
        var o = alertify.confirm(defaultTitle, message, fnOnOK, null);

        if (arButtons && arButtons.length == 2)
            o.set('labels', {ok:arButtons[0], cancel:arButtons[1]});
    }

    function prompt(message, value, fnOnOK)
    {
        alertify.prompt(defaultTitle, message, value, function(e, value) {
            return fnOnOK(value);
        }, null);
    }

    function warning(message, delay)
    {
        var o = alertify.warning(message);
        
        var t = delay ? delay : 5;
        o.delay(t);
    }

    function notify(message, delay)
    {
        var o = alertify.notify(message);
        
        var t = delay ? delay : 5;
        o.delay(t);
    }

    function shareProgram(id)
    {
        var divShareProgram = html.findElement("shareProgram");
        
        var txtProgramUrl = document.getElementById("txtProgramUrl");
        var txtProgramEmbed = document.getElementById("txtProgramEmbed");
        var chkProgramSource = document.getElementById("chkProgramSource");
        var btnCopyUrl = document.getElementById("btnCopyUrl");
        var btnCopyEmbed = document.getElementById("btnCopyEmbed");

        if (!chkProgramSource.onchange)
            chkProgramSource.onchange = () => _setContent();

        if (!btnCopyUrl.onclick)
            btnCopyUrl.onclick = () => _copy(txtProgramUrl);

        if (!btnCopyEmbed.onclick)
            btnCopyEmbed.onclick = () => _copy(txtProgramEmbed);

        alertify.shareProgram || alertify.dialog('shareProgram',function(){
            return {
                main : function(content){
                    _setContent();
                    this.setContent(content);
                },
                setup : function(){
                    return {
                        buttons:[{text: "Cool!", key:27/*Esc*/, className: alertify.defaults.theme.ok}],
                        options: {
                            title:"Share Program",
                            basic:false,
                            maximizable:false,
                            resizable:false,
                            padding:false
                        }
                    };
                },
                hooks : {
                    onshow: function() {
                      this.elements.dialog.style.maxWidth = '600px';
                      this.elements.dialog.style.width = '600px';
                    }
                }                              
            }
        });

        function _setContent()
        {
            var page = "run.html";
            var w = 800;
            var h = 600;

            if (chkProgramSource.checked)
            {
                page = "code.html";
                w = 1024;
                h = 670;
            }

            txtProgramUrl.value = `http://www.codebeanz.com/${page}?${id}`;
            txtProgramEmbed.value = `<embed src="${txtProgramUrl.value}" style="width:${w}px; height:${h}px;">`;
        }

        function _copy(txtCtrl)
        {
            if (!txtCtrl)
                return;

            txtCtrl.select();
            document.execCommand("copy")

            notify("Copied", 1);
        }
        
        alertify.shareProgram(divShareProgram);
    }

        
    return {
        alert : alert,
        confirm : confirm,
        prompt : prompt,
        warning : warning,
        notify : notify,
        shareProgram : shareProgram
    }
}
