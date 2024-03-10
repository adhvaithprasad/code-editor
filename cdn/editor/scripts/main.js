let editorModels = {};
let filen;
let fileName, files = [];
let current_file = null;
let m1, m2, m3, m4;
const repoName = window.location.href.split("/")[4];
function updatePosition() {

  const position = window.editor.getPosition();

  // Update the button text
  const button = document.getElementById('positionButton');
  button.innerHTML = `Line: ${position.lineNumber}, Column: ${position.column}`;
}
let parameters = [];
let addOrSwitchTab;
function init() {
 
  // Configure the paths for Monaco editor
  require.config({
    paths: {
      vs: "https://unpkg.com/monaco-editor@latest/min/vs"
    }
  });

  // Define the Monaco environment and worker URL
  window.MonacoEnvironment = {
    getWorkerUrl: () => workerURL
  };

  // Create a worker URL for Monaco editor
  let workerURL = URL.createObjectURL(new Blob([`
        self.MonacoEnvironment = {
            baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
        };
        importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
    `], {
    type: "text/javascript"
  }));

  // Load Monaco editor and set up its configuration
  require(["vs/editor/editor.main"], function() {
    window.editor = monaco.editor.create(document.getElementById("firepad-container"), {
      minimap: {
        enabled: false
      },
       wordWrap: 'on', 

      theme: "vs-dark"
    });
    window.diffEditor = monaco.editor.createDiffEditor(document.getElementById("firepad-diff-container"),{
    // You can optionally disable the resizing
    enableSplitViewResizing: false,

    // Render the diff inline
    renderSideBySide: false,
  });
    const tabContainer = document.getElementById('editor-header');

     filetab()
    // Function to create a new model for a file
    function createModel(fileName, content) {
      const model = monaco.editor.createModel(content, undefined, monaco.Uri.file(fileName));
      editorModels[fileName] = model;
      return model;
    }

    // Function to switch between tabs or add a new one if it doesn't exist
    addOrSwitchTab = async function(fileName, content,source) {
if(!editorModels["original--diffmodel-"+fileName]){
   if(source === "github"){
   createModel("original--diffmodel-"+fileName, content);
 }
      else if(source === "custom"){
        var diffvalue = await getdiffcontent(fileName);
    
        createModel("original--diffmodel-"+fileName, diffvalue);
      }
}
      if (typeof fileName === "string") {
        filen = fileName
        if (!editorModels[fileName]) {
          const tab = document.createElement('div');
          tab.className = 'tab';
          tab.id = fileName + "--tab";
          tab.textContent = fileName.split("/")[fileName.split("/").length - 1];
          tab.addEventListener('click', () => {
            switchTab(fileName, fileName + "--tab");
          });

          tabContainer.appendChild(tab);
          createModel(fileName, content);
        }
        switchTab(fileName, fileName + "--tab",content);
      }
      else {

        if (!editorModels[fileName.name]) {
          filen = fileName.name
          const tab = document.createElement('div');
          tab.className = 'tab';
          tab.id = fileName.name + "--tab";
          tab.textContent = fileName.name.split("/")[fileName.name.split("/").length - 1];
          tab.addEventListener('click', () => {
            switchTab(fileName.name, fileName.name + "--tab");
          });

          tabContainer.appendChild(tab);
          createModel(fileName.name, content);
        }
        switchTab(fileName.name, fileName.name + "--tab");
      }


    };

    // Function to switch between tabs
    function switchTab(fileName, m) {
      const model = editorModels[fileName];
      filen = fileName;
      const original = editorModels["original--diffmodel-"+fileName];
      if (model) {
        const activeTabs = document.querySelectorAll('.active-file-tab');

        // Iterate through the selected elements and remove the class
        activeTabs.forEach(tab => {
          tab.classList.remove('active-file-tab');
        });
        document.getElementById(m).classList.add("active-file-tab");
        window.editor.setModel(model);
        if(original){
          window.diffEditor.setModel({
  original: original,
  modified: model,
});
        }

      }
    };

    monaco.languages.register({ id: 'custom-lang' });

    // Add an event listener to update the button text on cursor position change
    window.editor.onDidChangeCursorPosition(updatePosition);

    // Initial update
    updatePosition();
    let currentUser = firebase.auth().currentUser;
    window.editor.onDidChangeModelContent((event) => {
      render(filen)
      
    });




  });

  }


