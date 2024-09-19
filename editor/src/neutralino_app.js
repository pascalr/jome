import { createHomepage } from "./partials/homepage"

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
    await this.loadStorage()

    if (!this.data['CURRENT_FILE']) {
      this.refs.mainPanel.replaceChildren(createHomepage(this))
    }

    if (this.data['PROJECT_PATH']) {

    } else {

    }
  }

  async loadStorage() {
    let keys = await Neutralino.storage.getKeys()
    keys.forEach(async key => {
      this.data[key] = await Neutralino.storage.getData(key)
    })
  }

  getData(key) {
    return this.data[key]
  }

  setData(key, data) {
    console.log('Calling Neutralino.storage.setData', key, data)
    Neutralino.storage.setData(key, data).then().catch(this.handleError)
    this.data[key] = data
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