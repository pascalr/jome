
import {e} from '../utils'

// A list of latest projects opened.
// A list of latest files opened.
// A list of templates.
function createHomepageList(app, msg) {
  return e('div', {}, [
    e('ul', {}, [
      createHomepageItem(app),
      createHomepageItem(app),
      createHomepageItem(app),
    ]),
    e('a', {innerText: "Show more..."})
  ])
}

function createHomepageItem(app) {
  return e('li', {innerText: "WIP"})
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
  let fileList = []
  let projectList = []

  return e('div', {style: "max-width: 800px; margin: auto;"}, [
    e('h1', {}, ["Jome Editor - v0.0.1"]),
    e('div', {style: "display: flex; align-items: center;"}, [
      e('h2', {style: "margin-right: 0.5em;"}, ["Recent projects"]),
      e('div', {}, [e('button', {className: "title-side-button", onclick: () => app.showOpenProjectDialog()}, ["Open"])]),
    ]),
    projectList.length ? createHomepageList(app, projectList) : e('p', {}, ["No recent projects opened."]),
    e('div', {style: "display: flex; align-items: center;"}, [
      e('h2', {style: "margin-right: 0.5em;"}, ["Recent files"]),
      e('div', {}, [e('button', {className: "title-side-button", onclick: () => app.showOpenFileDialog()}, ["Open"])]),
    ]),
    fileList.length ? createHomepageList(app, fileList, e1) : e('p', {}, ["No recent files opened."]),
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