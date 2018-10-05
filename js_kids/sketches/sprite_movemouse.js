var p = sprite('adventure_girl', 0.5);

function mouseMoved()
{
    p.x = mouseX;
    p.y = mouseY;
    p.show("run");
    
    setTimeout( showIdle, 500 );
}

function showIdle()
{
    p.show("idle");
}
