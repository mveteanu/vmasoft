// #SKETCHNAME Console math
// #BEGINSCENE Code
const ui = require("UI");

var state; // menu, add, mult

var n1, n2, result;
var correctAnswers = 0;
var wrongAnswers = 0;

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
        
        if (s.length > 0)
        {
            handleInput(s);
            ui.clearInput();
        }
    }
}

function handleInput(s)
{
    switch(state)
    {
        case "menu":
            handleInput_menu(s);
            break;
        case "add":
            handleInput_calc(s);
            break;
        case "mult":
            handleInput_calc(s);
            break;
    }
}

function handleInput_menu(s)
{
    switch(s)
    {
        case "1":
            changeState("add");
            break;
        case "2":
            changeState("mult");
            break;
    }
}


function handleInput_calc(s)
{
    if (s === "menu")
    {
        changeState("menu");
        return;
    }
    
    validateAnswer(s);
}

function newQuestion()
{
    n1 = randomInt(1, 10);
    n2 = randomInt(1, 10);

    result = state === "add" ? n1 + n2 : n1 * n2;
}

function printQuestion()
{
    var sign = state === "add" ? " + " : " * ";
    ui.println("\n" + n1 + sign + n2 + " = ?");
}

function validateAnswer(s)
{
    if (s === "" || isNaN(s))
    {
        ui.println("Please enter a numeric value.");
        printQuestion();
        return;
    }
    
    var r = parseFloat(s);
    if ( r === result )
    {
        ui.println("Correct! " + r);
        correctAnswers++;
        
        newQuestion();
        printQuestion();
    }
    else
    {
        ui.println("Wrong answer. " + r);
        wrongAnswers++;
        
        printQuestion();
    }
}


function changeState(newState)
{
    exitState(state);
    
    state = newState;
    enterState(state);
}


function exitState(state)
{
    switch(state)
    {
        case "menu":
            break;
        case "add":
            ui.println("\nExiting addition.");
            ui.println("You gave " + correctAnswers + " correct answers and " + wrongAnswers + " wrong answers.");
            break;
        case "mult":
            ui.println("\nExiting multiplication.");
            ui.println("You gave " + correctAnswers + " correct answers and " + wrongAnswers + " wrong answers.");
            break;
    }
}

function enterState(state)
{
    switch(state)
    {
        case "menu":
            ui.println("\n================");
            ui.println("  Console math  ");
            ui.println("================");
            ui.println("\nSelect an activity\n");
            ui.println("1 - Addition");
            ui.println("2 - Multiplication");
            break;
        case "add":
            ui.println("\nStarting addition...");
            enterCalculation();
            break;
        case "mult":
            ui.println("\nStarting multiplication...");
            enterCalculation();
            break;
    }
}

function enterCalculation()
{
    ui.println("Enter the answer to the following questions.");
    ui.println("... or type 'menu' to return to main menu.");

    correctAnswers = 0;
    wrongAnswers = 0;

    newQuestion();
    printQuestion();
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
