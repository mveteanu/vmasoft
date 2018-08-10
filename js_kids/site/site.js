var db = FirebaseDB(HandleAuthChanged);

var btnLogIn;
var btnLogOut;
var btnSignInOK;
var mnuUser;
var lblUser;
var introBanner;
var btnShowTutorials;
var btnShowMySketches;
var btnCode;
var divPageTitle;

window.onload = function()
{
    btnLogIn = document.getElementById("btnLogIn");
    btnLogOut = document.getElementById("btnLogOut");
    btnSignInOK = document.getElementById("btnSignInOK");
    mnuUser = document.getElementById("top-account");
    lblUser = document.getElementById("lblUser");
    introBanner = document.getElementById("introBanner");
    btnShowTutorials = document.getElementById("btnShowTutorials");
    btnShowMySketches = document.getElementById("btnShowMySketches");
    btnCode = document.getElementById("btnCode");
    divPageTitle = document.getElementById("page-title");
    
    btnLogIn.addEventListener("click", HandleBtnLoginClick);
    btnLogOut.addEventListener("click", HandleBtnLogOutClick);
    btnSignInOK.addEventListener("click", HandleBtnSignInOKClick);
    btnShowTutorials.addEventListener("click", HandleBtnShowTutorialsClick);
    btnShowMySketches.addEventListener("click", HandleBtnShowMySketchesClick);
    btnCode.addEventListener("click", HandleBtnCodeClick);
}



function HandleAuthChanged(user)
{
    if (user)
    {
        btnLogIn.style.display = "none";
        btnSignUp.classList.remove("d-md-block");
        mnuUser.style.display = "block";
        introBanner.style.display = "none";
        divPageTitle.style.display = "block";

        lblUser.innerText = db.getAccountName(user);
        lblUser.style.color = "";

        db.getStudentDetails().then(function(userData) {
            userActive = userData && userData.active;
            lblUser.style.color = userActive ? "" : "red";
        });

        generateMyCodeList("divMySketchesGrid");

        if ( window.location.search.indexOf("what=code") != -1 )
            HandleBtnShowMySketchesClick();
    }
    else
    {
        btnLogIn.style.display = "block";
        btnSignUp.classList.add("d-md-block");
        mnuUser.style.display = "none";
        introBanner.style.display = "block";
        divPageTitle.style.display = "none";
    }
}


function HandleBtnLoginClick(e)
{
    
}

async function HandleBtnLogOutClick(e)
{
    await db.signOut();
    location.reload();
}


async function HandleBtnSignInOKClick(e)
{
    try
    {
        var txtUser = document.getElementById("txtUser");
        var txtPassword = document.getElementById("txtPassword");

        var userName = txtUser.value;
        var password = txtPassword.value;

        if (!userName || !password)
            return;

        await db.signInStudent(userName, password);
        
        $.magnificPopup.close();
    }
    catch(error)
    {
        var errorCode = error.code;
        var errorMessage = error.message;

        alert(errorMessage);
    }
}

function HandleBtnShowTutorialsClick(e)
{
    var divMySketches = document.getElementById("divMySketches");
    var divTutorials = document.getElementById("divTutorials");

    divMySketches.style.display = "none";
    divTutorials.style.display = "block";
} 


function HandleBtnShowMySketchesClick(e)
{
    var divMySketches = document.getElementById("divMySketches");
    var divTutorials = document.getElementById("divTutorials");

    divMySketches.style.display = "block";
    divTutorials.style.display = "none";
}


function HandleBtnCodeClick(e)
{
    window.location.href = "code.html";
}


async function generateMyCodeList(divName)
{
    var html = HtmlUtils();
    var objDiv = document.getElementById(divName);

    var lst = await db.getMyFiles();

    for(var file of lst)
    {
        var d = new Date(file.creationDate);

        var txt = `<article class="portfolio-item">
            <div class="portfolio-desc">
                <h3><a href="code.html?${file.id}">${file.name}</a></h3>
                <span><i class="icon-calendar2"></i> ${d.toDateString() + " " + d.toLocaleTimeString()}</span>
            </div>
            <div class="portfolio-overlay">
                <a href="code.html?${file.id}" class="left-icon"><i class="icon-edit"></i></a>
                <a href="#" class="right-icon"><i class="icon-remove"></i></a>
            </div>
        </article>`;

        html.appendElement(txt, objDiv);
    }
}
