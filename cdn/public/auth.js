var config = {
  apiKey: "AIzaSyC-3XDB0vSiQlbGL-Sa9rOiteFYitYfstw",
  authDomain: "firescrypt-web.firebaseapp.com",
  databaseURL:
    "https://firescrypt-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "firescrypt-web",
  storageBucket: "firescrypt-web.appspot.com",
  messagingSenderId: "276701233302",
  appId: "1:276701233302:web:5e513b1d8c681e830082b7",
  measurementId: "G-T12DZ6GPNN",
};
firebase.initializeApp(config);
var db = firebase.database();
let name;
function cloneProject() {
  const projectName = document.querySelector("#projectName").value;
  const cloneUrl = document.querySelector("#cloneUrl").value;

  if (projectName && cloneUrl) {
    const url = "http://localhost:8000/clone/";
    const body = JSON.stringify({
      url: cloneUrl,
      dir: projectName,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "t") {
          window.location.href =
            "http://localhost:8000/editor/" + projectName;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
function calculateTimeDifference(timestamp) {
  const currentTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
  const timeDifference = currentTime - Math.floor(timestamp / 1000);

  if (timeDifference <= 0) {
    return "0 seconds ago.";
  } else {
    const days = Math.floor(timeDifference / 86400);
    const hours = Math.floor((timeDifference % 86400) / 3600);
    const minutes = Math.floor((timeDifference % 3600) / 60);
    const seconds = timeDifference % 60;

    let result = "";
    if (days > 0) {
      result += days + " days ";
    } else {
      if (hours > 0) {
        result += hours + " hours ";
      } else {
        if (minutes > 0) {
          result += minutes + " minutes ";
        } else {
          result += seconds + " seconds ";
        }
      }
    }

    return result + "ago.";
  }
}
async function listrepos() {
  const url = 'http://localhost:8000/list-repos';
  const options = {
    method: 'GET',
    headers: {'content-type': 'application/json'}
  };

  try {
    const response = await fetch(url, options);
    const responseData = await response.json(); // Parse JSON response first
    const data = responseData.repos; // Access repos array from the parsed response data
    const reposContainer = document.getElementById('list-repos');
    
    data.forEach(repo => {
      const repoName = repo.replace('.git', '');
      const repoElement = document.createElement('p');
      repoElement.textContent = repoName;
      reposContainer.appendChild(repoElement);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    name = user.displayName;
    listrepos();
  } else {
    console.log("not signed in this ");
    listrepos();
  }
});
