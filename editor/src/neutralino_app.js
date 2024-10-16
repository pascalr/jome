import { getFilenameFromPath } from "./utils"
import { addDockIcon } from "./helpers"

import { renderSkeleton } from "./views/skeleton"
import { registerWindowBar } from "./views/window_bar"
import { registerWindowView } from "./views/window"
import { registerHomePage } from "./views/homepage"
import { registerExplorerView } from "./views/explorer"
import { registerObjectTreeView } from "./views/object_tree"
import { registerDock } from "./views/dock"
import { registerActionsFile } from "./views/actions_file"
import { registerActionsProject } from "./views/actions_project"
import { registerActionsTextSelection } from "./views/actions_text_selection"
import { registerFilesTabs } from "./views/files_tabs"
import { registerEditorView } from "./views/editor"
import { withStateMethods } from "./state"
import { Selection, SELECTION_TYPE } from "./models/selection"
import { registerActionsObjects } from "./views/actions_objects"

const STORAGE_KEY = 'APP'

export const EVENT = {
  FILE_CHANGE: "onFileChange",
  PROJECT_CHANGE: "onProjectChange",
  DOCK_CHANGE: "onDockChange",
  WINDOW_CHANGE: "onWindowChange",
  TEXT_SELECTION_CHANGE: "onTextSelectionChange", // deprecated? onSelect?
  FILE_OPEN: "onFileOpen",
  FILE_CLOSE: "onFileClose",
  DOCUMENT_CHANGE: "onDocumentChange",
  // Waits some time (like 0.5s-1s) that no more changes are done. Maybe a maximum amount of time too. If always changing, then every 5s?
  DOCUMENT_BATCH_CHANGE: "onDocumentBatchChange",
  SELECT: "onSelect"
}

export const WINDOW = {
  HOME: "home",
  EDITOR: "editor",
  // settings
  // help
  // ...
}

class BaseNeutralinoApp {

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

    this.components = []
  }

  async setup(ref) {

    this.rootDOM = ref
    this.selection = new Selection(SELECTION_TYPE.NONE)

    await this.loadFromStorage()

    // skeleton
    renderSkeleton(this.rootDOM)

    // main views
    registerWindowBar(this)
    registerWindowView(this)
    registerHomePage(this)
    registerFilesTabs(this)
    registerEditorView(this)

    // dock views
    registerExplorerView(this)
    registerObjectTreeView(this)
    registerDock(this) // must be last I think

    // action views
    registerActionsObjects(this)
    registerActionsTextSelection(this)
    registerActionsFile(this)
    registerActionsProject(this)

    // workers
    // registerDocumentParser(this)

    this.emit(EVENT.TEXT_SELECTION_CHANGE) // tmp for testing

    // Set the current window
    this.changeWindow(this.data.PROJECT_PATH ? WINDOW.EDITOR : WINDOW.HOME)
    if (this.data.PROJECT_PATH) {
      this.changeProject(this.data.PROJECT_PATH)
    }

    if (this.data.CURRENT_FILEPATH) {
      this.openFile(this.data.CURRENT_FILEPATH)
    }
  }

  registerView(view) {
    this.views.push(view)
    view.setApp(this)
    if (view.setup) {
      view.setup()
    }
  }

  emit(eventHandlerName, ...data) {
    console.debug("Emitting: "+eventHandlerName)
    this.views.forEach(view => {
      if (view[eventHandlerName]) {
        view[eventHandlerName](...data)
      }
    })
  }

  changeProject(path) {
    this.emit(EVENT.PROJECT_CHANGE, {path})
  }

  changeWindow(windowName) {
    this.emit(EVENT.WINDOW_CHANGE, {windowName})
  }

  changeDock(id) {
    this.emit(EVENT.DOCK_CHANGE, {itemId: id})
    // TODO: Maybe save state so reopens when closing and opening app
  }

  addDockIcon(...args) {
    addDockIcon(this, ...args)
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
    this.show(EditorPage)
    // this.emit(EVENT.DOCK_CHANGE, {tabName: SIDEBAR_TABS.EXPLORER})
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
      this.emit(EVENT.FILE_CHANGE, {filepath, content: null})
      return;
    }

    Neutralino.filesystem.readFile(filepath).then(content => {

      this.setData('CURRENT_FILEPATH', filepath)

      let filesOpened = this.getProjectData('FILES_OPENED') || []
      if (!filesOpened.includes(filepath)) {
        this.setProjectData('FILES_OPENED', [filepath, ...filesOpened])
      }

      this.emit(EVENT.FILE_CHANGE, {filepath, content})
      this.emit(EVENT.FILE_OPEN, filepath)
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
    this.emit(EVENT.FILE_CLOSE, filepath)
  }

  registerComponents(components) {
    components.forEach(k => k.register())
    this.components = [...this.components, ...components]
  }

  getObjectComponent(obj) {
    if (!obj.getComponentName) { return null }
    return this.components.find(c => c.componentName === obj.getComponentName())
  }

  select(selection) {
    this.selection = selection
    this.emit(EVENT.SELECT, {selection})
  }
  // When shift clicking or right clicking, try to add the selection to the current selection if of same type
  selectMerge(selection) {
    this.selection = this.selection.merge(selection)
    this.emit(EVENT.SELECT, {selection})
  }

}

export const NeutralinoApp = withStateMethods(BaseNeutralinoApp)
