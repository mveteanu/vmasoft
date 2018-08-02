/*
This is a single file sketch
with multiple scenes
*/

// #SKETCHNAME Amazing sketch - p5

// #BEGINSCENE Intro

var s = 'Intro';
text(s, 10, 10);

function mouseClicked()
{
    showScene("Game");
}

// #BEGINSCENE Game

circle(400, 300, 200);

function mouseClicked()
{
    showScene("Intro");
}
