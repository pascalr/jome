const express = require("express");
module.exports = (first, arg = 3002) => {
  console.log(arg);
  let port = 3000;
  (() => {
    let __chain = express();
    __chain.use("/jome", express.static("docs")),
      __chain.get("/", (req, res) => res.redirect("/jome"));
    return __chain.listen(port, function () {
      console.log(`Server listening on port ${port}`);
    });
  })();
};
