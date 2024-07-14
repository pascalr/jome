export default function noisyReadToken(Parser) {
  return class extends Parser {
    readToken(code) {
      console.log("Reading a token!")
      return super.readToken(code)
    }
  }
}