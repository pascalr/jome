export class LexicalEnvironment {
  constructor(outerEnvironment = null, debug = null) {
    // console.warn('Creating lexical environment')
    this.bindings = {};
    this.outer = outerEnvironment;
    this.debug = debug
  }

  hasBinding(name) {
    return this.getBindingValue(name) !== undefined
  }

  // Method to add variable bindings to the environment
  addBinding(name, value) {
    this.bindings[name] = value;
  }

  // Check if the variable is already declared.
  // If so, then modify it's value
  // Otherwise, add variable binding to the environment 
  setBindingValue(name, value) {
    let owner = this.getBindingEnv(name)?.bindings || this.bindings
    owner[name] = value;
  }

  getBindingEnv(name) {
    if (name in this.bindings) {
      return this
    } else if (this.outer) {
      return this.outer.getBindingEnv(name)
    }
    return null
  }

  // Method to get the value of a variable from the environment
  getBindingValue(name) {
    return (this.getBindingEnv(name)?.bindings || this.bindings)[name]
    // throw new ReferenceError(`${name} is not defined.`);
  }

  getBindingOwner(name) {
    return (this.getBindingEnv(name)?.bindings || this.bindings)
    // throw new ReferenceError(`${name} is not defined.`);
  }
}