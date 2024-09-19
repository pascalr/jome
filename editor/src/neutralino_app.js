import { createHomepage } from "./partials/homepage"

const STORAGE_KEY = 'APP'

export class NeutralinoApp {

  constructor() {
    /**
     * Data that is kept when the program is closed.
     * 
     * PROJECT_PATH
     * CURRENT_FILE
     * FILES_OPENED
     */
    this.data = {}

    /**
     * DOM References to the main parts of the applications.
     */
    this.refs = {
      mainPanel: document.getElementById('main-panel')
    }
    // Should validate that all refs exists?
  }

  async setup() {
    await this.loadFromStorage()

    if (!this.data['CURRENT_FILE']) {
      this.refs.mainPanel.replaceChildren(createHomepage(this))
    }

    if (this.data['PROJECT_PATH']) {

    } else {

    }
  }

  async loadFromStorage() {
    try {
      let dataStr = await Neutralino.storage.getData(STORAGE_KEY)
      this.data = JSON.parse(dataStr)
    } catch (err) {
      console.error(err)
    }
  }

  saveToStorage() {
    Neutralino.storage.setData(STORAGE_KEY, JSON.stringify(this.data)).then().catch(this.handleError)
  }

  getData(key) {
    return this.data[key]
  }

  setData(key, data) {
    this.data[key] = data
    this.saveToStorage()
  }

  handleError(error) {
    console.error(error)
  }

  openProject() {

  }

  // Returns entries, a list of paths
  showOpenDialog() {
    Neutralino.os.showOpenDialog().then(entries => {
      let path = entries[0]
      if (path) {
        this.setData('PROJECT_PATH', path)
        console.log('open dialog entries', entries)
      }
    }).catch(this.handleError)
  }

}