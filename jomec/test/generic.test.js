const { compile } = require("../src/compiler.js");
describe("Tests written in jome", function () {
  test("1 + 1", function () {
    expect(compile("1 + 1")).toMatch(/1 \+ 1/);
  });
});
