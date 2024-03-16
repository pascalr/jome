const path = require("path");
const { compile, build } = require("@jome/core");
const fs = require("fs");
module.exports = (f) => {
  let force = f;

  compile(path.join(__dirname, "js/ex_vanilla.jomm"), { force: force });

  fs.copyFileSync(
    path.join(__dirname, "js/ex_vanilla.js"),
    path.join(__dirname, "../docs/js/ex_vanilla.js"),
  );

  build(
    path.join(__dirname, "views/in_depth.html.jome"),
    path.join(__dirname, "../docs/in_depth/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/home.html.jome"),
    path.join(__dirname, "../docs/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/getting_started.html.jome"),
    path.join(__dirname, "../docs/getting_started/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/examples.html.jome"),
    path.join(__dirname, "../docs/ex/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/test.html.jome"),
    path.join(__dirname, "../docs/test/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/librairies.html.jome"),
    path.join(__dirname, "../docs/lib/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/utils.html.jome"),
    path.join(__dirname, "../docs/utils/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/formats.html.jome"),
    path.join(__dirname, "../docs/formats/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/v0_2.html.jome"),
    path.join(__dirname, "../docs/v0.2/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/v0_1.html.jome"),
    path.join(__dirname, "../docs/ref/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "views/v0_0.html.jome"),
    path.join(__dirname, "../docs/v0.0/index.html"),
    { force: force },
  );

  build(
    path.join(__dirname, "css/stylesheet.css.jome"),
    path.join(__dirname, "../docs/stylesheet.css"),
    { force: force },
  );
};
