const test_compiler = require("./test_compiler.js");
const test_validator = require("./test_validator.js");
const MiniSpecPkg = require("minispec");
module.exports = () => {
  let MiniSpec = MiniSpecPkg.default;
  test_compiler();
  test_validator();
  MiniSpec.execute();
};
