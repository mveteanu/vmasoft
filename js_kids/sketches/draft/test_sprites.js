// #SKETCHNAME Test sprites
// #BEGINSCENE Santa
var animations = ["idle", "walk", "run", "jump", "slide"];
var curr = 0;

var p = sprite("santa");
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    p.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
// #BEGINSCENE Knight
var animations = ["idle", "walk", "run", "jump", "jumpattack", "attack", "dead"];
var curr = 0;

var p = sprite("knight");
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    p.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
// #BEGINSCENE Girl
var animations = ["idle", "jump", "run", "slide", "shoot", "melee", "dead"];
var curr = 0;

var p = sprite("adventure_girl");
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    p.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
// #BEGINSCENE Cute girl
background("Pink")
var animations = ["idle", "walk", "run", "jump", "dead"];
var curr = 0;

var p = sprite("cute_girl");
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    p.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
// #BEGINSCENE Ninja
var animations = ["idle", "run", "jump", "jumpattack", "jumpthrow", "slide", "throw", "attack", "climb", "glide", "dead"];
var curr = 0;

var p = sprite("ninja");
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    p.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
// #BEGINSCENE Dino
var animations = ["idle", "walk", "run", "jump", "dead"];
var curr = 0;

var dino = sprite("dino");
dino.scale = 0.5;
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    dino.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
// #BEGINSCENE Cat
var animations = ["idle", "walk", "run", "jump", "slide", "hurt", "fall", "dead"];
var curr = 0;

var p = sprite("cat");
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    p.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
// #BEGINSCENE Dog
var animations = ["idle", "walk", "run", "jump", "slide", "hurt", "fall", "dead"];
var curr = 0;

var p = sprite("dog");
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    p.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
// #BEGINSCENE Plane
var animations = ["fly", "shoot", "crash"];
var curr = 0;
background("lightblue");

var p = sprite("plane");
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    p.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
// #BEGINSCENE Game
var animations = ["idle", "walk", "climb", "duck", "happy"];
var curr = 0;

var p = sprite("game");
text(animations[curr], 10, 10);

function mouseClicked()
{
    
    curr = (curr + 1) % animations.length;
    p.show( animations[curr] );
    
    clear();
    text(animations[curr], 10, 10);
}
