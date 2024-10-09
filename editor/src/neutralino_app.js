import { getFilenameFromPath } from "./utils"
import { e } from "./helpers"

import { EditorPage, updateMainPanelContent } from './pages/editor'
import { createSideBar, SIDEBAR_TABS } from "./partials/sidebar"
import { registerExplorer } from "./partials/explorer"
import { registerObjectTree } from "./partials/object_tree"
import { getRef, REF, renderSkeleton } from "./views/skeleton"
import { registerWindowBar } from "./views/window_bar"
import { registerWindowView } from "./views/window"
import { registerHomePage } from "./views/homepage"
import { registerExplorerView } from "./views/explorer"
import { registerObjectTreeView } from "./views/object_tree"

const STORAGE_KEY = 'APP'

export const EVENT = {
  FILE_CHANGE: "onFileChange",
  PROJECT_CHANGE: "onProjectChange",
  DOCK_CHANGE: "onDockChange",
  WINDOW_CHANGE: "onWindowChange"
}

export const WINDOW = {
  HOME: "home",
  EDITOR: "editor",
  // settings
  // help
  // ...
}

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

    this.views = []

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

    // create
    let el = page.create(this)
    // render
    let ref = getRef(this.data.CURRENT_SIDEVIEW && this.data.CURRENT_SIDEVIEW !== SIDEBAR_TABS.HOME ? REF.EDITOR : REF.HOME)
    ref.replaceChildren(el)
    // after render
    if (page.afterRender) {page.afterRender(this)}
  }

  async setup(ref) {

    this.rootDOM = ref

    await this.loadFromStorage()

    registerExplorer(this)
    registerObjectTree(this)

    renderSkeleton(this.rootDOM)

    registerWindowBar(this)
    registerWindowView(this)
    registerHomePage(this)

    registerExplorerView(this)
    registerObjectTreeView(this)

    // this.show(EditorPage)
    this.emit(EVENT.DOCK_CHANGE, {tabName: this.data.CURRENT_SIDEVIEW})

    this.show(EditorPage)

    // Set the current window
    this.changeWindow(this.data.PROJECT_PATH ? WINDOW.EDITOR : WINDOW.HOME)

    if (this.data.CURRENT_FILEPATH) {
      this.openFile(this.data.CURRENT_FILEPATH)
    }
  }

  registerView(view) {
    view.setApp(this)
    if (view.setup) {
      view.setup()
    }
    // FIXME: Remove this
    // Call render from setup if needed
    if (view.render) {
      view.render()
    }
    this.views.push(view)
  }

  emit(eventHandlerName, ...data) {
    this.views.forEach(view => {
      if (view[eventHandlerName]) {
        view[eventHandlerName](...data)
      }
    })
  }

  changeWindow(windowName) {
    this.emit(EVENT.WINDOW_CHANGE, {windowName})
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
    this.emit(EVENT.DOCK_CHANGE, {tabName: sideView.getName()})
  }

  getCurrentSideView() {
    return this.sideViews.find(v => v.getName() === this.data.CURRENT_SIDEVIEW)
  }

  setWindowTitle(title) {
    Neutralino.window.setTitle(title)
  }
  getWindowMode() {
    return NL_MODE
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
    this.emit(EVENT.DOCK_CHANGE, {tabName: SIDEBAR_TABS.EXPLORER})
    this.emit(EVENT.WINDOW_CHANGE, {windowName: WINDOW.EDITOR})
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
      this.emit(EVENT.FILE_CHANGE, null)
      updateMainPanelContent(this, filepath, null)
      return;
    }

    Neutralino.filesystem.readFile(filepath).then(content => {

      this.setData('CURRENT_FILEPATH', filepath)

      let filesOpened = this.getProjectData('FILES_OPENED') || []
      if (!filesOpened.includes(filepath)) {
        this.setProjectData('FILES_OPENED', [filepath, ...filesOpened])
      }

      this.emit(EVENT.FILE_CHANGE, filepath)

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