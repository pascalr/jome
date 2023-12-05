const {parse} = require('./parser.js')
const {tokenize} = require('./tokenizer.js')

describe("Test operations", () => {
  test('Test operation 1 + 2', () => {
    let ast = parse(tokenize("1+2"))[0]
    expect(ast?.raw()).toBe('+')
    expect(ast?.children?.[0]?.raw()).toBe('1')
    expect(ast?.children?.[0]?.raw()).toBe('2')
  })
})