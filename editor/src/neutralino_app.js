import { parse } from './parser'
import { JomeDocument } from "./models/jome_document"
import { forEach } from "./utils"
import { loadFileProseMirrorEditor } from './prosemirror_editor'

import { getFilenameFromPath } from "./utils"
import { e } from "./helpers"

import { HomePage } from './pages/homepage'
import { EditorPage } from './pages/editor'

const STORAGE_KEY = 'APP'

function joinPaths(path1, path2) {
  // FIXME: On windows it's not /, path.join not working here because not bundling for node
  // TODO: Get info from the system to know what to use
  return path1+'/'+path2
}

// const EPHEMERAL_DATA_KEYS = {
//   PROJECT_NAME,
//   PROJECT_PATH,
// }

export class NeutralinoApp {

  constructor() {
    /**
     * Data that is kept when the program is closed.
     * 
     * PROJECT_NAME
     * PROJECT_PATH
     * RECENT
     * RECENT_FOLDERS deprecated
     * RECENT_FILES deprecated
     * CURRENT_FILENAME
     * CURRENT_FILEPATH
     * FILES_OPENED_BY_PROJECT
     */
    this.data = {}

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
    this.show(HomePage)
  }

  updateWindowBar() {
    let txt = (this.getData('CURRENT_FILENAME') ? `${this.getData('CURRENT_FILENAME')} - ` : "") + 
      (this.getData('PROJECT_NAME') ? `${this.getData('PROJECT_NAME')} - ` : "") + 
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
      this.setData('PROJECT_NAME', data.name)
      this.setData('PROJECT_PATH', data.path)
      this.setData('CURRENT_FILENAME', null)
      this.setData('CURRENT_FILEPATH', null)
    } else {
      this.setData('PROJECT_NAME', null)
      this.setData('PROJECT_PATH', null)
      this.setData('CURRENT_FILENAME', data.name)
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

  isFolderExpanded() {
    return false // TODO
  }

  openFile(filepath) {

    Neutralino.filesystem.readFile(filepath).then(content => {
      let name = getFilenameFromPath(filepath)
      // update state
      //_opened_files[filepath] = file.content
      //_active_filepath = filepath

      // update files tabs
      let filesTabs = document.getElementById("files_tabs")
      forEach(filesTabs.children, c => {
        if (c.classList.contains("active")) {c.classList.remove("active")}
      })
      let btn = document.createElement('button')
      btn.className = "tab-button active"
      btn.innerText = name
      filesTabs.prepend(btn)

      // update active in explorer tree
      // FIXME: DON'T DO THIS HERE. THE SELCTION SHOULD BE HANDLED ELSEWHERE AND IT IS THE SELECTION THAT SHOULD CALL openFile when needed
      forEach(document.querySelectorAll("#explorer-tree .leaf[selected]"), el => {
        el.removeAttribute('selected')
        // el.classList.remove("active")
      })
      const leaf = document.querySelector(`#explorer-tree .leaf[data-path="${filepath}"]`);
      leaf.setAttribute('selected', "")

      // update active filename
      forEach(document.getElementsByClassName('active_filename'), el => {
        el.innerText = name; 
      });

      // update the main source view
      let doc = new JomeDocument(filepath, content)
      let parts = parse(doc)
      console.log("parts", parts)
      loadFileProseMirrorEditor('#prosemirror_editor', doc)
      // document.getElementById('output-editor').innerHTML = renderOutputCode(doc, parts)
      // document.getElementById('notebook-editor').innerHTML = renderNotebookView(doc, parts)
    }).catch(this.handleError)
  }

}