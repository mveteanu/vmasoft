
const UserStatus = {
    Unauthenticated : 0,
    AuthenticatedNotValidated : 1,
    Authenticated : 2
}

function FirebaseDB(onAuthenticateChanged)
{
    var config = {
        apiKey: "AIzaSyALrqh3AyjCiQT899oR4y7XUs7ue_nC6Ss",
        authDomain: "vmatests.firebaseapp.com",
        databaseURL: "https://vmatests.firebaseio.com",
        projectId: "vmatests",
        storageBucket: "vmatests.appspot.com",
        messagingSenderId: "469178435607"
    };

    var studentAccountDomain = "@codebeanz.com";

    firebase.initializeApp(config);
    var db = firebase.firestore();
    db.settings({timestampsInSnapshots: true})
    var storage = firebase.storage();
    firebase.auth().onAuthStateChanged(onAuthenticateChanged);
    

    // [awaitable] Returns an object with extra details about user
    function getStudentDetails()
    {
        var user = firebase.auth().currentUser;

        if (!user || !user.email)
            return null;
     
        var userRef = db.collection("users").doc(user.email);
        return userRef.get()
            .then(function(doc){
                if (doc.exists)
                {
                    var userData = doc.data(); 
                    return userData;
                }
            });
    }

    // [awaitable] Creates a student account
    function createStudentAccount(user, password, info)
    {
        var email = user + studentAccountDomain;

        return createUserAccount(email, password)
            .then(function() {
                var userRef = db.collection('users').doc(email);
                return userRef.set({
                    email : email,
                    studentEmail : info.studentEmail,
                    parentEmail : info.parentEmail,
                    active : false
                })
            });
    }

    // [awaitable] Creates a parent / teacher account
    function createUserAccount(email, password)
    {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    // [awaitable] Signs in student
    function signInStudent(user, password)
    {
        var email = user + studentAccountDomain;
        return signInUser(email, password);
    }

    // [awaitable] Signs in parent / teacher
    function signInUser(email, password)
    {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    // Returns the current user
    function getCurrentUser()
    {
        return firebase.auth().currentUser;
    }

    function isStudent(user)
    {
        var email = typeof user === "string" ? user : user.email;

        if (!email)
            return false;

        return email.endsWith(studentAccountDomain);
    }

    function getAccountName(user)
    {
        var email = typeof user === "string" ? user : user.email;

        if (!isStudent(email))
            return email;

        var p = email.indexOf("@");
        if (p == -1)
            return email;

        return email.substr(0, p);
    }


    // [awaitable] Signs-out the current user
    function signOut()
    {
        return firebase.auth().signOut();
    }

    // [awaitable] Creates a file info record in Firestore and returns the file name
    function createFile()
    {
        var user = firebase.auth().currentUser;

        if (!user)
            return null;
        
        return db.collection("files").add({
            user : user.email,
            name : "Untitled",
            public : false
        });
    }
    
    // [awaitable] Save the txt string using the fileName
    function saveFile(fileName, txt)
    {
        var filePath = "files/" + fileName;

        var storageRef = storage.ref();
        var fileRef = storageRef.child(filePath);

        return fileRef.putString(txt);
    }

    // [awaitable] Get the content of specified file
    function getFile(fileName)
    {
        var filePath = "files/" + fileName;

        var storageRef = storage.ref();
        var fileRef = storageRef.child(filePath);

        return fileRef.getDownloadURL()
            .then(function(url) {
                return fetch(url);
            })
            .then(function(response){
                return response.text();
            })
            .catch(function(error){
            })
    }

    // [awaitable] Deletes the specified file
    function deleteFile(fileName)
    {
        if (!fileName)
            return null;
        
        var filePath = "files/" + fileName;

        var storageRef = storage.ref();
        var fileRef = storageRef.child(filePath);
        
        return fileRef.delete().then( function(){
            return db.collection("files").doc(fileName).delete();
        } );
    }

    // [awaitable] Sets the public flag of a file
    function setPublic(fileName, bPublic)
    {
        return db.collection("files").doc(fileName).set({
            public : bPublic
        }, { merge : true })
    }

    async function ownFile(fileName)
    {
        var user = getCurrentUser();
        if (!user)
            return false;
        
        var doc = await db.collection("files").doc(fileName).get();
        if (!doc.exists)
            return false;

        var data = doc.data();
        return data.user == user.email;
    }

    // [awaitable] Returns array of documents
    function getFiles()
    {
        var user = firebase.auth().currentUser;
        
        if (!user || !user.email)
            return null;

        return db.collection("files").where("user", "==", user.email)
                .get()
                .then(function(snapshot) {
                    var ar = [];
                    snapshot.forEach(function(doc) {
                        var o = doc.data();
                        o.id = doc.id;
                        ar.push(o);
                    })

                    return ar;
                });
    }

    /*
    async function getFiles()
    {
        var user = firebase.auth().currentUser;
        
        if (!user || !user.email)
            return null;

        var snapshot = await db.collection("files").where("user", "==", user.email).get();
        var ar = [];
        
        snapshot.forEach(function(doc) {
            var o = doc.data();
            o.id = doc.id;
            ar.push(o);
        })

        return ar;
    }
    */


    return {
        createStudentAccount : createStudentAccount,
        signInStudent : signInStudent,
        signInUser : signInUser,
        getCurrentUser : getCurrentUser,
        getStudentDetails : getStudentDetails,
        createUserAccount : createUserAccount,
        isStudent : isStudent,
        getAccountName : getAccountName,
        signOut : signOut,
        createFile : createFile,
        saveFile : saveFile,
        deleteFile : deleteFile,
        setPublic : setPublic,
        getFiles : getFiles,
        getFile : getFile,
        ownFile : ownFile
    }

}
