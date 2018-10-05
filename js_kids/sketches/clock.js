// #SKETCHNAME Analog clock
angleMode(DEGREES);

function loop()
{
    clear();

    displayDigitalClock();
    displayAnalogClock(width / 2, height / 2, 200);
}

function displayDigitalClock()
{
    var d = new Date();
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();

    var s = hour + ":" + min + ":" + sec;

    strokeWeight(1);
    text(s, 10, height - 10);
}

function displayAnalogClock(x, y, r)
{
    strokeWeight(1);
    ellipse(x, y, r * 2);
    displayClockNumbers(x, y, r * 0.9);
    
    var d = new Date();
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();

    displayClockHand(sec, 60, x, y, r * 0.9, 1);
    displayClockHand(min + map(sec, 0, 60, 0, 1), 60, x, y, r * 0.8, 3);
    displayClockHand(hour + map(min, 0, 60, 0, 1), 12, x, y, r * 0.7, 5);
}

function displayClockNumbers(x, y, r)
{
    for(var i = 0; i < 12; i++)
    {
        var ai = map(i, 0, 12, 0, 360);

        ai -= 90; // rotate the reference system

        var xi = x + r * cos(ai);
        var yi = y + r * sin(ai);

        text(i, xi, yi);
    }
}

function displayClockHand(v, maxInterval, x, y, size, weight)
{
    var angle = map(v, 0, maxInterval, 0, 360);

    angle -= 90; // rotate the reference system

    var x2 = x + size * cos(angle);
    var y2 = y + size * sin(angle);

    strokeWeight(weight);
    line(x, y, x2, y2);
}
