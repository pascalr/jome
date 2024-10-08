import { getFilenameFromPath } from "./utils"
import { e } from "./helpers"

import { HomePage } from './pages/homepage'
import { EditorPage, updateMainPanelContent } from './pages/editor'
import { createSideBar, SIDEBAR_TABS } from "./partials/sidebar"
import { registerExplorer } from "./partials/explorer"
import { registerObjectTree } from "./partials/object_tree"
import { createSkeleton } from "./views/skeleton"

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
     * CURRENT_SIDEVIEW
     */
    this.data = {}

    this.foldersExpanded = {}

    this.rootDOM = null

    this.sideViews = []

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

  async setup(ref) {

    this.rootDOM = ref

    await this.loadFromStorage()

    registerExplorer(this)
    registerObjectTree(this)

    this.rootDOM.replaceChildren(createSkeleton())

    // TODO: Window bar should be a view on it's own
    this.updateWindowBar()

    // this.show(this.data.CURRENT_SIDEVIEW && this.data.CURRENT_SIDEVIEW !== SIDEBAR_TABS.HOME ? EditorPage : HomePage)

    // if (this.data.CURRENT_FILEPATH) {
    //   this.openFile(this.data.CURRENT_FILEPATH)
    // }
  }

  registerSideView(sideView) {
    this.sideViews.push(sideView)
  }

  changeSideView(sideView) {
    this.setData("CURRENT_SIDEVIEW", sideView.getName())
    let ref = document.getElementById('split-0')
    if (ref) {
      ref.replaceChildren(...createSideBar(this))
    }
  }

  getCurrentSideView() {
    return this.sideViews.find(v => v.getName() === this.data.CURRENT_SIDEVIEW)
  }

  updateWindowBar() {
    let name = getFilenameFromPath(this.getData('CURRENT_FILEPATH'))
    let projectName = getFilenameFromPath(this.getData('PROJECT_PATH'))
    let txt = (name ? `${name} - ` : "") + 
      (projectName ? `${projectName} - ` : "") + 
      "Jome Editor"
    
    if (NL_MODE === 'window') {
      Neutralino.window.setTitle(txt)
      let el = document.getElementById('window_bar')
      el.style.display = "none"
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
    this.setData('CURRENT_SIDEVIEW', SIDEBAR_TABS.EXPLORER)
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

  getDocument() {
    let filepath = this.data.CURRENT_FILEPATH
    // TODO
  }

  // addListener(eventType, listenerId, callback) {

  // }

  openFile(filepath) {

    if (!filepath) {
      this.updateWindowBar()
      updateMainPanelContent(this, filepath, null)
      return;
    }

    Neutralino.filesystem.readFile(filepath).then(content => {

      this.setData('CURRENT_FILEPATH', filepath)

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