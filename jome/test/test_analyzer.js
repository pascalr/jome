const j_uid_1 = require("minispec");
const { default: MiniSpec, describe, it } = j_uid_1;
const { validateCode } = require("../src/compiler.js");
const assert = require("assert/strict");
module.exports = () => {
  describe("Incomplete statements", function () {
    it("should return an error keyword let with nothing else", function () {
      let errors = validateCode("let");
      assert.equal(errors.length, 1);
    });
    it("should return an error keyword import with nothing else", function () {
      let errors = validateCode("import");
      assert.equal(errors.length, 1);
    });
  });
  describe("Declaration should add to the lexical environment", function () {
    it("let should add to the lexical environment", function () {
      validateCode("let x");
    });
    it("import should add to the lexical environment", function () {
      validateCode("import x from 'file'");
    });
    it("def should add to the lexical environment", function () {
      validateCode("def add(x, y) return x + y end");
    });
  });
};
