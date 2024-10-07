import { e } from "../helpers";
import { capitalize } from "../utils";
import { JomeComponent } from "./JomeComponent";

export class Calc extends JomeComponent {

  static componentName = "calc"

  static get observedAttributes() {
    return ['name', 'formula', 'comment'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }
  
  connectedCallback() {

    let field = e('input', {id: this.name || undefined, type: this.type||'text', value: 'TODO'})
    field.setAttribute('readonly', true)

    let el = e('div', {}, [field])
    if (this.name) {
      el.prepend(e('label', {for: this.name}, [capitalize(this.name)+': ']))
    }
    if (this.comment) {
      el.appendChild(e('span', {style: "font-size: 0.8em; color: gray; margin-left: 1.5em;"}, [' '+this.comment]))
    }

    this.replaceChildren(el)
  }

}