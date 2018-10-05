// #SKETCHNAME Custom function
drawHouse(100, 100);
drawHouse(500, 100);

function drawHouse(x, y)
{
    let h = 100;

    rect(x - h / 2, y - h / 2, h, h);
    line(x - h / 2, y - h / 2, x, y - h /2 - h / 2);
    line(x, y - h / 2 - h / 2, x + h / 2, y - h / 2);
}
