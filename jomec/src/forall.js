const {stringToPureJs} = require("jome-lib/formatting")

// class FuncRef {
//   constructor(name, filepath, isDefault) {
//     this.name = name
//     this.filepath = filepath
//     this.isDefault = isDefault
//   }
//}

// Define the defaults forall
const DEFAULT_FORALLS = {
  sh: {
    wrap: ["execSh"],
    imports: {execSh: {from: 'jome-lib/execSh', default: true}}
  },
  md: {
    wrap: ["mdToHtml"],
    imports: {mdToHtml: {from: 'jome-lib/mdToHtml', default: true}}
  },
  js: {
    chain: [stringToPureJs],
    imports: {mdToHtml: {from: 'jome-lib/mdToHtml', default: true}}
  },
}

module.exports = {
  DEFAULT_FORALLS
}