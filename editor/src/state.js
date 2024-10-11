// How about simply persisting the whole state when closing the app?
// Save at every state change?

// Maybe use SQLite, this way save every change in an efficient way instead? Premature optimization for now.

const APP_DATA = {
  PROJECT_PATH: {
    get: 'getProjectPath',
    persist: true
  },
  CURRENT_FILEPATH: {
    get: 'getCurrentFilepath',
    persist: true
  },
  RECENT: {
    get: 'getRecentPathsOpened',
    persist: true
  },
}

const PROJECT_DATA = {
  FILES_OPENED: {
    get: 'getProjectFilesOpened',
    persist: true
  }
}

export function withStateMethods(klass) {

  klass.prototype.getProjectPath = function() {
    return this.data.PROJECT_PATH
  }

  klass.prototype.getCurrentFilepath = function() {
    return this.data.CURRENT_FILEPATH
  }

  return klass
}