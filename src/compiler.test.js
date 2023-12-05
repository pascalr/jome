const {compile} = require('./compiler.js')

/*
I was wondering whether I want to write tests in Jome or in js. But I think I prefer to write them in
javascript because it is more stable. It is a little weird to compile tests in itself when the language is not stable yet.
*/

// TODO: Strip spaces in most cases because I don't want to correct spacing, just syntax. Spacing may change over time.

describe("Test utils", () => {
  test('#log', () => {
    expect(compile('#log("Hello world!")')).toMatch(/console.log\("Hello world!"\)/);
  })
})

describe("Test functions creation", () => {
  /*
  The keyword def generates an arrow function. The keyword fn generates a function.
  You can also use the let keyword instead of def
  Functions can also be declared inline.
  */
  // *** KEYWORD def ***
  test('def keyword with do end', () => {
    expect(compile('def sayHello do #log("hello") end')).toMatch(/let sayHello = \(\) => {\s*console.log\("hello"\)\s*}/);
  })
  test('def keyword with do end with args', () => {
    expect(compile('def sayHello do |name| #log("hello", name) end')).toMatch(/let sayHello = \(name\) => {\s*console.log\("hello", name\)\s*}/);
  })
  test('def keyword with arrow function', () => {
    expect(compile('def giveMe5 => 5')).toMatch(/let giveMe5 = \(\) => 5/);
  })
  test('def keyword with arrow function with args', () => {
    expect(compile('def echo |x| => x')).toMatch(/let echo = \(x\) => x/);
  })
  // *** KEYWORD let ***
  test('let keyword with do end', () => {
    expect(compile('let sayHello = do #log("hello") end')).toMatch(/let sayHello = \(\) => {\s*console.log\("hello"\)\s*}/);
  })
  test('let keyword with do end with args', () => {
    expect(compile('let sayHello = do |name| #log("hello", name) end')).toMatch(/let sayHello = \(name\) => {\s*console.log\("hello", name\)\s*}/);
  })
  test('let keyword with arrow function', () => {
    expect(compile('let giveMe5 = => 5')).toMatch(/let giveMe5 = \(\) => 5/);
  })
  test('let keyword with arrow function with args', () => {
    expect(compile('let echo = |x| => x')).toMatch(/let echo = \(x\) => x/);
  })
  // *** KEYWORD fn ***
  test('fn keyword with do end', () => {
    expect(compile('fn sayHello do #log("hello") end')).toMatch(/function sayHello {\s*console.log\("hello"\)\s*}/);
  })
  test('fn keyword with do end with args', () => {
    expect(compile('fn sayHello do |name| #log("hello", name) end')).toMatch(/function sayHello\(name\) {\s*console.log\("hello", name\)\s*}/);
  })
  test('fn keyword with arrow function', () => {
    expect(compile('fn giveMe5 => 5')).toMatch(/function giveMe5() {return 5;?}/);
  })
  test('fn keyword with arrow function with args', () => {
    expect(compile('fn echo |x| => x')).toMatch(/function echo\(x\) {return x;?}/);
  })
  // *** inline ***
  test('inline with do end', () => {
    expect(compile('do #log("hello") end')).toMatch(/\(\) => {\s*console.log\("hello"\)\s*}/);
  })
  test('inline with do end with args', () => {
    expect(compile('do |name| #log("hello", name) end')).toMatch(/\(name\) => {\s*console.log\("hello", name\)\s*}/);
  })
  test('inline with arrow function', () => {
    expect(compile('=> 5')).toMatch(/\(\) => 5/);
  })
  test('inline with arrow function with args', () => {
    expect(compile('|x| => x')).toMatch(/\(x\) => x/);
  })
  // *** inline with fn keyword ***
  test('inline with fn keyword with do end', () => {
    expect(compile('fn do #log("hello") end')).toMatch(/function {\s*console.log\("hello"\)\s*}/);
  })
  test('inline with fn keyword with do end with args', () => {
    expect(compile('fn do |name| #log("hello", name) end')).toMatch(/function \(name\) {\s*console.log\("hello", name\)\s*}/);
  })
  test('inline with fn keyword with arrow function', () => {
    expect(compile('fn => 5')).toMatch(/function () {return 5;?}/);
  })
  test('inline with fn keyword with arrow function with args', () => {
    expect(compile('fn |x| => x')).toMatch(/function \(x\) {return x;?}/);
  })
})

describe("Test if statements", () => {
  test('if statements use parentheses and not square brackets', () => {
    expect(compile('if (true) (/* some code */)')).toMatch(/\s*if \(true\) \{\s*\}/); // FIXME: Should keep comment
  })
})

test('let x = 1', () => {
  // FIXME: Do I want var or I want let? I used var because it is what CoffeeScript is using by default.
  expect(compile('let x = 1')).toMatch(/var x = 1/);
});