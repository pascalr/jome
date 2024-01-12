const express = require("express");
const run_test_html = require("./views/test.html.js");
module.exports = ({ port = 3000 }) => {
  (() => {
    let __chain = express();
    __chain.use("/jome", express.static("docs")),
      __chain.get("/test", (req, res) => res.send(run_test_html())),
      __chain.get("/", (req, res) => res.redirect("/jome"));
    return __chain.listen(port, function () {
      console.log(`Server listening on port ${port}`);
    });
  })();
};