const editorElement = document.querySelector(".monaco-editor");
if (editorElement !== undefined && editorElement !== null) {
  window.onresize = function() {
    window.editor.layout();
  };
}
async function render(i) {
  // Debugging: Print out values for debugging
  
  
  const editorValue = window.editor.getValue();
  const data = {
    'file': i,
    'content': editorValue,
    'dir':repoName
  }
 
  const url = 'http://localhost:3000/add';
  const options = {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
   
  } catch (error) {
    console.error(error);
  }
}

function getRepoFiles(){
    const fileTree = document.getElementById("root");

      // Fetch data from the API
      fetch("http://localhost:3000/files/"+repoName)
        .then((response) => response.json())
        .then((jsonData) => {
          createFileTree(fileTree, jsonData.files);
        })
        .catch((error) => console.error(error));


}
function createFileTree(parent, files) {
  files.forEach((file) => {
    const parts = file.split("/");
    let currentFolder = parent;
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1; // Check if it's a file

      if (!isFile) {
        // It's a folder
        let folderItem = null;

        // Check if the folder already exists
        for (let i = 0; i < currentFolder.children.length; i++) {
          if (currentFolder.children[i].children[0].textContent === part) {
            folderItem = currentFolder.children[i];
            break;
          }
        }

        if (!folderItem) {
          // Folder doesn't exist, create it
          folderItem = document.createElement("li");
           folderItem.className = "collapsed";
          const folderLabel = document.createElement("span");
          folderLabel.innerHTML =`<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:20px;height:20px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>`+ part;
          folderLabel.className = "folder-name";
          folderLabel.addEventListener("click", () => {
            folderItem.classList.toggle("collapsed");
           if(folderItem.classList.contains("collapsed")){
             folderLabel.innerHTML =`<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:20px;height:20px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>`+ part;
          }
else{
              folderLabel.innerHTML =`<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:20px;height:20px"><path d="M5.4 7.7l-3.8 9a1 1 0 001 1.3h17a1 1 0 001-.6L24 8.7a1 1 0 00-.9-1.4L6.3 7.1a1 1 0 00-1 .6z"/><path d="M20.3 7.2V5c0-.6-.4-1-1-1H9.7a1 1 0 01-.8-.6L7.8 1.5a1 1 0 00-.9-.5H2a1 1 0 00-1 1v16"/></svg>`+ part;
            }

          });
          folderItem.appendChild(folderLabel);
          const subList = document.createElement("ul");
           subList.className = "folder";
          folderItem.appendChild(subList);
          currentFolder.appendChild(folderItem);
        }

        // Update current folder for the next iteration
        currentFolder = folderItem.querySelector("ul");
      } else {
        // It's a file, create a file item
        const fileItem = document.createElement("li");
        const fileLabel = document.createElement("span");
        fileLabel.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:20px;height:20px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>  `+part;
        fileLabel.className = "file";
        fileItem.id=file;
        fileItem.onclick = async function() {
try {







  let fileName = file;
  let e =file;

  let currentUser = firebase.auth().currentUser;
  let databaseRef = firebase.database().ref();
 databaseRef.child(currentUser.uid).child(repoName ).child(btoa(e)).get().then(snapshot => {
   // uncomment to include cloud write
    // if (snapshot.exists()) {
    //   setval(e, snapshot.val().value,"custom");
    //   console.log("custom")
    // } else {

      fetch("http://localhost:3000/content/master/"+repoName+"/"+btoa(file), {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => setval(e, data.value,"github"))
        .catch(error => setval(e, ""));

     



    // }
  }).catch(error => {
    console.error(error);
  });




} catch (error) {
console.error("Error:", error);
  aware("error")
}

};
        fileItem.appendChild(fileLabel);
        currentFolder.appendChild(fileItem);
      }
    });
  });
}






function setval(fn, fv,n) {
  addOrSwitchTab(fn, fv,n);
}




function switchTab(element) {
  // Remove the 'activetab' class from all elements with the class 'activetab'
  const activeTabs = document.querySelectorAll('.activetab');
  activeTabs.forEach(tab => tab.classList.remove('activetab'));

  // Add the 'activetab' class to the calling element
  element.classList.add('activetab');
}


function filetab() {
  const element = document.querySelector('.filetab');
  switchTab(element);
  document.getElementById("root").style.display = "block";
  document.getElementById("output-file-header").style.display = "flex";
  document.getElementById("git_cont").style.display = "none";
  document.getElementById("output-git-header").style.display = "none";
  document.getElementById("editor-main-container").style.display = "block";
  document.getElementById('output').style.display="block";
  document.querySelector('.editor-container').style.width='';
  window.editor.layout()
}

function gittab() {
  const element = document.querySelector('.gittab');
  switchTab(element);
  document.getElementById("root").style.display = "none";
  document.getElementById("output-file-header").style.display = "none";
  document.getElementById("git_cont").style.display = "flex";
  document.getElementById("output-git-header").style.display = "flex";
  document.getElementById("editor-main-container").style.display = "block";
  document.getElementById('output').style.display="block";
  document.querySelector('.editor-container').style.width='';
  window.editor.layout()
}



function gotoline() {
  editor?.focus();
  const action = editor?.getAction("editor.action.gotoLine");
  void action?.run();
}
function format() {
  editor?.focus();
  const action = editor?.getAction("editor.action.formatDocument");
  void action?.run();
}



function aware(e){
  alert(e)
}
function calculateTimeDifference(timestamp) {
    const currentTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    const timeDifference = currentTime - timestamp;

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
async function commit(){
  let currentUser = firebase.auth().currentUser;
  const name = currentUser.displayName;
  const email = currentUser.email;
  const val = {
    'name':name,
    'email':email,
    'dir':repoName,
    'message':document.getElementById('commit_message').value,
  }

  const url = 'http://localhost:3000/commit';
  const options = {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body:JSON.stringify(val)
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    document.getElementById('commit_message').value='';
    commits();
  } catch (error) {
    console.error(error);
    alert("unable to commit")
  }
}
async function commits(){
  const url = 'http://localhost:3000/commits/'+repoName;
  const options = {method: 'GET'};
  var container = document.getElementById("git_files_cont");
  container.innerHTML = '';
  try {
    const response = await fetch(url, options);
    const data = await response.json();
   
    var commits = data.commits.forEach((commit) => {
        var timestamp = commit.commit.committer.timestamp;
        var committer = commit.commit.committer.name;
        var message = commit.commit.message;
      
        var element = `<div class="listed-commit">
        <div class="commit-design-cont"><div class="commit-line"></div><div class="commit-line-circle"></div><div class="commit-line"></div></div>
       <div class="commit" title="commited by ${committer}">
       <div class="listed-commit-header">
         <p class="git-message">${message}</p><p class="git-date">${calculateTimeDifference(timestamp)}</p>
         </div>
         
       </div></div>`;
        container.innerHTML += element;
      
      
    });
  } catch (error) {
    console.error(error);
  }
}
commits()
async function branches(){
  const url = 'http://localhost:3000/branch/'+repoName;
  const options = {method: 'GET'};
  var container = document.getElementById("branches");
  container.innerHTML = '';
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    var branches = data.branches.forEach((branch) => {
      var element = `<option>${branch}</option>`;
      container.innerHTML += element;
    });
    
  } catch (error) {
    console.error(error);
  }
}
 branches()
