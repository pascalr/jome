
import {e, svgE} from '../helpers'
import { getFilenameFromPath } from '../utils'

import IconFolder from '../../assets/icons/folder2-open.svg'
import IconFile from '../../assets/icons/file-earmark.svg'

function sideIcon(icon) {
  let el = svgE(icon)
  el.setAttribute('width', 36)
  el.setAttribute('height', 36)
  el.style = "margin-right: 0.8em;"
  return el
}

// A list of latest projects opened.
// A list of latest files opened.
// A list of templates.
function createHomepageList(app, list) {
  return e('div', {className: "homepage-list"}, [
    e('ul', {}, list.map(data => createHomepageItem(app, data))),
    e('a', {innerText: "Show more..."})
  ])
}

function openRecent(app, data) {
  // TODO: Move the item to the top of RECENT
  app.openFileOrProject(data)
}

function createHomepageItem(app, data) {
  // TODO: Show last modified data, wait, the last modified here is stored, which is not true if modified since
  // Maybe show size of item?
  return e('li', {style: "cursor: pointer;", onclick: () => {openRecent(app, data)}}, [
    e('div', {style: "display: flex;"}, [
      e('div', {}, [sideIcon(data.isDirectory ? IconFolder : IconFile)]),
      e('div', {}, [
        e('div', {}, [data.name]),
        e('div', {className: "path"}, [data.path]),
      ])
    ])
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

  let list = app.getData('RECENT') || []

  return e('div', {style: "max-width: 800px; margin: auto;"}, [
    e('h1', {}, ["Jome Editor - v0.0.1"]),
    e('div', {style: "display: flex; align-items: center;"}, [
      e('div', {}, [e('button', {className: "title-side-button", onclick: () => app.showOpenProjectDialog()}, ["Open Folder"])]),
      e('div', {}, [e('button', {className: "title-side-button", onclick: () => app.showOpenFileDialog()}, ["Open File"])]),
      e('div', {}, [e('button', {className: "title-side-button", onclick: () => app.showSaveDialog()}, ["New"])]),
    ]),
    e('h2', {style: "margin-right: 0.5em;"}, ["Recent"]),
    list.length ? createHomepageList(app, list) : e('p', {}, ["No files or folders opened recently."]),
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