import { e } from "../helpers";
import { capitalize } from "../utils";
import { JomeComponent } from "./abstract/JomeComponent";

export class Field extends JomeComponent {

  static componentName = "field"

  static get observedAttributes() {
    return ['name', 'type', 'unit', 'enableEquivalentUnits', 'value', 'comment'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }
  
  connectedCallback() {

    let el = e('div', {}, [
      e('input', {id: this.name || undefined, type: this.type||'text', value: this.value})
    ])
    if (this.name) {
      el.prepend(e('label', {for: this.name}, [capitalize(this.name)+': ']))
    }
    if (this.enableEquivalentUnits) {
      // TODO
    }
    if (this.unit) {
      el.appendChild(e('span', {}, [' '+this.unit]))
    }
    if (this.comment) {
      el.appendChild(e('span', {style: "font-size: 0.8em; color: gray; margin-left: 1.5em;"}, [' '+this.comment]))
    }

    this.replaceChildren(el)
  }

}