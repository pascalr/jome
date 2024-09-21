import {e} from '../utils'

// TODO: A window bar only in the browser. In the app, the window bar is done with Neutralino.

export function createWindowBar(app) {

  return e('div', {className: "window_bar"}, [
    e('span', {className: "active_filename"}), // " - "
    e('span', {className: "project_name", innerText: "WIP"})  // " - Jome Editor"
  ])
  
}