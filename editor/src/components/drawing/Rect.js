export class Rect extends HTMLElement {

  static get observedAttributes() {
    return ['x', 'y', 'width', 'height'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }

}