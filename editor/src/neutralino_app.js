import { parse } from './parser'
import { JomeDocument } from "./jome_document"
import { createHtmlTree } from "./lib/renderHtmlTree"
import { loadFile, loadFileTree } from "./neutralino_client"
import { createHomepage } from "./partials/homepage"
import { forEach } from "./utils"
import { loadFileProseMirrorEditor } from './prosemirror_editor'

const STORAGE_KEY = 'APP'






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







export class NeutralinoApp {

  constructor() {
    /**
     * Data that is kept when the program is closed.
     * 
     * PROJECT_PATH
     * CURRENT_FILE
     * FILES_OPENED
     * NAV_TREE_FOLDERS_OPENED
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

    if (!this.data['CURRENT_FILE']) {
      this.refs.mainPanel.replaceChildren(createHomepage(this))
    }

    // Load the navigation tree
    if (this.data['PROJECT_PATH']) {
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