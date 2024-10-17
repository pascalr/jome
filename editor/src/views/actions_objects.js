import {e} from '../helpers'

import { ActionView } from '../view'

class ActionsObjects extends ActionView {

  handleInputChange(item, attr, evt) {

  }

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
        let attr = attrs[attrName]
        el.appendChild(e('div', {className: "object-edit-field"}, [
          e('label', {htmlFor: fieldId}, [attrName+': ']),
          e('input', {
            id: fieldId,
            type: getInputTypeForAttr(attr),
            value: item.getAttribute(attrName),
            oninput: (evt) => this.handleInputChange(item, attr, evt)})
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

function getInputTypeForAttr(attr) {
  // TODO: All types
  if (attr.type === 'int' || attr.type === 'float') {
    return 'number'
  } else if (attr.type === 'bool') {
    return 'checkbox'
  }
  return 'text'
}

export function registerActionsObjects(app) {
  app.registerView(new ActionsObjects())
}