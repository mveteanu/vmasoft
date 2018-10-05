var db;
var jsonTutorials = fetch("tutorials/index.json");
var lstMyFiles;

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
    
    btnLogOut.addEventListener("click", HandleBtnLogOutClick);
    btnSignInOK.addEventListener("click", HandleBtnSignInOKClick);

    if (btnShowTutorials)
        btnShowTutorials.addEventListener("click", HandleBtnShowTutorialsClick);

    if (btnShowMySketches)
        btnShowMySketches.addEventListener("click", HandleBtnShowMySketchesClick);

    if (btnCode)
        btnCode.addEventListener("click", HandleBtnCodeClick);

    db = FirebaseDB(HandleAuthChanged);
}

function HandleAuthChanged(user)
{
    UpdateHeaders(user);
    UpdateMainPage(user);
}

function UpdateHeaders(user)
{
    if (user)
    {
        btnLogIn.style.display = "none";
        btnSignUp.classList.remove("d-md-block");
        mnuUser.style.display = "block";

        lblUser.innerText = db.getAccountName(user);
        lblUser.style.color = "";

        db.getStudentDetails().then(function(userData) {
            userActive = userData && userData.active;
            lblUser.style.color = userActive ? "" : "red";
        });
    }
    else
    {
        btnLogIn.style.display = "block";
        btnSignUp.classList.add("d-md-block");
        mnuUser.style.display = "none";
    }
}

function UpdateMainPage(user)
{
    if (!introBanner)
        return;
    
    if (user)
    {
        introBanner.style.display = "none";
        divPageTitle.style.display = "block";
        lblUserWelcome.innerText = "Welcome " + db.getAccountName(user);

        divStaticTutorials.classList.add("d-none");
        divMyTutorials.classList.remove("d-none");

        lstMyFiles = db.getMyFiles();

        if ( window.location.search.indexOf("what=code") != -1 )
            HandleBtnShowMySketchesClick();
        else
            HandleBtnShowTutorialsClick();
    }
    else
    {
        introBanner.style.display = "block";
        divPageTitle.style.display = "none";
        divStaticTutorials.classList.remove("d-none");
        divMyTutorials.classList.add("d-none");
    }
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
        //window.location.href = "index.html";
    }
    catch(error)
    {
        var errorCode = error.code;
        var errorMessage = error.message;
        
        var lblLoginMessage = document.getElementById("lblLoginMessage");
        lblLoginMessage.innerHTML = errorMessage;
        lblLoginMessage.classList.remove("d-none");
    }
}

function HandleBtnShowTutorialsClick(e)
{
    divMySketches.classList.add("d-none");
    divMyTutorials.classList.remove("d-none");

    var divMyTutorialsList = document.getElementById("divMyTutorialsList");
    if (divMyTutorialsList.children.length == 0)
        generateMyTutorials("divMyTutorials");
} 


function HandleBtnShowMySketchesClick(e)
{
    divMySketches.classList.remove("d-none");
    divMyTutorials.classList.add("d-none");

    var divMySketchesGrid = document.getElementById("divMySketchesGrid");
    if (divMySketchesGrid.children.length == 0)
        generateMyCodeList("divMySketchesGrid");    
}


function HandleBtnCodeClick(e)
{
    window.location.href = "code.html";
}


async function generateMyTutorials(divName)
{
    var r = await jsonTutorials;
    var oTutorials = await r.json();

    generateMyTutorialsCategories("divMyTutorialsCategories", oTutorials);
    generateMyTutorialsList("divMyTutorialsList", oTutorials);

    recalculateControls();
}


function generateMyTutorialsCategories(ulName, oTutorials)
{
    if (!oTutorials || !oTutorials.Lists)
        return;
    
    var txt = "";
    var objUl = document.getElementById(ulName);

    for(var i = 0; i < oTutorials.Lists.length; i++)
    {
        var it = oTutorials.Lists[i];
        var txtElement = `<li><a href="#" data-filter=".${it.Id}">${it.Name}</a></li>`;
        
        txt += txtElement + "\n";
    }

    objUl.innerHTML += txt;
}


function generateMyTutorialsList(divName, oTutorials)
{
    if (!oTutorials || !oTutorials.Tutorials)
        return;
    
    var objDiv = document.getElementById(divName);
    var txt = "";

    for(var oTutorial of oTutorials.Tutorials)
    {
        var free = !oTutorial.Free || oTutorial.Free.toLowerCase() === "yes";
        var txtAccess = free ? `<li><i class="icon-unlocked"></i> Free</li>` : `<li><i class="icon-lock"></i> Members</li>`;
        var tutorialUrl = free ? `code.html?t=${oTutorial.Folder}` : `#`;

        var txtIds = oTutorial.Lists ? oTutorial.Lists.join(" ") : "";

        var txtElement = `<div class="entry ${txtIds} clearfix">
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

        txt += txtElement + "\n";
    }

    objDiv.outerHTML = `<div id="divMyTutorialsList" class="post-grid grid-container grid-3 clearfix" data-layout="fitRows">` + txt + "</div>";
}


async function generateMyCodeList(divName)
{
    var objDiv = document.getElementById(divName);

    var txt = "";

    var lst = await lstMyFiles;

    for(var file of lst)
    {
        var d = new Date(file.creationDate);

        /*
        var txtElement = `<article class="portfolio-item">
            <div class="portfolio-desc">
                <h3><a href="code.html?${file.id}">${file.name}</a></h3>
                <span><i class="icon-calendar2"></i> ${d.toDateString() + " " + d.toLocaleTimeString()}</span>
            </div>
            <div class="portfolio-overlay">
                <a href="code.html?${file.id}" class="left-icon"><i class="icon-edit"></i></a>
                <a href="#" class="right-icon"><i class="icon-remove"></i></a>
            </div>
        </article>`;
        */

        var txtElement = `<article class="portfolio-item">
            <div class="portfolio-desc">
                <h3><a href="code.html?${file.id}">${file.name}</a></h3>
                <span><i class="icon-calendar2"></i> ${d.toDateString() + " " + d.toLocaleTimeString()}</span>
            </div>
            <div class="portfolio-overlay">
                <a href="code.html?${file.id}" class="left-icon"><i class="icon-edit"></i></a>
            </div>
        </article>`;


        txt += txtElement + "\n";
    }

    objDiv.innerHTML = txt;
}


// Aparently I have to re-init some controls when I manipulate them dynamically...
function recalculateControls()
{
    var $gridContainer = $('.grid-container');
    SEMICOLON.portfolio.gridInit( $gridContainer );
    SEMICOLON.portfolio.filterInit();
    SEMICOLON.portfolio.shuffleInit();
    SEMICOLON.portfolio.arrange();
    SEMICOLON.portfolio.portfolioDescMargin();
}

