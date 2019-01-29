var db;

window.onload = function()
{
    var btnRegister = document.getElementById("register-form-submit");
    btnRegister.onclick = HandleBtnRegisterOnClick;

    var btnLogin = document.getElementById("login-form-submit");
    btnLogin.onclick = HandleBtnLoginOnClick;

    db = FirebaseDB(HandleAuthChanged);
}

function HandleAuthChanged(user)
{
    if (user)
    {
    }
    else
    {
    }
}

function HandleBtnLoginOnClick()
{
    var userName = document.getElementById("login-form-username").value;
    var password = document.getElementById("login-form-password").value;

    if (!userName || !password)
        return false;

    db.signInStudent(userName, password)
        .then(function(acc){
            window.location.href = "index.html";
        })
        .catch(function(err){
            var msg = err ? err.message : "Error";
            showLoginError(msg);
        })

    return false;
}


function HandleBtnRegisterOnClick()
{
    var name = document.getElementById("register-form-name").value;
    var userName = document.getElementById("register-form-username").value;
    var password = document.getElementById("register-form-password").value;
    var retryPassword = document.getElementById("register-form-repassword").value;
    var email = document.getElementById("register-form-email").value;
    var emailParent = document.getElementById("register-form-email-parent").value;

    if (!validateForm(name, userName, password, retryPassword, email, emailParent))
        return false;

    db.createStudentAccount(userName, password, { parentEmail : emailParent, studentEmail : email })
            .then(function(acc) {
                window.location.href = "index.html";
            })
            .catch(function(err){
                if (err)
                {
                    var msg = err.code == "auth/email-already-in-use" ? "Username is already in use! Please choose a different username." : err.message;
                    showRegisterError(msg);
                }
            })

    return false;
}


function validateForm(name, userName, password, retryPassword, email, emailParent)
{
    if (!name)
    {
        showRegisterError("You need to enter your name!");
        return false;
    }

    if (!userName)
    {
        showRegisterError("You need to choose a user name!");
        return false;
    }

    if (!validateUserName(userName))
    {
        showRegisterError("Username " + userName + " is invalid or already taken.\nPlease choose a different user name." );
        return false;
    }

    if (!validatePassword(password))
    {
        showRegisterError("You need to choose at 6 characters long password.");
        return false;
    }

    if (password != retryPassword)
    {
        showRegisterError("The re-entered password doesn't match the initial password.");
        return false;
    }

    if (!validateEmail(email) && !validateEmail(emailParent))
    {
        showRegisterError("You need to specify a valid email address for yourself or your parent.");
        return false;
    }

    return true;
}

function validateUserName(userName)
{
    return userName;
}

function validatePassword(password)
{
    return password && password.length >= 6;
}

function validateEmail(email)
{
    if (!email)
        return false;

    var i1 = email.indexOf("@");
    if (i1 <= 0)
        return false;

    return email.indexOf(".", i1 + 1) > i1 + 1;
}

function showLoginError(err)
{
    showErrorDiv(err, "msgLoginError", "divLoginError");
    showErrorDiv("", "msgError", "divError");
}

function showRegisterError(err)
{
    showErrorDiv(err, "msgError", "divError");
    showErrorDiv("", "msgLoginError", "divLoginError");
}

function showErrorDiv(err, msgErrorId, divErrorId)
{
    var msgError = document.getElementById(msgErrorId);
    var divError = document.getElementById(divErrorId);
    
    if (err)
    {
        msgError.innerHTML = err;
        divError.classList.remove("d-none");
    }
    else
    {
        msgError.innerHTML = "";
        divError.classList.add("d-none");
    }
}
