
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

    return {
        alert : alert,
        confirm : confirm,
        prompt : prompt,
        warning : warning,
        notify : notify
    }
}
