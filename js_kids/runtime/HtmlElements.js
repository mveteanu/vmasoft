function HtmlElements()
{
    // Creates an edit control INPUT. Parameters w and h are optional.
    // If h is specified then a multiline TEXTAREA is created instead
    function createEdit(x, y, w, h)
    {
        var el;
        var type;
    
        _init();
        return _return();
    
        function _init()
        {
            type = h ? "TEXTAREA" : "INPUT"
            el = document.createElement(type);
            el.setAttribute("type", "text");
            el.style.position = "absolute";
    
            if (!x && !y)
            {
                x = 0;
                y = 0;
            }
    
            if (!w)
            {
                w = 175;
            }
    
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.width = w + 'px';
    
            if (h)
            {
                el.style.resize = "none";
                el.style.height = h + "px";
            }
    
            setVisible(true);
    
            var div = window.canvas.parentElement;
            div.appendChild(el);
        }
    
        function setVisible(visible)
        {
            el.style.display = visible ? "block" : "none";
        }
    
        function isVisible()
        {
            return el.style.display === "block";
        }
    
        function getText()
        {
            return el.value;
        }
    
        function setText(text)
        {
            el.value = text;
        }
    
        function setPosition(x, y)
        {
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        }
    
        function setWidth(value)
        {
            el.style.width = value + 'px';
        }
    
        function getWidth()
        {
            return el.offsetWidth;
        }
    
        function setHeight(value)
        {
            if (type === "TEXTAREA")
                el.style.height = value + 'px';
        }
    
        function getHeight()
        {
            return el.offsetHeight;
        }
    
        function addLine(txt) 
        {
            el.value += txt + "\n";
        }
    
        function getEl()
        {
            return el;
        }
    
        function _return()
        {
            var oReturn = {
                getText : getText,
                setText : setText,
                addLine : addLine,
                setPosition : setPosition,
                getEl : getEl
            };
    
            Object.defineProperties(oReturn, { 
                "text" : {
                    get() { return oReturn.getText(); },
                    set(value) { oReturn.setText(value); }
                    },
                "readonly" : {
                    get() { return el.readOnly; },
                    set(value) { el.readOnly = value; }
                    },
                "visible" : {
                    get() { return isVisible(); },
                    set(value) { setVisible(value); }
                    },
                "width" : {
                    get() { return getWidth(); },
                    set(value) { setWidth(value); }
                    },
                "height" : {
                    get() { return getHeight(); },
                    set(value) { setHeight(value); }
                    },
                "onchange" : {
                    get() { return el.oninput; },
                    set(value) { el.oninput = value; }
                    }
                    });
    
            registerElement(oReturn);

            return oReturn;
        }
    }

    
    // Creates a BUTTON control. Parameters w, h are optional.
    function createButton(x, y, w, h)
    {
        var el;
    
        _init();
        return _return();
    
        function _init()
        {
            el = document.createElement("BUTTON");
            el.style.position = "absolute";
    
            if (!x && !y)
            {
                x = 0;
                y = 0;
            }
    
            if (!w)
                w = 130;

            if (!h)
                h = 36;

            el.style.left = x + 'px';
            el.style.top = y + 'px';
    
            el.style.width = w + 'px';
            el.style.height = h + "px";

            setVisible(true);
    
            var div = window.canvas.parentElement;
            div.appendChild(el);
        }
    
        function setVisible(visible)
        {
            el.style.display = visible ? "block" : "none";
        }
    
        function isVisible()
        {
            return el.style.display === "block";
        }
    
        function getText()
        {
            return el.innerText;
        }
    
        function setText(text)
        {
            el.innerText = text;
        }
    
        function setPosition(x, y)
        {
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        }
    
        function setWidth(value)
        {
            el.style.width = value + 'px';
        }
    
        function getWidth()
        {
            return el.offsetWidth;
        }
    
        function setHeight(value)
        {
            el.style.height = value + 'px';
        }
    
        function getHeight()
        {
            return el.offsetHeight;
        }
    
        function getEl()
        {
            return el;
        }
    
        function _return()
        {
            var oReturn = {
                getText : getText,
                setText : setText,
                setPosition : setPosition,
                getEl : getEl
            };
    
            Object.defineProperties(oReturn, { 
                "text" : {
                    get() { return oReturn.getText(); },
                    set(value) { oReturn.setText(value); }
                    },
                "visible" : {
                    get() { return isVisible(); },
                    set(value) { setVisible(value); }
                    },
                "disabled" : {
                    get() { return el.disabled; },
                    set(value) { el.disabled = value; }
                    },
                "width" : {
                    get() { return getWidth(); },
                    set(value) { setWidth(value); }
                    },
                "height" : {
                    get() { return getHeight(); },
                    set(value) { setHeight(value); }
                    },
                "onclick" : {
                    get() { return el.onclick; },
                    set(value) { el.onclick = value; }
                    }
                });
    
            registerElement(oReturn);

            return oReturn;
        }
    }

    // ===============================================

    // Hides all HTML elements created by a scene
    // Function is intended to be used by showScene
    function hideElements(scene)
    {
        if (!scene || !scene.htmlElements)
            return;

        for(var owrapper of scene.htmlElements)
        {
            var o = owrapper.element;
            
            // store the visibility state of the element in the wrapper
            owrapper.visible = o.visible;

            o.visible = false;
        }
    }

    // Show all HTML elements of a scene
    // Function is intended to be used by showScene
    function showElements(scene)
    {
        if (!scene || !scene.htmlElements)
            return;

        for(var owrapper of scene.htmlElements)
        {
            var o = owrapper.element;
            
            // restore the visibility state of the element from info in the wrapper
            o.visible = owrapper.visible;
        }
    }

    // Removes all HTML elements created by a sketch
    // Function is intended to be used by resetSketch()
    function removeElements()
    {
        var canvas = window.canvas;
        var div = window.canvas.parentElement;

        // remove references from scenes collection
        var scenes = oSketch.getScenes();
        for(var scene of scenes)
        {
            if (scene.htmlElements)
                scene.htmlElements.length = 0;
        }

        // remove actual html elements
        for(var i = div.childNodes.length - 1; i >= 0; i--)
        {
            var el = div.childNodes[i];
            if (el !== canvas)
                div.removeChild(el);
        }
    }


    function registerElement(o)
    {
        var scene = oSketch.getCurrentScene();
        if (!scene)
            return;
    
        scene.htmlElements.push( { element : o, visible : true } );
    }


    

    return {
        createEdit : createEdit,
        createButton : createButton,
        showElements : showElements,
        hideElements : hideElements,
        removeElements : removeElements
    }
}
