const fs = require('fs')
const path = require('path')
const express = require("express");

const port = 3000
const app = express()

app.use("/editor", express.static("./docs"))
app.use("/get_file", express.static("."))

app.get("/", (req, res) => res.redirect("/editor"));

app.get(/\/f\/.*/, (req, res) => {
  res.render()
});


// app.get(/\/f\/.*/, (req, res) => {
//   let p = path.resolve(path.normalize(req.url.slice(3)))
//   if (!p.startsWith(__dirname)) {
//     res.forbidden();
//   } else {
//     fs.readFile(p, 'utf8', (err, data) => {
//       if (err) {
//         console.error(err);
//         res.status(400).end();
//         return;
//       }
//       res.send(data)
//     });
//   }
// });

function getDirectoryTree(dirPath, options) {
  
  if (options && options.exclude && options.exclude.includes(dirPath)) {return null}

  const stats = fs.lstatSync(dirPath);
  const tree = {
      name: path.basename(dirPath),
      path: dirPath,
      type: stats.isDirectory() ? 'directory' : 'file',
  };

  if (stats.isDirectory()) {
      tree.children = fs.readdirSync(dirPath).map(child => {
          return getDirectoryTree(path.join(dirPath, child), options);
      }).filter(f => f);
  }

  return tree;
}

app.get("/get_file_tree", async (req, res) => {
  res.send(getDirectoryTree(".", {exclude: ["node_modules"]}))
});

app.get("/get_file_list", async (req, res) => {
  fs.readdir(".", { recursive: true }, (err, files) => {
    res.send(files.filter(f => !f.startsWith("node_modules") && !f.startsWith(".")))
  });
});

app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
})