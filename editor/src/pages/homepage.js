
import {e} from '../helpers'
import { getFilenameFromPath } from '../utils'

// A list of latest projects opened.
// A list of latest files opened.
// A list of templates.
function createHomepageList(app, list) {
  return e('div', {className: "homepage-list"}, [
    e('ul', {}, list.map(createHomepageItem)),
    e('a', {innerText: "Show more..."})
  ])
}

function createHomepageItem(path) {
  let name = getFilenameFromPath(path)
  return e('li', {}, [
    e('div', {}, [name]),
    e('div', {}, [path]),
  ])
}

/*
TODO: Tabs:
| Latest | Projects | Files | Templates |

Or maybe show them all, and scroll to see all, and only show 2 or 3 latest items per category and a button see more.

I like that.
*/

// The page you see when there is no file opened.
export function createHomepage(app) {

  // TODO: Read the history from storage
  let fileList = app.getData('RECENT_FILES') || []
  let projectList = app.getData('RECENT_FOLDERS') || []

  return e('div', {style: "max-width: 800px; margin: auto;"}, [
    e('h1', {}, ["Jome Editor - v0.0.1"]),
    e('div', {style: "display: flex; align-items: center;"}, [
      e('h2', {style: "margin-right: 0.5em;"}, ["Recent folders"]),
      e('div', {}, [e('button', {className: "title-side-button", onclick: () => app.showOpenProjectDialog()}, ["Open"])]),
    ]),
    projectList.length ? createHomepageList(app, projectList) : e('p', {}, ["No folders opened recently."]),
    e('div', {style: "display: flex; align-items: center;"}, [
      e('h2', {style: "margin-right: 0.5em;"}, ["Recent files"]),
      e('div', {}, [e('button', {className: "title-side-button", onclick: () => app.showOpenFileDialog()}, ["Open"])]),
    ]),
    fileList.length ? createHomepageList(app, fileList) : e('p', {}, ["No files opened recently."]),
    e('h2', {}, ["Create project from template"]),
    e('p', {}, ["No template implemented yet"]),
  ])
}

//e('div', {}, [
//  e('button', {innerText: "New File", onclick: () => app.showSaveDialog()}),
//  e('button', {innerText: "New Project", onclick: () => app.showSaveDialog()}),
//  e('button', {innerText: "Open", onclick: () => app.showOpenFileDialog()}),
//  e('button', {innerText: "Open Folder", onclick: () => app.showOpenFolderDialog()}),
//]),

export const HomePage = {
  create: createHomepage,
}