
preload('A simple way', 'Gears of steel');

var myMusic = 'A simple way';
music(myMusic)

function mouseClicked()
{
    myMusic = myMusic == 'A simple way' ?
        'Gears of steel' :
        'A simple way';

    music(myMusic);
    
    clear();
    text(myMusic, 10, 10)
}
