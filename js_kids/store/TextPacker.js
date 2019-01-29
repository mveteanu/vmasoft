
function TextPacker()
{
    var sketchNameTag = "#SKETCHNAME";
    var fileDelimiter = "#BEGINSCENE";


    // ------------- Begin public functions ----------------

    // Returns a string from an an object with this structure:
    // { Name : "" , Files : [ { Name, Code }, ... ] }
    function pack(oProgram, comments)
    {
        var txt = comments ? "/*\n" + comments + "\n*/\n" : "";
        
        if (!oProgram)
            return txt;

        if (oProgram.Name)
        {
            txt += "// " + sketchNameTag + " " + oProgram.Name + "\n";
        }

        if (!oProgram.Files)
            return txt;

        for(var o of oProgram.Files)
        {
            var name = "// " + fileDelimiter + " " + o.Name + "\n";
            var file = name + o.Code;

            if (!file.endsWith("\n"))
                file += "\n";

            txt += file;
        }

        return txt;
    }


    // Returns from the specified text an object with this structure:
    // { Name : "", Files : [ {Name, Code}, ... ] }    
    function unpack(txt)
    {
        var o = getPackInfo(txt);
        if (!o)
            return null;

        // ... extract the files content as a new string (... need to optimize!)
        var filesText = txt.substr( o.FilesStart );

        var arFiles = unpackFiles(filesText);
        
        return {
            Name : o.Name,
            Files : arFiles
        }
    }


    // ----------------- Begin private functions ---------------

    // Returns an array of objects { Name, Code } from the specified text
    function unpackFiles(txt)
    {
        var arFiles = [];

        if (!txt)
            return arFiles;

        var ar = findFilesHeaders(txt);

        // If no file headers found inside, return the whole text as a file
        if (!ar || ar.length == 0)
        {
            arFiles.push( { Name : "Code", Code : txt } );
            return arFiles;
        }

        // If there is any non-empty text before the first header, add it as a file
        var precode = txt.substr(0, ar[0].From);
        if(!isWhiteSpace(precode))
        {
            arFiles.push( { Name : "Code", Code : precode } );
        }

        // Cycle through all file headers...
        var n = ar.length;
        for(var i = 0; i < n; i++)
        {
            var code;
            var currHeader = ar[i];

            if (i < n - 1)
            {
                var nextHeader = ar[i+1];
                code = txt.substr(currHeader.To + 1, nextHeader.From - currHeader.To - 1);
            }
            else
            {
                code = txt.substr(currHeader.To + 1);
            }

            code = trimLeftEnter(code);

            var o = {
                Name : currHeader.Name,
                Code : code
            }

            arFiles.push(o);
        }

        return arFiles;
    }


    // Returns an object with { Name, FilesStart }
    function getPackInfo(txt)
    {
        if (!txt)
            return null;

        var from = txt.indexOf(sketchNameTag);
        if ( from < 0 )
            return { Name : "", FilesStart : 0 };

        from += sketchNameTag.length;

        var to = findLineEnd(txt, from);

        var name = txt.substr(from, to - from + 1);

        return {
            Name : name.trim(),
            FilesStart : to + 1
        }
    }


    function trimLeftEnter(txt)
    {
        if (!txt)
            return txt;

        var delta = 0;

        if (txt.indexOf('\r\n') == 0)
            delta = 2;
        else if (txt.indexOf('\n') == 0)
            delta = 1;
        else if (txt.indexOf('\r') == 0)
            delta = 1;

        if (delta == 0)
            return txt;

        return txt.substr(delta, txt.length - delta);
    }


    // Determine if there are only white spaces before first sketch file
    function isWhiteSpace(txt)
    {
        if (!txt)
            return true;

        for(var i = 0; i < txt.length; i++)
        {
            var c = txt[i];

            if (c != ' ' && c != '\t' && c != '\r' && c != '\n')
                return false;
        }

        return true;
    }

    
    // Use this function instead of isWhiteSpace if sketch should accept comments in between sketch name and first sketch
    function isWhiteSpaceOrComments(txt)
    {
        if (!txt)
            return true;

        txt = txt.replace('\r\n', '\n');

        var lines = txt.split('\n');

        for(var i = 0; i < lines.length; i++)
        {
            var line = lines[i];
            if (!line)
                continue;

            line = line.trim();

            if (line.indexOf('//') == 0)
                continue;

            return false;
        }

        return true;
    }


    function findFilesHeaders(txt)
    {
        var ar = [];
        findDelimiters(txt, ar);

        for(var o of ar)
        {
            o.From = findLineStart(txt, o.From);
            
            var nameStart = o.To + 1;
            o.To = findLineEnd(txt, o.To);

            var name = txt.substr(nameStart, o.To - nameStart + 1);
            o.Name = name.trim();
        }

        return ar;
    }


    function findDelimiters(txt, ar)
    {
        if (!ar)
            return;

        var n = ar.length;
        var start = n > 0 ? ar[n - 1].To + 1 : 0;
        
        var from = txt.indexOf(fileDelimiter, start);
        if (from < 0)
            return;

        var to = from + fileDelimiter.length - 1;
        var o = { From : from, To : to }
        ar.push(o);

        findDelimiters(txt, ar);
    }


    function findLineEnd(txt, p)
    {
        var i = p + 1;
        var n = txt.length;

        while(i <= n - 1)
        {
            var c = txt[i];

            if (c == '\n' || c == '\r')
                break;

            i++;
        }

        return i - 1;
    }


    function findLineStart(txt, p)
    {
        var i = p - 1;

        while(i >= 0)
        {
            var c = txt[i];

            if (c == '\n' || c == '\r')
            {
                var s = txt.substr(i + 1, p - i);
                s = s.trim();

                if (s.indexOf("//") == 0)
                    break;
            }

            i--;
        }

        return i + 1;
    }


    return {
        pack : pack,
        unpack : unpack
    }

}
