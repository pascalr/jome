const j_uid_1 = require("minispec");
const { default: MiniSpec, describe, it } = j_uid_1;
const { analyzeCode } = require("../src/compiler.js");
const assert = require("assert/strict");
module.exports = () => {
  describe("Incomplete statements", function () {
    it("should return an error keyword let with nothing else", function () {
      let ctxFile = analyzeCode("let");
    });
    it("should return an error keyword import with nothing else", function () {
      let ctxFile = analyzeCode("import");
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
