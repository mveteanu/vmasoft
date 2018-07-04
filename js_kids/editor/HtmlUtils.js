function HtmlUtils()
{
    function appendElement(txt, container)
    {
        var o = document.createElement("div");
        o.innerHTML = txt;

        var element = o.children[0];
        container.append(element);

        return element;
    }
    
    function findFirstElement(className, container)
    {
        var o = container ? container : document;
        var ar = o.getElementsByClassName(className);
        if (!ar || ar.length == 0)
            return null;

        return ar[0];
    }

    function findFirstElementByAttrib(container, attrName, attrValue)
    {
        var o = container ? container : document;

        for(var i = 0; i < o.children.length; i++)
        {
            var currElement = o.children[i];
            if (currElement && currElement.getAttribute(attrName) == attrValue )
                return currElement;
        }

        return null;
    }

    function findFirstTag(tagName, container)
    {
        var o = container ? container : document;
        var ar = o.getElementsByTagName(tagName);
        if (!ar || ar.length == 0)
            return null;

        return ar[0];
    }

    function findElements(className, container)
    {
        var o = container ? container : document;
        return o.getElementsByClassName(className);
    }

    function findElement(id)
    {
        return document.getElementById(id);
    }


    function showElement(oElement, bShow)
    {
        if (!oElement)
            return;

        oElement.style.display = bShow ? "inherit" : "none";
    }
    

    function isDivVisible(oDiv)
    {
        if(!oDiv)
            return false;

        //return oDiv.style.display == "block";
        return oDiv.offsetHeight > 0;
    }


    // From: https://stackoverflow.com/questions/1480133/how-can-i-get-an-objects-absolute-position-on-the-page-in-javascript
    function cumulativeOffset(element) {
        var top = 0, left = 0;
        do {
            top += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while(element);

        return {
            top: top,
            left: left
        }
    }

    function findAncestor(el, elParent, maxLevels)
    {
        if ( el == null || elParent == null || maxLevels == 0 )
            return null;

        if (el.parentElement == elParent)
            return el;

        return findAncestor(el.parentElement, elParent, maxLevels - 1);
    }
    

    function isScreenSmall()
    {
        return window.innerWidth <= minWidth;
    }

    return {
        appendElement : appendElement,
        findFirstElement : findFirstElement,
        findElement : findElement,
        findElements : findElements,
        findFirstTag : findFirstTag,
        findFirstElementByAttrib : findFirstElementByAttrib,
        showElement : showElement,
        isDivVisible : isDivVisible,
        cumulativeOffset : cumulativeOffset,
        findAncestor : findAncestor,
        isScreenSmall : isScreenSmall
    }
}
