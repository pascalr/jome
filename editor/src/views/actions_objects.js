import {e} from '../helpers'
import { EVENT } from '../neutralino_app'
import { createObjectLabelParts } from '../partials/object_label';

import { ActionView } from '../view'

class ActionsObjects extends ActionView {

  handleInputChange(item, attrName, attr, evt) {
    this.app.emit(EVENT.UPDATE_FIELD, {obj: item, field: attrName, value: evt.target.value})
  }

  render() {
    // TODO: Handle nodeList too, it would be nice to be able to change the field of multiple nodes at once
    if (!this.selection.isNode) {
      this.getRef().replaceChildren();
      return;
    }

    let path = this.app.getProjectPath()
    if (!path) {return this.getRef().replaceChildren()}

    let node = this.selection.node
    let component = this.app.getTagDefinition(node)

    let el = e('div', {}, [
      e('div', {className: "panel-main-header"}, createObjectLabelParts(node))
    ])

    if (component) {
      let attrs = component.ownAttributes
      Object.keys(attrs).forEach(attrName => {
        let fieldId = 'obj-field-'+attrName
        let attr = attrs[attrName]
        el.appendChild(e('div', {className: "object-edit-field"}, [
          e('label', {htmlFor: fieldId}, [attrName+': ']),
          e('input', {
            id: fieldId,
            type: getInputTypeForAttr(attr),
            value: node.getAttribute(attrName),
            onchange: (evt) => this.handleInputChange(node, attrName, attr, evt)})
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