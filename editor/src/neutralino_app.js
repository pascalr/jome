import { getFilenameFromPath } from "./utils"
import { e } from "./helpers"

import { HomePage } from './pages/homepage'
import { EditorPage, updateMainPanelContent } from './pages/editor'

const STORAGE_KEY = 'APP'

export class NeutralinoApp {

  constructor() {
    /**
     * Data that is kept when the program is closed.
     * 
     * PROJECT_PATH
     * RECENT
     * CURRENT_FILEPATH
     * FILES_OPENED_BY_PROJECT
     */
    this.data = {}

    this.foldersExpanded = {}

    this.rootDOM = document.getElementById('root')

    /**
     * DOM References to the main parts of the applications.
     */
    this.refs = {
      mainPanel: document.getElementById('main-panel'),
      explorerTree: document.getElementById('explorer-tree'),
    }
    // Should validate that all refs exists?
  }

  show(page) {

    this.updateWindowBar()

    // create
    let el = page.create(this)
    // render
    this.rootDOM.replaceChildren(el)
    // after render
    if (page.afterRender) {page.afterRender(this)}
  }

  async setup() {
    await this.loadFromStorage()

    if (NL_MODE === 'browser') {
      document.body.prepend(e('div', {id: "window_bar"}))
    }

    this.show(this.data.PROJECT_PATH ? EditorPage : HomePage)
  }

  updateWindowBar() {
    let name = getFilenameFromPath(this.getData('CURRENT_FILEPATH'))
    let projectName = getFilenameFromPath(this.getData('PROJECT_PATH'))
    let txt = (name ? `${name} - ` : "") + 
      (projectName ? `${projectName} - ` : "") + 
      "Jome Editor"
    
    if (NL_MODE === 'window') {
      Neutralino.window.setTitle(txt)
    } else {
      let el = document.getElementById('window_bar')
      el.innerText = txt
    }

  }

  async listDirectory(path) {
    let subs = await Neutralino.filesystem.readDirectory(path)
    let sorted = subs.sort((a,b) => {
      if (a.type === b.type) {
        return a.entry.localeCompare(b.entry)
      }
      return a.type === 'FILE'
    })
    return sorted
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
    Neutralino.storage.setData(STORAGE_KEY, JSON.stringify(this.data, null, 2)).then().catch(this.handleError)
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

  openFileOrProject(data) {
    if (data.isDirectory) {
      this.setData('PROJECT_PATH', data.path)
      this.setData('CURRENT_FILEPATH', null)
    } else {
      this.setData('PROJECT_PATH', null)
      this.setData('CURRENT_FILEPATH', data.path)
    }
    this.show(EditorPage)
  }

  openPath(path) {
    if (path) {
      Neutralino.filesystem.getStats(path).then(stats => {
        let data = {...stats, path, name: getFilenameFromPath(path)}
        this.setData('RECENT', [data, ...(this.data.RECENT || []).slice(0, 9)])
        this.openFileOrProject(data)
      }).catch(this.handleError)
    }
  }

  showOpenFileDialog() {
    // Returns entries, a list of paths
    Neutralino.os.showOpenDialog().then(entries => {
      let path = entries[0]
      this.openPath(path)
    }).catch(this.handleError)
  }

  showOpenProjectDialog() {
    Neutralino.os.showFolderDialog().then(this.openPath.bind(this)).catch(this.handleError)
  }

  showSaveDialog() {
    Neutralino.os.showSaveDialog().then(entry => {
      console.log('TODO save: ', entry)
    }).catch(this.handleError)
  }

  toggleDirectoryExpansion(path) {
    this.foldersExpanded[path] = !this.foldersExpanded[path]
  }
  isFolderExpanded(path) {
    return !!this.foldersExpanded[path]
  }

  getProjectData(key) {
    this.data.PROJECTS ||= {}
    this.data.PROJECTS[this.data.PROJECT_PATH] ||= {}
    return this.data.PROJECTS[this.data.PROJECT_PATH][key]
  }

  setProjectData(key, data) {
    this.data.PROJECTS ||= {}
    this.data.PROJECTS[this.data.PROJECT_PATH] ||= {}
    this.data.PROJECTS[this.data.PROJECT_PATH][key] = data
    this.saveToStorage()
  }

  openFile(filepath) {

    if (!filepath) {
      this.updateWindowBar()
      updateMainPanelContent(this, filepath, null)
      return;
    }

    Neutralino.filesystem.readFile(filepath).then(content => {

      this.data.CURRENT_FILEPATH = filepath

      let filesOpened = this.getProjectData('FILES_OPENED') || []
      if (!filesOpened.includes(filepath)) {
        this.setProjectData('FILES_OPENED', [filepath, ...filesOpened])
      }

      this.updateWindowBar()

      updateMainPanelContent(this, filepath, content)
    }).catch(this.handleError)
  }

  closeFile(filepath) {
    let filesOpened = this.getProjectData('FILES_OPENED') || []
    let filtered = filesOpened.filter(f => f !== filepath)
    if (filepath === this.data.CURRENT_FILEPATH) {
      this.data.CURRENT_FILEPATH = filtered[0] // TODO: Keep an history of the files opened, open the previous one
    }
    this.setProjectData('FILES_OPENED', filtered)
    this.openFile(this.data.CURRENT_FILEPATH)
  }

}