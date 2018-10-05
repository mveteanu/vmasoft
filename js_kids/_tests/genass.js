var ar = [

    "highDown.ogg", 
    "highUp.ogg", 
    "laser1.ogg", 
    "laser2.ogg", 
    "laser3.ogg", 
    "lowDown.ogg", 
    "lowRandom.ogg", 
    "lowThreeTone.ogg", 
    "pepSound1.ogg", 
    "pepSound2.ogg", 
    "pepSound3.ogg", 
    "pepSound4.ogg", 
    "pepSound5.ogg", 
    "phaseJump1.ogg", 
    "phaseJump2.ogg", 
    "phaseJump3.ogg", 
    "phaseJump4.ogg", 
    "phaseJump5.ogg", 
    "spaceTrash1.ogg", 
    "spaceTrash2.ogg", 
    "spaceTrash3.ogg", 
    "spaceTrash4.ogg", 
    "spaceTrash5.ogg", 
    "threeTone1.ogg", 
    "threeTone2.ogg", 
    "tone1.ogg", 
    "twoTone1.ogg", 
    "twoTone2.ogg", 
    "zap1.ogg", 
    "zap2.ogg", 
    "zapThreeToneDown.ogg", 
    "zapThreeToneUp.ogg", 
    "zapTwoTone.ogg", 
    "zapTwoTone2.ogg"

];


for (var i = 0; i < ar.length; i++)
{
    var file = ar[i];
    var name = file.substr(0, file.indexOf("."));

    var template = `    { 
        "Name" : "${name}", 
        "Tags" : ["effects"],
        "File" : "assets/sounds/effects/${file}"
    },`;

    console.log(template);
    
}

