var db = FirebaseDB(HandleAuthChanged);

var btnLogIn;
var btnLogOut;
var btnSignInOK;
var mnuUser;
var lblUser;
var lblUserWelcome;
var introBanner;
var btnShowTutorials;
var btnShowMySketches;
var btnCode;
var divPageTitle;

var divStaticTutorials;
var divMyTutorials;
var divMySketches;

window.onload = function()
{
    btnLogIn = document.getElementById("btnLogIn");
    btnLogOut = document.getElementById("btnLogOut");
    btnSignInOK = document.getElementById("btnSignInOK");
    mnuUser = document.getElementById("top-account");
    lblUser = document.getElementById("lblUser");
    lblUserWelcome = document.getElementById("lblUserWelcome");
    introBanner = document.getElementById("introBanner");
    btnShowTutorials = document.getElementById("btnShowTutorials");
    btnShowMySketches = document.getElementById("btnShowMySketches");
    btnCode = document.getElementById("btnCode");
    divPageTitle = document.getElementById("page-title");
    divStaticTutorials = document.getElementById("divStaticTutorials");
    divMyTutorials = document.getElementById("divMyTutorials");
    divMySketches = document.getElementById("divMySketches");
    
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

        var userName = db.getAccountName(user);
        
        lblUser.innerText = userName;
        lblUser.style.color = "";

        lblUserWelcome.innerText = "Welcome " + userName;

        divStaticTutorials.classList.add("d-none");
        divMyTutorials.classList.remove("d-none");

        db.getStudentDetails().then(function(userData) {
            userActive = userData && userData.active;
            lblUser.style.color = userActive ? "" : "red";
        });

        generateMyTutorials("divMyTutorials");
        generateMyCodeList("divMySketchesGrid");

        // if ( window.location.search.indexOf("what=code") != -1 )
        //     HandleBtnShowMySketchesClick();
    }
    else
    {
        btnLogIn.style.display = "block";
    
        btnSignUp.classList.add("d-md-block");

        mnuUser.style.display = "none";

        introBanner.style.display = "block";

        divPageTitle.style.display = "none";

        divStaticTutorials.classList.remove("d-none");
        divMyTutorials.classList.add("d-none");
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
        window.location.href = "index.html";
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
    divMySketches.classList.add("d-none");
    divMyTutorials.classList.remove("d-none");
} 


function HandleBtnShowMySketchesClick(e)
{
    divMySketches.classList.remove("d-none");
    divMyTutorials.classList.add("d-none");
}


function HandleBtnCodeClick(e)
{
    window.location.href = "code.html";
}


async function generateMyTutorials(divName)
{
    var r = await fetch("tutorials/index.json");
    var oTutorials = await r.json();

    generateMyTutorialsCategories("divMyTutorialsCategories", oTutorials);
    generateMyTutorialsList("divMyTutorialsList", oTutorials);  
}

function generateMyTutorialsCategories(ulName, oTutorials)
{
    if (!oTutorials || !oTutorials.Lists)
        return;
    
    var html = HtmlUtils();
    var objUl = document.getElementById(ulName);

    for(var i = 0; i < oTutorials.Lists.length; i++)
    {
        var it = oTutorials.Lists[i];
        var txt = `<li><a href="#" data-filter=".${it.Id}">${it.Name}</a></li>`;
        
        html.appendElement(txt, objUl);
    }

    SEMICOLON.portfolio.filterInit();
}

function generateMyTutorialsList(divName, oTutorials)
{
    if (!oTutorials || !oTutorials.Tutorials)
        return;
    
    var html = HtmlUtils();
    var objDiv = document.getElementById(divName);

    for(var oTutorial of oTutorials.Tutorials)
    {
        var free = oTutorial.Free && oTutorial.Free.toLowerCase() === "yes";
        var txtAccess = free ? `<li><i class="icon-unlocked"></i> Free</li>` : `<li><i class="icon-lock"></i> Members</li>`;
        var tutorialUrl = free ? `code.html?t=${oTutorial.Folder}` : `#`;

        var txtIds = oTutorial.Lists ? oTutorial.Lists.join(" ") : "";

        var txt = `<div class="entry ${txtIds} clearfix">
            <div class="entry-image">
                <img class="image_fade" src="tutorials/${oTutorial.Folder}/thumb.png" alt="${oTutorial.Name}">
            </div>
            <div class="entry-title">
                <h2><a href="${tutorialUrl}">${oTutorial.Name}</a></h2>
            </div>
            <ul class="entry-meta">
                <li><i class="icon-calendar3"></i> ${oTutorial.DateAdded}</li>
                ${txtAccess}
            </ul>
            <div class="clear"></div>
            <div class="entry-content">
                <p>${oTutorial.Description}</p>
                <a href="${tutorialUrl}" class="button">Start tutorial</a>
            </div>
        </div>`;

        html.appendElement(txt, objDiv);
    }
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
