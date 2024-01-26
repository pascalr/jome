const build = require("jome-lib/build");
module.exports = (f) => {
  let force = f;
  build(
    path.join(__dirname, "views/test.html.jome"),
    path.join(__dirname, "../docs/test/index.html"),
    { force: force }
  );
  build(
    path.join(__dirname, "views/librairies.html.jome"),
    path.join(__dirname, "../docs/lib/index.html"),
    { force: force }
  );
  build(
    path.join(__dirname, "views/utils.html.jome"),
    path.join(__dirname, "../docs/utils/index.html"),
    { force: force }
  );
  build(
    path.join(__dirname, "views/formats.html.jome"),
    path.join(__dirname, "../docs/formats/index.html"),
    { force: force }
  );
  build(
    path.join(__dirname, "views/v0_2.html.jome"),
    path.join(__dirname, "../docs/v0.2/index.html"),
    { force: force }
  );
  build(
    path.join(__dirname, "views/v0_1.html.jome"),
    path.join(__dirname, "../docs/index.html"),
    { force: force }
  );
  build(
    path.join(__dirname, "views/v0_0.html.jome"),
    path.join(__dirname, "../docs/v0.0/index.html"),
    { force: force }
  );
  build(
    path.join(__dirname, "css/stylesheet.css.jome"),
    path.join(__dirname, "../docs/stylesheet.css"),
    { force: force }
  );
};
