export function withStateMethods(klass) {

  klass.prototype.getProjectPath = function() {
    return this.data.PROJECT_PATH
  }

  klass.prototype.getCurrentFilepath = function() {
    return this.data.CURRENT_FILEPATH
  }

  return klass
}