const {compile} = require('./compiler.js')

/*
I was wondering whether I want to write tests in Jome or in js. But I think I prefer to write them in
javascript because it is more stable. It is a little weird to compile tests in itself when the language is not stable yet.
*/

describe("Test syntax", () => {
  test('if statements use parentheses and not square brackets', () => {
    return expect(compile('if (true) (/* some code */)')).toBe("if (true) {/* some code */}");  
  })
})
test('let x = 1', () => {
  // FIXME: Do I want var or I want let? I used var because it is what CoffeeScript is using by default.
  return expect(compile('let x = 1')).toBe("var x = 1");
});