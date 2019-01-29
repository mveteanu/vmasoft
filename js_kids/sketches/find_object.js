// #SKETCHNAME Computer finds object
var quiz = {
    q1 : {
        text : "Is it a plant?",
        yes : "a1",
        no : "q2"
    },
    q2 : {
        text : "Lives under water?",
        yes : "a3",
        no : "a2"
    },
    a1 : {
        text : "Tree"
    },
    a2 : {
        text : "Cow"
    },
    a3 : {
        text : "Fish"
    }
}

var firstStep = "q1";
var currStep = "";
var buttons = [];

enterStep(currStep);

function loop()
{
    clear();

    display();    
}

function display()
{
    switch(getState(currStep))
    {
        case 0:
            displayInstructions();
            break;
        case 1:
            displayQuestion();
            break;
        case 2:
            displayAnswer();
            break;
    }
    
    displayButtons();
}

function mouseClicked()
{
    for(var btn of buttons)
    {
        if (hitButton(btn))
        {
            currStep = btn.nextStep;
            enterStep(currStep);
            return;
        }
    }
}

function enterStep(step)
{
    buttons = [];
    
    switch(getState(step))
    {
        case 0:
            addButton("Start", 350, 500, firstStep);
            break;
        case 1:
            addButton("Yes", 100, 500, quiz[step].yes);
            addButton("No", 600, 500, quiz[step].no);
            break;
        case 2:
            addButton("Retry", 350, 500, "");
            break;
    }
}

function addButton(text, x, y, nextStep)
{
    var btn = {text : text, x : x, y : y, w : 100, h : 30, nextStep : nextStep};
    buttons.push(btn);
}

function displayButtons()
{
    for(var btn of buttons)
        displayButton(btn);
}

function displayInstructions()
{
    var x = width / 2;

    var ar = getAnswers();
    
    push();
    textAlign(CENTER, CENTER);
    fill(0);
    noStroke();
    
    textSize(30);
    text("Pick an object from the following list:", x, 250);
    
    textSize(20);
    text(ar.join(), x, 350);

    pop();
}

function getAnswers()
{
    var ar = [];
    
    var keys = Object.keys(quiz);
    
    for(var k of keys)
    {
        if (!isQuestion(k))
        {
            ar.push(quiz[k].text);
        }
    }
    
    return ar;
}

function displayQuestion()
{
    push();
    textAlign(CENTER, CENTER);
    textSize(50);
    noStroke();
    fill("Black");
    
    text( quiz[currStep].text, width / 2, height / 2 );
    
    pop();
}


function displayAnswer()
{
    push();
    textAlign(CENTER, CENTER);
    noStroke();

    textSize(30);
    fill("Black");
    text( "You probably picked:", width / 2, 230 );
    
    textSize(50);
    fill("Navy");
    text( quiz[currStep].text, width / 2, 320 );
    
    pop();
}


function displayButton(btn)
{
    push();
    fill(hitButton(btn) ? "WhiteSmoke" : "White");
    rect(btn.x, btn.y, btn.w, btn.h);
    
    noStroke();
    fill("Black");
    textAlign(CENTER, CENTER);
    text(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
    pop();
}

function hitButton(btn)
{
    return collisionPointRect(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h);
}

function isQuestion(step)
{
    var o = quiz[step];
    return o.yes && o.no;
}

// 0 = instructions, 1 = question, 2 = answer
function getState(step)
{
    if (!step)
        return 0;
        
    return isQuestion(step) ? 1 : 2;
}
