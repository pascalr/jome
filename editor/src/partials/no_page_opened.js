import {e} from '../helpers'

// The page you see when there is no file opened.
export function createNoPageOpened(app) {
  return e('div', {}, [
    e('div', {className: "homepage-btns"}, [
      e('button', {innerText: "New", onclick: () => app.showSaveDialog()}),
      e('button', {innerText: "Open File", onclick: () => app.showOpenFileDialog()}),
      e('button', {innerText: "Open Folder", onclick: () => app.showOpenFolderDialog()}),
    ]),
    e('h2', {innerText: "Previously opened:"}),
    e('p', {innerText: "No folder previously opened."}),
    e('h2', {innerText: "Templates:"}),
    e('p', {innerText: "No template found."}),
    e('a', {innerText: "Add templates"}),
  ])
}