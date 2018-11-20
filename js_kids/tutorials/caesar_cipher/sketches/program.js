// #SKETCHNAME Caesar cipher
var editPlain;
var editEncrypted;
var editPassword;

var btnEncrypt;
var btnDecrypt;

createUI();

function createUI()
{
    background("Lavender");
    fill(0);
    noStroke();

    text("Type here your plain or encryted message", 10, 20);
    editPlain = createEdit(10, 30, 780, 220);
    editPlain.text = "I LOVE CODING!";

    text("Password", 10, 285);
    editPassword = createEdit(80, 270, 150);
    editPassword.text = "secret";
    
    btnEncrypt = createButton(250, 265);
    btnEncrypt.text = "Encrypt";
    btnEncrypt.onclick = btnEncrypt_OnClick;

    btnDecrypt = createButton(390, 265);
    btnDecrypt.text = "Decrypt";
    btnDecrypt.onclick = btnDecrypt_OnClick;

    text("Encrypted / Decrypted message", 10, 330);
    editEncrypted = createEdit(10, 340, 781, 220);
    editEncrypted.readonly = true;

    text("Exchange secret messages with your friends by encrypting / decrypting them with the Caesar Cipher.", 10, 590);
}

function btnEncrypt_OnClick()
{
    var msg = editPlain.text.toUpperCase();
    var password = editPassword.text;
    
    var key = getKey(password);

    editEncrypted.text = encrypt(msg, key);
}

function btnDecrypt_OnClick()
{
    var msg = editPlain.text.toUpperCase();
    var password = editPassword.text;
    
    var key = getKey(password);

    editEncrypted.text = decrypt(msg, key);
}


// Obtain an encryption key by adding the codes of all the letters of the password
function getKey(password)
{
    var key = 0;
    
    if (!password)
        return key;
    
    for(var i = 0; i < password.length; i++)
    {
        var code = password.charCodeAt(i);
        key += code;
    }
    
    return key;
}

// Decrypt a message by using the same encrypt function
// ... but using the inverse of the key (e.g. rotate in the other direction)
function decrypt(msg, key)
{
    return encrypt(msg, key * -1);
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
