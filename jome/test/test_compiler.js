const { describe, it, context } = require("minispec");
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
  describe("Imports", function () {
    it("Default import", function () {
      assert.match(
        compile('import name from "module-name"'),
        /const name = require\("module-name"\)/,
      );
    });

    it("Star import", function () {
      assert.match(
        compile('import * as name from "module-name"'),
        /const (\w+) = require\("module-name"\);\s*const { ?default: \w+, ...name ?} = \1;/,
      );
    });

    it("Deconstructed import", function () {
      assert.match(
        compile('import { name } from "module-name"'),
        /const { ?name ?} = require\("module-name"\)/,
      );
      assert.match(
        compile('import { name, name2 } from "module-name"'),
        /const { ?name, name2 ?} = require\("module-name"\)/,
      );
    });

    it("Alias deconstructed import", function () {
      assert.match(
        compile('import { name as otherName } from "module-name"'),
        /const {name as otherName} = require\("module-name"\)/,
      );
      assert.match(
        compile('import { normal, name as otherName } from "module-name"'),
        /const {normal, name as otherName} = require\("module-name"\)/,
      );
    });

    it("Alias deconstructed import", function () {
      assert.match(
        compile('import { name as otherName } from "module-name"'),
        /const {name as otherName} = require\("module-name"\)/,
      );
    });

    it("Default import and deconstructed", function () {
      assert.match(
        compile('import name, { foo } from "module-name"'),
        /const (\w+) = require\("module-name"\);\s*const { ?default: name, foo ?} = \1;/,
      );
    });

    it("Default import and star import", function () {
      assert.match(
        compile('import name, * as all from "module-name"'),
        /const (\w+) = require\("module-name"\);\s*const { ?default: name, ...all ?} = \1;/,
      );
    });
  });
};
