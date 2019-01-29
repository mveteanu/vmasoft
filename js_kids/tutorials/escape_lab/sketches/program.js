// #SKETCHNAME Escape the lab
// #BEGINSCENE Code
const ui = require("UI");
const definitions = require("Definitions");

const bagSize = 2;

var world;
var bag;
var room;

function enter()
{
    ui.createUI();
    startGame();
}

function startGame()
{
    ui.clear();
    
    world = definitions.getWorld();
    bag = [];

    handleHelp();
    enterRoom("Living room");
}

function keyPressed()
{
    ui.checkCommand(handleInput);
}

function handleInput(s)
{
    if (!s)
        return;
        
    var ar = s.split(" ");
    if (ar.length === 0)
        return;

    ui.println("> " + s);

    var cmd = ar[0].toLowerCase();
    ar.shift();
    
    switch(cmd)
    {
        case "new":
            startGame();
            break;
        case "help":
            handleHelp();
            break;
        case "look":
            handleLook();
            break;
        case "go":
            handleGo(ar);
            break;
        case "pick":
            handlePick(ar);
            break;
        case "drop":
            handleDrop(ar);
            break;
        case "bag":
            handleBag();
            break;
    }
}

function handleHelp()
{
    ui.println("Welcome to 'Escape the lab' adventure game\n");
    ui.println("Available commands\n");
    ui.println("new             - Start a new game");
    ui.println("help            - Display this help information");
    ui.println("look            - Look in the room");
    ui.println("go direction    - Go in the specified direction. Read room description to understand where you can go.");
    ui.println("pick object     - Pick specified object from the room");
    ui.println("drop object     - Drop specified object from the bag");
    ui.println("bag             - Shows the content of the bag");
    
    ui.println("");
}

function handleGo(ar)
{
    if (ar.length === 0)
    {
        ui.println("Specify the direction you want to go!");
        return;
    }
    
    go(capitalize(ar[0]));
}

function handleLook()
{
    printRoom(room);
}

function handlePick(ar)
{
    if (ar.length === 0)
    {
        ui.println("Specify an object to pick!");
        return;
    }
    
    var what = ar.join(" ");

    var p = room.Objects ? room.Objects.indexOf(what) : -1;
    
    if (p < 0)
    {
        ui.println("Cannot find '" + what + "'");
        return;
    }
    
    if (bag.length >= bagSize)
    {
        ui.println("Bag full. Cannot pick '" + what + "'");
        return;
    }
    
    var object = room.Objects[p];
    bag.push(object);
    room.Objects.splice(p, 1);
    
    ui.println("You picked '" + object + "'");
}

function handleDrop(ar)
{
    if (ar.length === 0)
    {
        ui.println("Specify an object to drop!");
        return;
    }
    
    var what = ar.join(" ");

    var p = bag.indexOf(what);
    
    if (p < 0)
    {
        ui.println("You don't have '" + what + "'");
        return;
    }
    
    var object = bag[p];
    
    if (!room.Objects)
        room.Objects = [];
    
    room.Objects.push(object);
    
    bag.splice(p, 1);
    
    ui.println("You dropped '" + object + "'");
}

function handleBag()
{
    if (bag.length === 0)
    {
        ui.println("You don't have any objects in the bag");
        return;
    }
    
    ui.println("You have: " + bag.join(', '));
}

function go(direction)
{
    var newroom = room[direction];
    if (!newroom)
    {
        ui.println("Cannot go " + direction);
        return;
    }

    // check if there is a door that requires an object in that direction
    var key = room["Door" + direction];
    if (key && bag.indexOf(key) < 0)
    {
        ui.println("Cannot go " + direction + ". You need " + key);
        return;
    }

    enterRoom(newroom);
}

function enterRoom(roomName)
{
    var r = findRoom(roomName);
    if (!r)
    {
        ui.println("Cannot find room " + roomName);
        return;
    }
    
    room = r;

    printRoom(room);
    checkRoom(room);
}

function checkRoom(room)
{
    if (room.GameWin)
    {
        ui.println("You win!!! You found the exit.");
        ui.println("Type 'new' to begin a new game.");
        return;
    }
    
    var exits = getExits(room);
    if (exits.length === 0)
    {
        ui.println("You loose. You are trapped in a room with no exits.");
        ui.println("Type 'new' to begin a new game.");
        return;
    }
}

function printRoom(room)
{
    ui.println("You are in the " + room.Name);
    
    if (room.Description)
        ui.println(room.Description);
        
    printExits(room);
    printObjects(room);
    ui.println("");
}

function printExits(room)
{
    var exits = getExits(room);

    if (exits.length === 0)
    {
        //ui.println("There are no exists from " + room.Name);
        return;
    }
    
    if (exits.length === 1)
    {
        ui.println("There is a door on the " + exits[0] + " wall.");
        return;
    }
    
    var txt = "There are doors on " + exits.length + " walls: " + exits.join(", ");
    ui.println(txt);
}

function getExits(room)
{
    var exits = [];
    
    if (room.East)
        exits.push("East");
    
    if (room.West)
        exits.push("West");

    if (room.North)
        exits.push("North");

    if (room.South)
        exits.push("South");

    return exits;    
}

function printObjects(room)
{
    if (!room.Objects || room.Objects.length === 0)
        return;
    
    var txt = "In the room you can see: " + room.Objects.join(", ");
    ui.println(txt);
}

function exitRoom(roomName)
{
    
}

function findRoom(roomName)
{
    for(var r of world.rooms)
    {
        if (r.Name === roomName)
            return r;
    }
    
    return null;
}

function capitalize(s)
{
    if (!s || s.length === 0)
        return s;
        
    return s[0].toUpperCase() + s.substr(1).toLowerCase();
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
    text("Type here your command", 10, 565);
}

function clear()
{
    output.text = "";
}

function print(s)
{
    output.text += s;
}

function println(s)
{
    print(s + "\n");
}

function checkCommand(fnProcess)
{
    if (keyCode !== ENTER)
        return;
    
    var s = getInput();
    
    if (s.length > 0)
    {
        fnProcess(s);
        clearInput();
    }
}

function getInput()
{
    return input.text;
}

function clearInput()
{
    input.text = "";
}
// #BEGINSCENE Definitions
function getWorld()
{
    return {
        rooms : [
            {
                "Name" : "Living room",
                "Description": "Living room is a big noisy room. There are 3 people discussing on the couch.",
                "East" : "Kitchen",
                "West" : "Bedroom",
                "South" : "Lobby",
                "DoorWest" : "blue key"
            },
            {
                "Name" : "Kitchen",
                "West" : "Living room",
                "Objects" : ["blue key", "red key"]
            },
            {
                "Name" : "Bedroom",
                "East" : "Living room",
                "DoorEast" : "red key",
                "Objects" : ["house keys"]
            },
            {
                "Name" : "Lobby",
                "Description": "Lobby is a well lit room big windows and a door that leads to Outside.",
                "North" : "Living room",
                "South" : "Outside",
                "DoorSouth" : "house keys",
                "East" : "Basement"
            },
            {
                "Name" : "Basement",
            },
            {
                "Name" : "Outside",
                "GameWin" : true
            }
        ]
    };
}
