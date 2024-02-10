const assert = require("assert/strict");
const { describe, it } = require("minispec");
const { analyzeCode } = require("../src/compiler.js");
module.exports = () => {
  describe("Incomplete statements", function () {
    it("should return an error keyword let with nothing else", function () {
      let ctxFile = analyzeCode("let");
      assert.equal(ctxFile.errors.length, 1);
    });
    it("should return an error keyword import with nothing else", function () {
      let ctxFile = analyzeCode("import");
      assert.equal(ctxFile.errors.length, 1);
    });
  });
  describe("Declaration should add to the lexical environment", function () {
    it("let should add to the lexical environment", function () {
      let ctxFile = analyzeCode("let x");
    });
    it("import should add to the lexical environment", function () {
      let ctxFile = analyzeCode("import name from 'file'");
    });
    it("def should add to the lexical environment", function () {
      let ctxFile = analyzeCode("def add(x, y) return x + y end");
    });
  });
};
