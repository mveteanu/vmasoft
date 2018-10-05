// #SKETCHNAME X and 0
var boardX = 10;
var boardY = 10;
var squareSize = 100;

var board = [];
var userTurn = true;

var status = 0; // 0 = game, 1 = user win, 2 = computer win, 3 = tie

var userWins = 0;
var computerWins = 0;
var gameTies = 0;

var winCombo = [
        [ [0, 0], [0, 1], [0, 2] ],
        [ [1, 0], [1, 1], [1, 2] ],
        [ [2, 0], [2, 1], [2, 2] ],

        [ [0, 0], [1, 0], [2, 0] ],
        [ [0, 1], [1, 1], [2, 1] ],
        [ [0, 2], [1, 2], [2, 2] ],
        
        [ [0, 0], [1, 1], [2, 2] ],
        [ [0, 2], [1, 1], [2, 0] ]
    ];

initGame();

function initGame()
{
    board = new Array(9);
    userTurn = true;
    status = 0;
}

function loop()
{
    clear();

    drawBoard();
    displayScore();
    
    checkWin();
    place0();
}

function mouseClicked()
{
    placeX();
    
    if (status != 0)
    {
        initGame();
    }
}

function displayScore()
{
    push();
    
    fill(0);
    noStroke();
    
    text("User wins: " + userWins, boardX, boardY + squareSize * 3 + 30 );
    text("Computer wins: " + computerWins, boardX, boardY + squareSize * 3 + 50 );
    text("Game ties: " + gameTies, boardX, boardY + squareSize * 3 + 70 );
    
    var msg = "";
    if (status == 1)
        msg = "You win";
    else if (status == 2)
        msg = "Computer wins";
    else if (status == 3)
        msg = "Tie";
    
    fill("red");
    text(msg, boardX, boardY + squareSize * 3 + 100);
    
    pop();
}


function checkWin()
{
    if (status != 0)
        return;
    
    var value = findWinner();
    if (!value)
        return;
    
    if (value == "x")
    {
        status = 1;
        userWins++;
    }
    else if (value == "0")
    {
        status = 2;
        computerWins++;
    }
    else
    {
        status = 3;
        gameTies++;
    }
}

function placeX()
{
    if (status != 0 || !userTurn)
        return;
    
    var o = findClickedTile(mouseX, mouseY);
    if (!o)
        return;
        
    var value = getTileValue(o.row, o.col);
    if (value)
        return;
    
    setTileValue(o.row, o.col, "x");
    
    userTurn = false;
}

function place0()
{
    if (status != 0 || userTurn)
        return;

    var combo = findCombo("0", 2);
    
    if (combo == -1)
        combo = findCombo("x", 2);

    if (combo == -1)
        combo = findCombo("0", random([0, 1]));

    var tile = findEmptyTile(combo);
    if (!tile)
        return;
        
    setTileValue(tile.row, tile.col, "0");
        
    userTurn = true;
}

function findWinner()
{
    var hasSpace = false;
    
    for(var combo = 0; combo < winCombo.length; combo++)
    {
        var ar = winCombo[combo];
     
        var x = 0;
        var o = 0;
        
        for(var i = 0; i < ar.length; i++)
        {
            var el = ar[i];
            
            var row = el[0];
            var col = el[1];
            
            var value = getTileValue(row, col);

            if (value == "x")
                x++;
            else if (value == "0")
                o++;
            else if (!value)
                hasSpace = true;
        }
        
        if (x == 3)
            return "x";
        else if (o == 3)
            return "0";
    }

    return hasSpace ? null : "x0";
}

function findEmptyTile(combo)
{
    if (combo == -1)
        return null;
    
    var ar = winCombo[combo];
    
    for(var i = 0; i < ar.length; i++)
    {
        var el = ar[i];
        
        var row = el[0];
        var col = el[1];
        
        if (!getTileValue(row, col))
            return { row : row, col : col };
    }
    
    return null;
}

function findCombo(symbol, noSymbols)
{
    for(var combo = 0; combo < winCombo.length; combo++)
    {
        var ar = winCombo[combo];
        var found = 0;
        var hasSpace = false;
        
        for(var i = 0; i < ar.length; i++)
        {
            var el = ar[i];
            
            var row = el[0];
            var col = el[1];
            
            var value = getTileValue(row, col);
            
            if (!value)
                hasSpace = true;
            
            if (value == symbol)
                found++;
        }
        
        if (hasSpace && found == noSymbols)
            return combo;
    }
    
    return -1;
}


function getTileValue(row, col)
{
    var index = row * 3 + col;
    return board[index];
}

function setTileValue(row, col, value)
{
    var index = row * 3 + col;
    board[index] = value;
}

function drawBoard()
{
    for(var row = 0; row < 3; row++)    
    {
        for(var col = 0; col < 3; col++)
        {
            var x = boardX + col * squareSize;
            var y = boardY + row * squareSize;
            
            var value = getTileValue(row, col);
            
            drawTile(x, y, value);
        }
    }
}

function drawTile(x, y, value)
{
    stroke("black");
    strokeWeight(1);
    
    rect(x, y, squareSize, squareSize);
    
    if (value)
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



function findClickedTile(x, y)
{
    var col = Math.floor( (x - boardX) / squareSize );
    var row = Math.floor( (y - boardY) / squareSize );
    
    if (col < 0 || col >= 3 || row < 0 || row >= 3 )
    {
        return null;
    }
    
    return { row : row, col : col }
}
