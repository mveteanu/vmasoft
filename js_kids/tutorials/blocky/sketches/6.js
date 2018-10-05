const squareSize = 16;
const noRows = 30;
const noCols = 50;

displayGridPaper();

function mousePressed()
{
    var col = Math.floor( mouseX / squareSize );
    var row = Math.floor( mouseY / squareSize );

    var x = col * squareSize;
    var y = row * squareSize;

    fill('Black');
    rect(x, y, squareSize, squareSize);
}

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
