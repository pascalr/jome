import {e} from '../utils'

export function createHomepage(app) {
  return e('div', {}, [
    e('div', {className: "homepage-btns"}, [
      e('button', {innerText: "New", onclick: () => {}}),
      e('button', {innerText: "Open", onclick: () => app.showOpenDialog()}),
    ]),
    e('h2', {innerText: "Previously opened:"}),
    e('p', {innerText: "No folder previously opened."}),
    e('h2', {innerText: "Templates:"}),
    e('p', {innerText: "No template found."}),
    e('a', {innerText: "Add templates"}),
  ])
}