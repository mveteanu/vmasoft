
const minNote = 0;
const maxNote = 9;
const circleRadius = 10;

var notes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var selectedi = 0;
var posLine = 0;

frameRate(30);

function loop()
{
    clear();
    drawGrid();
    drawNotes();
    
    drawLine();
    updateLine();
}

function keyPressed()
{
    var note = notes[selectedi];
    
    if (keyCode == LEFT_ARROW)
    {
        if (selectedi > 0)
            selectedi--;
    }
    else if (keyCode == RIGHT_ARROW)
    {
        if (selectedi < notes.length - 1)
            selectedi++;
    }
    else if (keyCode == UP_ARROW)
    {
        if (note < maxNote)
            notes[selectedi] = note + 1;
    }
    else if (keyCode == DOWN_ARROW)
    {
        if (note > minNote)
            notes[selectedi] = note - 1;
    }
}

function drawNotes()
{
    for(var i = 0; i < notes.length; i++)
    {
        drawNote(i);
    }
}

function drawGrid()
{
    for(var i = 0; i < notes.length; i++)
    {
        var posY = map(i, minNote, maxNote, height - 1, 0);
        line(0, posY, width, posY);
    }
}

function drawLine()
{
    line(posLine, 0, posLine, height);
}

function updateLine()
{
    posLine += 5;
    if (posLine > width)
        posLine = 0;
}

function drawNote(i)
{
    var note = notes[i];
    
    var posX = map(i, 0, notes.length - 1, 0, width - 1);
    var posY = map(note, minNote, maxNote, height - 1, 0);
    
    fill( dist(posX, posY, posLine, posY) < 10 ? "lime" : "white" );
    circle(posX, posY, circleRadius);
    
    if (selectedi == i)
    {
        noFill();
        circle(posX, posY, circleRadius + 3);
    }
    
    noFill();
    textAlign(CENTER);
    text(note, posX, posY + 2);
}
