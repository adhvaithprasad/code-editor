const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const cors = require('cors');
const fs = require('fs')
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
var express = require("express");
var app = express();
const { Git: Server } = require('node-git-server');
const corsOptions = {
  origin: 'http://localhost:3000/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204, // No content status for preflight OPTIONS request
};

app.use(cors(corsOptions));
app.use(express.json());
const repos = new Server(path.resolve(__dirname, 'tmp'), {
  autoCreate: true
});
const port = process.env.PORT || 3000;
function clone(rdir, url) {
  const dir = path.join(process.cwd(), "assets", rdir);
  git.clone({ fs, http, dir, url }).then(console.log)

}
async function list(rdir) {
  const dir = path.join(process.cwd(), "assets", rdir);
  const files = await git.listFiles({ fs, dir });
  return files
}
async function branchlist(rdir) {
  const dir = path.join(process.cwd(), "assets", rdir);
  const branches = await git.listBranches({ fs, dir });
  return branches
}
async function commitlist(rdir) {
  const dir = path.join(process.cwd(), "assets", rdir);
  const commits = await git.log({ fs, dir,ref:'HEAD' });
  return commits
}
// function content(file, rdir, branch) {
//   const dir = path.join(process.cwd(), "assets", rdir);
//   let value ;
//   console.log(dir+'/'+file)
//   fs.readFile(dir+'/'+file, 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       return err;
//     }
    
//     value = data ;
//   });
//   return value
// }
async function commit(message, name, email, rdir) {
  const dir = path.join(process.cwd(), "assets", rdir);
  console.log(message,name,email,dir)
  let sha = await git.commit({
    fs,
    dir:dir,
    author: {
      name: name,
      email: email,
    },
    message: message
  })
  return sha
}
async function add(file, rdir, content) {
  const dir = path.join(process.cwd(), "assets", rdir);
  console.log(file, dir, content);


    fs.writeFileSync("assets/" + rdir + "/" + file, content, 'utf-8');
     git.add({ fs, dir, filepath:file });
 
}

app.get('/files/:repo', async (req, res) => {
  const repo = req.params.repo;
  try {
    const r = await list(repo);
    res.send({ "files": r });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/branch/:repo', async (req, res) => {
  const repo = req.params.repo;
  try {
    const r = await branchlist(repo);
    res.send({ "branches": r });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/commits/:repo', async (req, res) => {
  const repo = req.params.repo;
  console.log(repo)
  try {
    const r = await commitlist(repo);
    res.send({ "commits": r });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.post('/clone', (req, res) => {
  const url = req.body.url;
  const dir = req.body.dir;
  clone(dir, url);
  res.json({ message: 't' });
});
app.post('/commit', async (req, res) => {
  const message = req.body.message;
  const name = req.body.name;
  const email = req.body.email;
  const dir = req.body.dir;
  try {
    const r = await commit(message, name, email, dir);
    res.send({ "sha": r })
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.post('/add', async (req, res) => {
  const file = req.body.file;
  const dir = req.body.dir;
  const content = req.body.content;
  try 
  {
   
    const r = await add(file, dir,content);
    res.send({"status":"done"})
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/content/:branch/:dir/:file', async (req, res) => {
  const file = atob(req.params.file);
  const branch = req.params.branch;
  const rdir = req.params.dir;
  try {
    const dir = path.join(process.cwd(), "assets", rdir);

    console.log(dir+'/'+file)
    fs.readFile(dir+'/'+file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return err;
      }

      res.send({ "value": data })
    });

    
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/editor",express.static("public"))
app.use("/cdn", express.static("cdn"))
app.use("/editor/:repo", express.static("editor"))
app.use('/git', function (req, res) {
  repos.handle(req, res)
});

app.listen(port, () => {
  console.log(`Express http server listening`);
});