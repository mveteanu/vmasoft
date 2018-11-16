// #SKETCHNAME Caesar cipher
var editPlain;
var editEncrypted;
var editKey;

createUI();

function createUI()
{
    background("LightBlue");
    fill(0);
    noStroke();
    
    text("Type here your plain or encryted message", 10, 20);
    editPlain = createEdit(10, 30, 780, 221);
    editPlain.onchange = encryptText;
    
    text("Encrypted / Decrypted message", 10, 280);
    editEncrypted = createEdit(10, 290, 780, 221);
    editEncrypted.readOnly = true;

    text("Key", 10, 550);
    editKey = createEdit(45, 535, 50);
    editKey.value = 13;
    editKey.onchange = encryptText;
    
    text("Exchange secret messages with your friends using the Caesar Cipher.", 10, 590);
}

function encryptText()
{
    var msg = editPlain.value.toUpperCase();
    var key = parseInt(editKey.value);

    editEncrypted.value = encrypt(msg, key);
}

// Function will implement Caesar Cipher to
// encrypt / decrypt the msg by shifting the letters
// of the message acording to the key
function encrypt(msg, key)
{
    var encMsg = "";

    for(var i = 0; i < msg.length; i++)
    {
        var code = msg.charCodeAt(i);

        // Encrypt only letters in 'A' ... 'Z' interval
        if (code >= 65 && code <= 65 + 26 - 1)
        {
            code -= 65;
            code = mod(code + key, 26);
            code += 65;
        }

        encMsg += String.fromCharCode(code);
    }

    return encMsg;
}


// Modulo function: n mod p
function mod(n, p)
{
    if ( n < 0 )
        n = p - Math.abs(n) % p;

    return n % p;
}
