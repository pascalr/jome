import {e} from '../helpers'

import { ActionView } from '../view'

class ActionsObjects extends ActionView {

  render() {
    let path = this.app.getProjectPath()
    if (!path) {return this.getRef().replaceChildren()}

    console.log('selection', this.selection)

    let el = e('div', {}, [
      e('div', {className: "panel-main-header"}, this.selection.getLabelParts())
    ])

    let item = this.selection.getItem()
    let component = this.app.getObjectComponent(item)
    if (component) {
      let attrs = component.ownAttributes
      console.log('here item', item)
      console.log('here attrs', attrs)
      Object.keys(attrs).forEach(attrName => {
        let fieldId = 'obj-field-'+attrName
        el.appendChild(e('div', {className: "object-edit-field"}, [
          e('label', {for: fieldId}, [attrName+': ']),
          e('input', {id: fieldId, type: 'text', value: item.getAttribute(attrName)})
        ]))
      })
    }
    
    this.getRef().replaceChildren(el)
  }

  onSelect({selection}) {
    this.selection = selection
    this.render()
  }

}

export function registerActionsObjects(app) {
  app.registerView(new ActionsObjects())
}