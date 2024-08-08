const fs = require('fs')
const express = require("express");

// build

global.ROOT = '/virtual'

const homeGenerator = require('./views/home.html.js')

fs.writeFile('./docs/home.html', homeGenerator(), 'utf8', (err) => {});

// /**
//  * #build
//  * If the source file has been modified, compile and run it. Then save
//  * it to the destination file.
//  * TODO: Write the async version. Rename this one buildSync
//  */
// function build(srcFile, destFile, options) {
//   if (!srcFile.endsWith('.jome')) {
//     throw new Error("Can't #compile a file with .jome extension.")
//   }
//   if (!destFile) {
//     destFile = srcFile.slice(0, -5)
//   }
//   if (!options.force) {
//     if (fs.existsSync(destFile)) {
//       // Check if the file needs to be compiled
//       const srcStats = fs.statSync(srcFile);
//       const destStats = fs.statSync(destFile);
//       if (destStats.mtime.getTime() > srcStats.mtime.getTime()) {
//         return; // File is already up to date
//       }
//     }
//   }
//   let out = runCjs(srcFile, ...(options.args||[]))
//   fs.writeFile(destFile, out, 'utf8', (err) => handleError(err, options));
//   // fs.writeFileSync(destFile, out);
// }

// server

const port = 3000
const app = express()

app.use("/editor", express.static("./docs"))
app.use("/self", express.static("."))

app.get("/", (req, res) => res.redirect("/editor"));

app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
})