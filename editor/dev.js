const fs = require('fs')
const express = require("express");

const port = 3000
const app = express()

app.use("/editor", express.static("./docs"))
app.use("/self", express.static("."))

app.get("/", (req, res) => res.redirect("/editor"));

app.get("/files", async (req, res) => {
  fs.readdir(".", { recursive: true }, (err, files) => {
    res.send(files)
  });
});

app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
})