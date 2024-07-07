const express = require("express");

const port = 3000
const app = express()

app.use("/virtual", express.static("./docs"))

app.get("/", (req, res) => res.redirect("/virtual"));

app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
})