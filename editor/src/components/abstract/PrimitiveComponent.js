// Components that already exists like <rect>, <text>...

export class PrimitiveComponent {

  static get allAttributes() {
    return {...this.ownAttributes}
  }

}