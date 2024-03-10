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
let name;
function cloneProject() {
  const projectName = document.querySelector('#projectName').value;
  const cloneUrl = document.querySelector('#cloneUrl').value;

  if (projectName && cloneUrl) {
    const url = 'http://localhost:3000/clone/';
    const body = JSON.stringify({
      url: cloneUrl,
      dir: projectName
    });

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "t"){
        var n = {
            username: name,
            url:cloneUrl,
            date:Date.now(),
          star:"false"
          };
        console.log(n)
        firebase.database().ref(name+"/repos/"+projectName).set(n);
        window.location.href = "http://g.adhvaithprasad.repl.co/editor/"+projectName;
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
}
function calculateTimeDifference(timestamp) {
    const currentTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    const timeDifference =  currentTime - Math.floor(timestamp / 1000);

    if (timeDifference <= 0) {
        return '0 seconds ago.';
    } else {
        const days = Math.floor(timeDifference / 86400);
        const hours = Math.floor((timeDifference % 86400) / 3600);
        const minutes = Math.floor((timeDifference % 3600) / 60);
        const seconds = timeDifference % 60;

        let result = '';
        if (days > 0) {
            result += days + ' days ';

        }
        else{
        if (hours > 0) {
            result += hours + ' hours ';
        }
        else{
          if (minutes > 0) {
              result += minutes + ' minutes ';
          }
          else  {
              result += seconds + ' seconds ';
          }
        }
      }


        return result + 'ago.';
    }
}
function listrepos(){
  console.log(name);
  document.getElementById("list-repos").innerHTML = "";
  var f =`<div class="search-repo">
    <input type="text"/>
    <button class="create">create</button>
  </div>`;
   document.getElementById("list-repos").innerHTML = f;
  db.ref(name).child("repos").get().then((snapshot) => {
    if (snapshot.exists()) {
      var j = snapshot.val();
      var k = Object.keys(snapshot.val());
      k.forEach((d)=>{
        console.log(d,j[d].star);
        var repo_status = "public";
        var vstar_color = star_color(j[d].star);
        var vstarred_text = starred_text(j[d].star) ;
        console.log(vstarred_text)
        let elem = `<div class="repo"><div class="repo-header">
        <a href='${"http://g.adhvaithprasad.repl.co/editor/"+d}'><svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><circle cx="12" cy="12" r="4"/><path d="M1.05 12H7"/><path d="M17.01 12h5.95"/></svg> ${d} <p>${repo_status}</p></a><button onclick="star('${name+"/repos/"+d}')"><svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="${vstar_color}" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:${vstar_color};width:24px;height:24px"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${vstarred_text}</button>
        </div><div class="repo-footer"><p>${calculateTimeDifference(j[d].date)}</p></div></div>`
        document.getElementById("list-repos").innerHTML += elem;
      })
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

}
function star(m){
  db.ref(m).get().then((snapshot) => {
    if (snapshot.exists()) {
      var k = snapshot.val().star;
      if(k === "true"){
        db.ref(m).update({star:"false"})
      }
      else{
        db.ref(m).update({star:"true"})
      }
    }
    else{
      db.ref(m).update({star:"true"})
    }
  })
  
}
function star_color(m){
  if(m === "true"){
    return "gold"
  }
    else{
      return "none"
    }

  
}
function starred_text(m){
if(m === "true"){
  return "starred"
}
  else{
    return "star"
  }

}
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/v8/firebase.User
    name = user.displayName;
    var email = user.email;
    var img = user.photoURL;
    document.getElementById("user-img").src=img;
    document.getElementById("username").textContent = name;
    document.getElementById("email").href = "mailto:"+email;
    
    listrepos()
    // ...
  } else {
    console.log("not signed in this ")
    // User is signed out
    // ...
  }
});