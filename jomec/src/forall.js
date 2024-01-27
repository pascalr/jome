// Define the defaults forall
const DEFAULT_FORALLS = {
  sh: {
    wrap: ["execSh"],
    imports: {execSh: {from: 'jome-lib/execSh', default: true}}
  }
}

module.exports = {
  DEFAULT_FORALLS
}