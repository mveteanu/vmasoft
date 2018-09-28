// #SKETCHNAME Random texts
// based on: https://funprogramming.org/57-A-random-sentence-generator-writes-nonsense.html

var y;

var art = [
  "the", "my", "your", "our", "that", "this", "every", "one", "the only", "his", "her"
];

var adj = [
  "happy", "rotating", "red", "fast", "elastic", "smily", "unbelievable", "infinte", "surprising", 
  "mysterious", "glowing", "green", "blue", "tired", "hard", "soft", "transparent", "long", "short", 
  "excellent", "noisy", "silent", "rare", "normal", "typical", "living", "clean", "glamorous", 
  "fancy", "handsome", "lazy", "scary", "helpless", "skinny", "melodic", "silly", 
  "kind", "brave", "nice", "ancient", "modern", "young", "sweet", "wet", "cold", 
  "dry", "heavy", "industrial", "complex", "accurate", "awesome", "shiny", "cool", "glittering", 
  "fake", "unreal", "naked", "intelligent", "smart", "curious", "strange", "unique", "empty", 
  "gray", "saturated", "blurry"
];

var nou = [
  "forest", "tree", "flower", "sky", "grass", "mountain", "car", "computer", "man", "woman", "dog", 
  "elephant", "ant", "road", "butterfly", "phone", "grandma", "school", "bed", "mouse", 
  "keyboard", "bicycle", "spaghetti", "drink", "cat", "t-shirt", "carpet", "wall", "poster", 
  "airport", "bridge", "road", "river", "beach", "sculpture", "piano", "guitar", "fruit", 
  "banana", "apple", "strawberry", "rubber band", "saxophone", "window", "linux computer", 
  "skate board", "piece of paper", "photograph", "painting", "hat", "space", "fork", 
  "mission", "goal", "project", "tax", "wind mill", "light bulb", "microphone", 
  "cpu", "hard drive", "screwdriver"
];

var pre = [
  "under", "in front of", "above", "behind", "near", "following", "inside", "besides", 
  "unlike", "like", "beneath", "against", "into", "beyond", "considering", "without", 
  "with", "towards"
];

var ver = [
  "sings", "dances", "was dancing", "runs", "will run", "walks", 
  "flies", "moves", "moved", "will move", "glows", "glowed", "spins", "promised", 
  "hugs", "cheated", "waits", "is waiting", "is studying", "swims", 
  "travels", "traveled", "plays", "played", "enjoys", "will enjoy", 
  "illuminates", "arises", "eats", "drinks", "calculates", "kissed", "faded", "listens", 
  "navigated", "responds", "smiles", "will smile", "will succeed", 
  "is wondering", "is thinking", "is", "was", "will be", "might be", "was never"
];

function writeWord(words) 
{
    var word = random(words);
    textSize(random(60, 100));
    text(word, random(150, 250), y);
    
    y += 65;
}

function writeSentence() 
{
    y = 80;
    
    writeWord(art);
    writeWord(adj);
    writeWord(nou);
    
    writeWord(ver);
    writeWord(pre);
    
    writeWord(art);
    writeWord(adj);
    writeWord(nou);
}

function enter() 
{
    fill(0);
    noStroke();
    writeSentence();
    
    sprite('game', 90, 450)
}

function mousePressed() 
{
    clear();
    writeSentence();
}

