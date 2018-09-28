// #SKETCHNAME Custom function
drawHouse();
drawHouse();

function drawHouse()
{
    let x = 400;
    let y = 300;
    let h = 100;

    rect(x - h / 2, y - h / 2, h, h);
    line(x - h / 2, y - h / 2, x, y - h /2 - h / 2);
    line(x, y - h / 2 - h / 2, x + h / 2, y - h / 2);
}
