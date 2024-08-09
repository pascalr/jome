const fs = require('fs')
const path = require('path')
const express = require("express");

const port = 3000
const app = express()

app.use("/editor", express.static("./docs"))
app.use("/self", express.static("."))

app.get("/", (req, res) => res.redirect("/f/README.md"));

app.get(/\/f\/.*/, (req, res) => {
  let p = path.resolve(path.normalize(req.url.slice(3)))
  if (!p.startsWith(__dirname)) {
    res.forbidden();
  } else {
    fs.readFile(p, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(400).end();
        return;
      }
      res.send(data)
    });
  }
});

app.get("/files", async (req, res) => {
  fs.readdir(".", { recursive: true }, (err, files) => {
    res.send(files)
  });
});

app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
})