//const {compile} = require('./compiler.js')
const {parse,compilePP} = require('./parser.js')
const {tokenize} = require('./tokenizer.js')

/*
FIXMEEEE: Combining compiler and parser tests because I am having issues with depedencies: (running either separate OK)
TypeError: Cannot redefine property: length
        at Function.defineProperty (<anonymous>)

      1 | // import FirstMate from 'first-mate'
    > 2 | const FirstMate = require('first-mate')
        |                   ^
      3 |
      4 | const registry = new FirstMate.GrammarRegistry()
      5 | //registry.loadGrammarSync('./grammar/syntaxes/JavaScript.tmLanguage.json')

      at Object.<anonymous> (node_modules/oniguruma/src/oniguruma.js:108:8)
      at Object.<anonymous> (node_modules/first-mate/lib/grammar.js:10:10)
      at Object.<anonymous> (node_modules/first-mate/lib/grammar.js:395:4)
      at Object.<anonymous> (node_modules/first-mate/lib/grammar-registry.js:12:13)
      at Object.<anonymous> (node_modules/first-mate/lib/grammar-registry.js:273:4)
      at Object.<anonymous> (node_modules/first-mate/lib/first-mate.js:4:22)
      at Object.<anonymous> (node_modules/first-mate/lib/first-mate.js:14:4)
      at Object.require (src/tokenizer.js:2:19)
      at Object.require (src/compiler.js:9:38)
      at Object.require (src/compiler_and_parser.test.js:1:19)
*/

/*
I was wondering whether I want to write tests in Jome or in js. But I think I prefer to write them in
javascript because it is more stable. It is a little weird to compile tests in itself when the language is not stable yet.
*/

// function printTree(node, depth = 0) {
//   const indentation = '  '.repeat(depth);

//   console.log(`${indentation}${node.raw}`);

//   for (const child of node.children) {
//     printTree(child, depth + 1);
//   }
// }

function compile(code) {
  let tokens = tokenize(code).children
  let topNodes = parse(tokens)
  //topNodes.forEach(top => printTree(top))
  return compilePP(topNodes)
}

describe("Test utils", () => {
  test('#log', () => {
    expect(compile('#log')).toMatch(/console.log/);
  })
  test('#log hello world', () => {
    expect(compile('#log("Hello world!")')).toMatch(/console.log\("Hello world!"\)/);
  })
  test('{x:1}.#log', () => {
    expect(compile('{x:1}.#log')).toMatch(/console.log\(\{x\: ?1\}\)/);
  })
})

describe("Test functions creation", () => {
  /*
  The keyword def generates an arrow function. The keyword fn generates a function.
  You can also use the let keyword instead of def
  Functions can also be declared inline.
  */
  // *** KEYWORD def ***
  test('def keyword', () => {
    expect(compile('def sayHello #log("hello") end')).toMatch(/function sayHello\(\) {\s*console.log\("hello"\)\s*}/);
  })
  test('def keywordwith args', () => {
    expect(compile('def sayHello |name| #log("hello", name) end')).toMatch(/function sayHello\(name\) {\s*console.log\("hello", name\)\s*}/);
  })
  // *** KEYWORD let ***
  test('let keyword with do end', () => {
    expect(compile('let sayHello = do #log("hello") end')).toMatch(/let sayHello = function \(\) {\s*console.log\("hello"\)\s*}/);
  })
  test('let keyword with do end with args', () => {
    expect(compile('let sayHello = do |name| #log("hello", name) end')).toMatch(/let sayHello = function \(name\) {\s*console.log\("hello", name\)\s*}/);
  })
  // test('let keyword with arrow function', () => {
  //   expect(compile('let giveMe5 = => 5')).toMatch(/let giveMe5 = \(\) => \(?5\)?/);
  // })
  // let giveMe5 = _=> 5
  // let giveMe5 ==> 5
  test('let keyword with arrow function with args', () => {
    expect(compile('let echo = |x| => x')).toMatch(/let echo = \(x\) => \(?x\)?/);
  })
  // *** inline ***
  test('inline with do end', () => {
    expect(compile('do #log("hello") end')).toMatch(/function \(\) {\s*console.log\("hello"\)\s*}/);
  })
  test('inline with do end with args', () => {
    expect(compile('do |x, name| #log("hello", name) end')).toMatch(/function \(x,\s*name\) {\s*console.log\("hello", name\)\s*}/);
  })
  test('inline with arrow function', () => {
    expect(compile('=> 5')).toMatch(/\(\) => \(?5\)?/);
  })
  test('inline with arrow function with args', () => {
    expect(compile('|x| => x')).toMatch(/\(x\) => \(?x\)?/);
  })
})

