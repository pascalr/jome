const express = require("express");

let port = 3000(() => {
  let __chain = express();
  __chain.get("/", function (req, res) {
    res.send("Hello world!");
  });
  return __chain.listen(port, function () {
    console.log(`Server listening on port {port}`);
  });
})();
