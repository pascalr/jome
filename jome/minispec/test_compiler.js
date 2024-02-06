const j_uid_1 = require("minispec");
const { default: MiniSpec, describe, it } = j_uid_1;
const { compileCode } = require("../src/compiler.js");
const assert = require("assert/strict");
module.exports = () => {
  function compile(code) {
    return compileCode(code, { writeScript: false });
  }
  describe("Paths", function () {
    it("Dirname shortcuts", function () {
      assert.match(compile("#."), /__dirname/);
      assert.match(compile("#./"), /__dirname/);
    });
    it("Absolute paths", function () {
      assert.match(compile("#/"), /"\/"/);
      assert.match(compile("#/some/path.ext"), /"\/some\/path\.ext"/);
    });
    it("Path relative to current file", function () {
      assert.match(
        compile("#./some_file.ext"),
        /path.join\(__dirname, "some_file\.ext"\)/,
      );
    });
    it("Path relative to the current working directory", function () {
      assert.match(
        compile("#cwd/some_file.ext"),
        /path.resolve\("\.\/some_file\.ext"\)/,
      );
    });
    it("Path in the current file parent folder", function () {
      assert.match(compile("#.."), /path.join\(__dirname, ".."\)/);
      assert.match(compile("#../"), /path.join\(__dirname, "..\/"\)/);
      assert.match(
        compile("#../some_file.ext"),
        /path.join\(__dirname, "..\/some_file\.ext"\)/,
      );
    });
  });
  MiniSpec.execute();
};
