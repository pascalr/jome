
import {e} from '../utils'

// A list of latest projects opened.
// A list of latest files opened.
// A list of templates.
function createHomepageList(app) {
  // TODO: Read the history from storage
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
  // TODO: Read the history from storage
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
  return e('div', {style: "max-width: 800px; margin: auto;"}, [
    e('h1', {innerText: "Jome Editor - v0.0.1"}),
    e('div', {style: "display: flex; align-items: center;"}, [
      e('h2', {innerText: "Recent projects", style: "margin-right: 0.5em;"}),
      e('div', {}, [e('button', {innerText: "Open", className: "title-side-button", onclick: () => app.showOpenFolderDialog()})]),
    ]),
    createHomepageList(app),
    e('div', {style: "display: flex; align-items: center;"}, [
      e('h2', {innerText: "Recent files", style: "margin-right: 0.5em;"}),
      e('div', {}, [e('button', {innerText: "Open", className: "title-side-button", onclick: () => app.showOpenFileDialog()})]),
    ]),
    createHomepageList(app),
    e('h2', {innerText: "Create project from template"}),
    e('p', {innerText: "No template implemented yet"}),
  ])
}

//e('div', {}, [
//  e('button', {innerText: "New File", onclick: () => app.showSaveDialog()}),
//  e('button', {innerText: "New Project", onclick: () => app.showSaveDialog()}),
//  e('button', {innerText: "Open", onclick: () => app.showOpenFileDialog()}),
//  e('button', {innerText: "Open Folder", onclick: () => app.showOpenFolderDialog()}),
//]),