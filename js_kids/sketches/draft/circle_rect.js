// #SKETCHNAME Circle-Rect intersection
function loop()
{
    clear();
    
    stroke( intersects(mouseX, mouseY, 50, 100, 100, 200, 100) ? "red" : "black" );
    rect(100, 100, 200, 100);
    
    stroke('black')
    circle(mouseX, mouseY, 50);
}

// function intersects(xc, yc, rc, xr, yr, wr, hr)
// {
//     var px = max(xr, min(xc, xr + wr));
//     var py = max(yr, min(yc, yr + hr));
    
//     circle(px, py, 5);
//     line(px, py, xc, yc);
//     circle(xc, yc, 5);

//     return dist(px, py, xc, yc) < rc;
// }


function intersects(xc, yc, rc, xr, yr, wr, hr)
{
    var px = xc;
    var py = yc;
    
    if (xc > xr + wr)
        px = xr + wr;
        
    if (xc < xr)
        px = xr;
        
    if (yc > yr + hr)
        py = yr + hr;
        
    if (yc < yr)
        py = yr;
    
    circle(px, py, 5);
    line(px, py, xc, yc);
    circle(xc, yc, 5);

    return dist(px, py, xc, yc) < rc;
}
