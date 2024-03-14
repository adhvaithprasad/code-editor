
/**
 * Firebase configuration and initialization.
 * Configures the Firebase SDK with the provided credentials.
 */
var config = {
    apiKey: "AIzaSyC-3XDB0vSiQlbGL-Sa9rOiteFYitYfstw",
    authDomain: "firescrypt-web.firebaseapp.com",
    databaseURL: "https://firescrypt-web-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "firescrypt-web",
    storageBucket: "firescrypt-web.appspot.com",
    messagingSenderId: "276701233302",
    appId: "1:276701233302:web:5e513b1d8c681e830082b7",
    measurementId: "G-T12DZ6GPNN"
};
firebase.initializeApp(config);
var db = firebase.database();



firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const uid = user.uid;
      


        if (user !== null) {
            var x = window.location.href.split("/signup/")[1];
            window.location.href="http://localhost:8000/editor/"+x;
        }
    } else {
        document.getElementById("no-repo-shadow").style.display = "flex";
        document.getElementById("sign-in").style.display = "flex";
       
    }
});


const signInForm = document.getElementById("sign-in"),
    loginBtn = document.getElementById("login-btn"),
    signupBtn = document.getElementById("signup-btn"),
    githubSignupBtn = document.getElementById("github-signup"),
    googleSignupBtn = document.getElementById("google-signup");

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("signed out")
    }).catch(e => {
        console.error(e)
    })
}

signInForm.addEventListener("submit", e => {
    e.preventDefault(), console.log("sub");
    let t = document.getElementById("email").value,
        n = document.getElementById("password").value;
    e.submitter === loginBtn ? (console.log("log"), firebase.auth().signInWithEmailAndPassword(t, n).then(e => {
        let t = e.user;
        console.log("Logged in:", t), window.location.href = "https://firescryptgithubio.adhvaithprasad.repl.co/"
    }).catch(e => {
        let t = e.code,
            n = e.message;
        alert("Error:", t, n)
    })) : e.submitter === signupBtn && (console.log("sign"), firebase.auth().createUserWithEmailAndPassword(t, n).then(e => {
        let t = e.user;
        console.log("Signed up:", t), window.location.href = "https://firescryptgithubio.adhvaithprasad.repl.co/"
    }).catch(e => {
        let t = e.code,
            n = e.message;
        alert("Error:", t, n)
    }))
}), githubSignupBtn.addEventListener("click", () => {
    var e = new firebase.auth.GithubAuthProvider;
    firebase.auth().signInWithRedirect(e), firebase.auth().getRedirectResult().then(e => {
        if (e.credential) var t, n = e.credential.accessToken;
        var i = e.user
    }).catch(e => {
        var t = e.code,
            n = e.message,
            i = e.email,
            r = e.credential
    })
}), googleSignupBtn.addEventListener("click", () => {
    var e = new firebase.auth.GoogleAuthProvider;
    firebase.auth().signInWithRedirect(e), firebase.auth().getRedirectResult().then(e => {
        if (e.credential) var t, n = e.credential.accessToken;
        var i = e.user
    }).catch(e => {
        var t = e.code,
            n = e.message,
            i = e.email,
            r = e.credential
    })
});










function expand(m){

  var n = document.getElementById(m).style.display;

if (n === "none") {
  document.getElementById(m).style.display="block";
}  else {
  document.getElementById(m).style.display="none";
}
}
function sidebar(){
  
    var n = document.getElementById('output').style.display;

  if (n === "none") {
    document.getElementById('output').style.display="block";
    document.querySelector('.editor-container').style.width='';
    window.editor.layout()
  }  else {
    document.getElementById('output').style.display="none";
    document.querySelector('.editor-container').style.width='100%';
    window.editor.layout()
  }
}