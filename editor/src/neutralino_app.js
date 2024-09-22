import { parse } from './parser'
import { JomeDocument } from "./jome_document"
import { createHtmlTree } from "./lib/renderHtmlTree"
import { createNoPageOpened } from "./partials/no_page_opened"
import { forEach } from "./utils"
import { loadFileProseMirrorEditor } from './prosemirror_editor'

const STORAGE_KEY = 'APP'







import { getFilenameFromPath } from "./utils"
import { createHomepage } from './pages/homepage'
import { createWindowBar } from './partials/window_bar'

function logError(error) {
  console.error(error)
}

function loadFile(filepath, callback) {
  Neutralino.filesystem.readFile(filepath).then(content => {
    callback({name: getFilenameFromPath(filepath), path: filepath, content})
  }).catch(logError)
}

function joinPaths(path1, path2) {
  // FIXME: On windows it's not /, path.join not working here because not bundling for node
  // TODO: Get info from the system to know what to use
  return path1+'/'+path2
}

function entryToBranch(entry) {
  return {name: entry.entry, path: entry.path, type: entry.type === "DIRECTORY" ? 'directory' : 'file', children: []}
}

// TODO: Only read directories that are opened. I have barely nothing in my project, but still have over 4000 files because of node_modules...
async function getDirectoryTreeWIP(dirPath) {

  let subs = await Neutralino.filesystem.readDirectory(dirPath)
  let sorted = subs.sort((a,b) => {
    if (a.type === b.type) {
      return a.entry.localeCompare(b.entry)
    }
    return a.type === 'FILE'
  })

  console.log('subs', subs)
  console.log('sorted', sorted)

  return {
    name: 'WIP',
    path: dirPath,
    type: 'directory',
    children: sorted.map(s => entryToBranch(s))
  }
}

function loadFileTree(callback) {
  return getDirectoryTreeWIP('.').then(callback).catch(logError)
  //return getDirectoryTree('.').then(callback).catch(logError)
  // Neutralino.filesystem.readDirectory('.', {recursive: true}).then(callback).catch(logError)
}


function openFile(filepath) {
  loadFile(filepath, (file) => {
    console.log('file', file)
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
    btn.innerText = file.name
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
      el.innerText = file.name; 
    });

    // update the main source view
    let doc = new JomeDocument(filepath, file.content)
    let parts = parse(doc)
    console.log("parts", parts)
    loadFileProseMirrorEditor('#prosemirror_editor', doc)
    // document.getElementById('output-editor').innerHTML = renderOutputCode(doc, parts)
    // document.getElementById('notebook-editor').innerHTML = renderNotebookView(doc, parts)
  })
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
     * CURRENT_FILENAME
     * FILES_OPENED
     * DIR_LISTING // Used to know what's under a folder and to know if a folder is opened or not (remove the key when closing the folder, maybe sometimes a little less efficient, but simpler)
     */
    this.data = {}

    /**
     * DOM References to the main parts of the applications.
     */
    this.refs = {
      mainPanel: document.getElementById('main-panel'),
      explorerTree: document.getElementById('explorer-tree')
    }
    // Should validate that all refs exists?
  }

  async setup() {
    await this.loadFromStorage()

    // TODO: A window bar only in the browser. In the app, the window bar is done with Neutralino.

    let pageEls = []
    if (NL_MODE === 'browser') {
      pageEls.push(createWindowBar(this))
    }
    pageEls.push(createHomepage(this))

    document.body.replaceChildren(...pageEls)

    return;

    if (!this.data['CURRENT_FILENAME']) {
      this.refs.mainPanel.replaceChildren(createNoPageOpened(this))
    }

    // Load the navigation tree
    if (this.data['PROJECT_PATH']) {
      await this.listDirectory(this.data['PROJECT_PATH'])
      loadFileTree(tree => {
        // explorerList.innerHTML = renderHtmlTree(tree)
        this.refs.explorerTree.replaceChildren(createHtmlTree(tree, leaf => {
          return {id: leaf.path, className: "leaf", "data-path": leaf.path, onclick: () => {
            openFile(leaf.path)
          }}
        }))
      })
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

    this.data['DIR_LISTING'] = this.data['DIR_LISTING'] || {}
    this.data['DIR_LISTING'][path] = sorted
    this.saveToStorage() // OPTIMIZE: Probably not good to do this here
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

  openProject() {

  }

  showOpenFileDialog() {
    // Returns entries, a list of paths
    Neutralino.os.showOpenDialog().then(entries => {
      let path = entries[0]
      if (path) {
        this.setData('PROJECT_PATH', path)
        console.log('open dialog entries', entries)
      }
    }).catch(this.handleError)
  }

  showOpenProjectDialog() {
    Neutralino.os.showFolderDialog().then(path => {
      if (path) {
        let name = getFilenameFromPath(path)
        this.setData('PROJECT_NAME', name)
        this.setData('PROJECT_PATH', path)
      }
    }).catch(this.handleError)
  }

  showSaveDialog() {
    Neutralino.os.showSaveDialog().then(entry => {
      console.log('TODO save: ', entry)
    }).catch(this.handleError)
  }

}