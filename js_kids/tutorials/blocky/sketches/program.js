// #SKETCHNAME Blocky
const squareSize = 16;
const noRows = 30;
const noCols = 50;

displayGridPaper();

function loop()
{
    // Call to displayCell at mouse coordinates, only if mouse is pressed
    if (mouseIsPressed)
    {
        var color = mouseButton == LEFT ? "Black" : "White";
        displayCell(mouseX, mouseY, color);
    }
}

// Display the cell that contains the point (x, y)
function displayCell(x, y, color)
{
    var col = floor( x / squareSize );
    var row = floor( y / squareSize );

    if (col >= noCols || row >= noRows)
        return;

    // determine the cell left upper-corner x and y coordinates
    var cellX = col * squareSize;
    var cellY = row * squareSize;

    fill(color);
    rect(cellX, cellY, squareSize, squareSize);
}

// Display the grid paper using a series of white rectangles
function displayGridPaper()
{
    for(var row = 0; row < noRows; row++)
    {
        for(var col = 0; col < noCols; col++)
        {
            var x = col * squareSize;
            var y = row * squareSize;

            rect(x, y, squareSize, squareSize);
        }
    }
}
