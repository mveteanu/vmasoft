// #BEGINSCENE Game
var noCols = 3;
var noRows = 3;

var boardX = 10;
var boardY = 10;
var squareSize = 100;

var board = [];
var noMoves = 0;


function enter()
{
    generateBoard();

    noMoves = 0;
}

function loop()
{
    clear();
    
    drawBoard();
    displayStats();
}

function mouseClicked()
{
    switchTiles();
    
    if (checkWin())
    {
        showScene("Win", noMoves);
    }
}

// debugging method...
function keyPressed()
{
    if (key.toUpperCase() === "X")
    {
        board = [1, 2, 3, 4, 5, 6, 7, 0, 8];
    }
}

function generateBoard()
{
    board = [];
    
    var n = noRows * noCols;
    for(var i = 0; i < n; i++)
    {
        board.push(i);
    }
    
    shuffleArray(board);
}


function drawBoard()
{
    for(var row = 0; row < noRows; row++)
    {
        for(var col = 0; col < noCols; col++)
        {
            var value = getTileValue(row, col);
            
            var x = boardX + col * squareSize;
            var y = boardY + row * squareSize;

            drawTile(x, y, value);
        }
    }
}

function drawTile(x, y, value)
{
    fill( value != 0 ? "tan" : "white" );
    stroke("black");
    strokeWeight(1);
    
    rect(x, y, squareSize, squareSize);
    
    if (value != 0)
    {
        push();
        textAlign(CENTER);
        textSize(24);
        noStroke();
        fill("black");
        text(value, x + squareSize / 2, y + squareSize / 2);
        pop();
    }
}

function getTileValue(row, col)
{
    var index = row * noCols + col;
    return board[index];
}

function setTileValue(row, col, value)
{
    var index = row * noCols + col;
    board[index] = value;
}

function findClickedTile(x, y)
{
    var col = Math.floor( (x - boardX) / squareSize );
    var row = Math.floor( (y - boardY) / squareSize );
    
    if (col < 0 || col >= noCols || row < 0 || row >= noRows )
    {
        return null;
    }
    
    return { row : row, col : col }
}

function findEmptyTile(row, col)
{
    // check left tile if exists
    if (col > 0)
    {
        if (getTileValue(row, col - 1) == 0)
            return { row : row, col : col - 1 };
    }
    
    // check right tile if exists
    if (col < noCols - 1)
    {
        if (getTileValue(row, col + 1) == 0)
            return { row : row, col : col + 1 };
        
    }
    
    // check up tile
    if (row > 0)
    {
        if (getTileValue(row - 1, col) == 0)
            return { row : row - 1, col : col };
    }
    
    // check down tile
    if (row < noRows - 1)
    {
        if (getTileValue(row + 1, col) == 0)
            return { row : row + 1, col : col };
    }

    return null;
}

function switchTiles()
{
    var tile = findClickedTile(mouseX, mouseY);
    if (!tile)
        return;
    
    var emptyTile = findEmptyTile(tile.row, tile.col);
    if (!emptyTile)
        return;
        
    var tileValue = getTileValue(tile.row, tile.col);
    setTileValue(emptyTile.row, emptyTile.col, tileValue);
    setTileValue(tile.row, tile.col, 0);
    
    noMoves++;
}

function checkWin()
{
    for(var i = 0; i < board.length - 1; i++)
    {
        if (board[i] != i + 1)
            return false;
    }
    
    return true;
}

function displayStats()
{
    fill(0);
    noStroke();
    text("Moves: " + noMoves, 10, height - 10);
}

function shuffleArray(ar)
{
    var n = ar.length;
    for(var i = 0; i < n; i++)
    {
        var i2 = getRandomIntInclusive(0, n - 1);
        var t = ar[i];
        ar[i] = ar[i2];
        ar[i2] = t;        
    }
}

function getRandomIntInclusive(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// #BEGINSCENE Win
function enter()
{
    clear();
    textAlign(CENTER);
    
    textSize(24);
    text("You win!", width / 2, 300);
    
    textSize(14);
    text("... in " + PublicVars.Arguments + " moves!", width / 2, 350 );
}

function mouseClicked()
{
    showScene("Game");
}
