import {e} from '../utils'

// For use in browser only
export function createWindowBar(app) {

  return e('div', {className: "window_bar"}, [
    (app.getData('CURRENT_FILENAME') ? `${app.getData('CURRENT_FILENAME')} - ` : "") + 
    (app.getData('PROJECT_NAME') ? `${app.getData('PROJECT_NAME')} - ` : "") + 
    "Jome Editor"
  ])
  
}