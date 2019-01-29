// #SKETCHNAME Console math
// #BEGINSCENE Code
var ui = require("UI");

var stateMenu = require("MainMenu");
var stateAdd = require("Addition");
var stateMult = require("Multiplication")

var currState;

function enter()
{
    ui.createUI();
    changeState("menu");
}

function keyPressed()
{
    if (keyCode === ENTER)
    {
        var s = ui.getInput();
        handleInput(s);
        ui.clearInput();
    }
}

function handleInput(s)
{
    if (currState)
        currState.handleInput(s);
}

function changeState(newState)
{
    var o = null;

    switch(newState)
    {
        case "menu":
            o = stateMenu;
            break;
        case "add":
            o = stateAdd;
            break;
        case "mult":
            o = stateMult;
            break;
    }
    
    if (o)
    {
        if (currState && currState.exit)
            currState.exit();
        
        currState = o;

        // engine is a reference to the object holding the current scene functions
        // engine is passed to the other states, so they can call functions such as changeState
        var engine = getScene();

        currState.enter( engine );
    }
}

function print(s)
{
    ui.println(s);
}
// #BEGINSCENE MainMenu
var engine;

function enter(_engine)
{
    engine = _engine;
    printMenu();
}

function handleInput(s)
{
    switch(s)
    {
        case "1":
            engine.changeState("add");
            break;
        case "2":
            engine.changeState("mult");
            break;
    }
}

function printMenu()
{
    engine.print("\nSelect an activity\n");    
    engine.print("1 - Addition");
    engine.print("2 - Multiplication");
}
// #BEGINSCENE Addition
var engine;

var n1;
var n2;

var correctAnswers = 0;
var wrongAnswers = 0;

function enter(_engine)
{
    engine = _engine;

    correctAnswers = 0;
    wrongAnswers = 0;
    printInstructions();
    
    askQuestion();
    printQuestion();
}

function handleInput(s)
{
    switch(s)
    {
        case "":
            printInstructions();
            printQuestion();
            break;
        case "menu":
            engine.changeState("menu");
            break;
        default:
            validateAnswer(s);
    }
}

function exit()
{
    engine.print("\nExiting addition. Summary:");    
    engine.print("Correct answers: " + correctAnswers);
    engine.print("Wrong answers: " + wrongAnswers);
}

function askQuestion()
{
    n1 = randomInt(1, 10);
    n2 = randomInt(1, 10);
}

function printQuestion()
{
    engine.print("\n" + n1 + " + " + n2 + " = ?");
}

function validateAnswer(s)
{
    var r = parseInt(s);
    
    if (n1 + n2 === r)
    {
        engine.print(r + " - Correct!");
        correctAnswers++;
        
        askQuestion();
    }
    else
    {
        engine.print(r + " - Wrong answer.");
        wrongAnswers++;
    }
    
    printQuestion();
}

function printInstructions()
{
    engine.print("\nStarting addition...");
    engine.print("Enter the answer to the following questions.");
    engine.print("... or type 'menu' to return to main menu.");
}
// #BEGINSCENE Multiplication
var engine;

var n1;
var n2;

var correctAnswers = 0;
var wrongAnswers = 0;

function enter(_engine)
{
    engine = _engine;

    correctAnswers = 0;
    wrongAnswers = 0;
    printInstructions();
    
    askQuestion();
    printQuestion();
}

function handleInput(s)
{
    switch(s)
    {
        case "":
            printInstructions();
            printQuestion();
            break;
        case "menu":
            engine.changeState("menu");
            break;
        default:
            validateAnswer(s);
    }
}

function exit()
{
    engine.print("\nExiting multiplication. Summary:");    
    engine.print("Correct answers: " + correctAnswers);
    engine.print("Wrong answers: " + wrongAnswers);
}

function askQuestion()
{
    n1 = randomInt(1, 10);
    n2 = randomInt(1, 10);
}

function printQuestion()
{
    engine.print("\n" + n1 + " * " + n2 + " = ?");
}

function validateAnswer(s)
{
    var r = parseInt(s);
    
    if (n1 * n2 === r)
    {
        engine.print(r + " - Correct!");
        correctAnswers++;
        
        askQuestion();
    }
    else
    {
        engine.print(r + " - Wrong answer.");
        wrongAnswers++;
    }
    
    printQuestion();
}

function printInstructions()
{
    engine.print("\nStarting multiplication...");
    engine.print("Enter the answer to the following questions.");
    engine.print("... or type 'menu' to return to main menu.");
}
// #BEGINSCENE UI
var input;
var output;

function createUI()
{
    output = createEdit(10, 10, 780, 535);
    output.readonly = true;
    
    input = createEdit(10, 570, 780);
    
    noStroke();
    fill(0);
    text("Type here your answer", 10, 565);
}

function println(s)
{
    output.text += s + "\n";    
}

function getInput()
{
    return input.text;
}

function clearInput()
{
    input.text = "";
}
