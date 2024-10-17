import { e } from "../helpers";
import { JomeComponent } from "./abstract/JomeComponent";

export class Calc extends JomeComponent {

  static componentName = "calc"

  static ownAttributes = {
    name: {
      type: "string",
    },
    formula: {
      type: "string",
    },
    comment: {
      type: "int",
    },
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'});
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
      el.prepend(e('label', {for: this.name}, [this.name+' = ']))
    }
    if (this.comment) {
      el.appendChild(e('span', {style: "font-size: 0.8em; color: gray; margin-left: 1.5em;"}, [' '+this.comment]))
    } else if (this.formula) {
      el.appendChild(e('span', {style: "font-size: 0.8em; color: gray; margin-left: 1.5em;"}, [' ('+this.formula+')']))
    }

    this.shadowRoot.replaceChildren(el)
  }

}