describe("Test if statements", () => {
  test('if statements blocks', () => {
    expect(compile('if true #log("hello") end')).toMatch(/\s*if \(true\) \{\s*console.log\("hello"\);?\s*\}/);
  })
  // An if modifier executes everything to it's left only if the condition is true
  test('if modifier', () => {
    expect(compile('let x; x = "10" if true')).toMatch(/let x;\s*if \(?true\)? \{x = "10"\}/);
  })
})

test('let x = 1', () => {
  // FIXME: Do I want var or I want let? I used var because it is what CoffeeScript is using by default.
  expect(compile('let x = 1')).toMatch(/(var|let)\s+x\s*=\s*1/);
});





/*****************************************************/
/*********** TEST PARSER AND COMPILER_PP *************/
/*****************************************************/

describe("Parse operation", () => {

  test('1 + 2', () => {
    let list = parse(tokenize("1+2").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('+')
    expect(ast?.children?.[0]?.raw).toBe('1')
    expect(ast?.children?.[1]?.raw).toBe('2')

    let out = compilePP(list)
    expect(out).toMatch(/1\s*\+\s*2/)
  })

  test('2 + 3 * 4 + 5 == 19', () => {
    let list = parse(tokenize("2 + 3 * 4 + 5 == 19").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('==')
    expect(ast?.children?.[0]?.raw).toBe('+')
    expect(ast?.children?.[0]?.children?.[0]?.raw).toBe('+')
    expect(ast?.children?.[0]?.children?.[0]?.children?.[0]?.raw).toBe('2')
    expect(ast?.children?.[0]?.children?.[0]?.children?.[1]?.raw).toBe('*')
    expect(ast?.children?.[0]?.children?.[0]?.children?.[1]?.children?.[0]?.raw).toBe('3')
    expect(ast?.children?.[0]?.children?.[0]?.children?.[1]?.children?.[1]?.raw).toBe('4')
    expect(ast?.children?.[0]?.children?.[1]?.raw).toBe('5')
    expect(ast?.children?.[1]?.raw).toBe('19')
  })
})

describe("Parse let assignment", () => {

  test('let x', () => {
    let list = parse(tokenize("let x").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('let x')
  })

  test('let x;', () => {
    let list = parse(tokenize("let x;").children)
    expect(list?.length).toBe(2)
    let ast = list[0]
    expect(ast?.raw).toBe('let x')
  })

  test('let x; let y', () => {
    let list = parse(tokenize("let x; let y").children)
    expect(list?.length).toBe(3)
    expect(list[0]?.raw).toBe('let x')
    expect(list[2]?.raw).toBe('let y')
  })

})

describe("Test values", () => {
  test('integer', () => {
    expect(compile('10')).toMatch(/10/);
    expect(compile('1234')).toMatch(/1234/);
  })
  test('float', () => {
    expect(compile('1.0')).toMatch(/1.0/);
    expect(compile('12.34')).toMatch(/12.34/);
  })
  test('string', () => {
    expect(compile('"hello"')).toMatch(/"hello"/);
    expect(compile('`hello`')).toMatch(/`hello`/);
    expect(compile(`'hello'`)).toMatch(/'hello'/);
  })
})

describe("Test objects", () => {
  test('{}', () => {
    expect(compile('{}')).toMatch(/\{\}/);
  })
  test('{x: 1}', () => {
    expect(compile('{x: 1}')).toMatch(/\{x\: ?1\}/);
  })
})