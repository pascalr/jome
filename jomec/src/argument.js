/**
 * An argument given to a function. Stores all the information about it.
 */
class Argument {
  constructor(name) {
    this.name = name
    this.type = null // A string with the type of the argument
    this.unit = null
    this.along = null
    this.defaultValue = null
    this.akas = []
    this.deconstructed = []
  }

  isDeconstructed() {
    return !!this.deconstructed.length
  }

  compile() {
    return this.name
  }
}

module.exports = Argument