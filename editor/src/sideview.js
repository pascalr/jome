class View {

  constructor() {
    this.subviews = []
    this.active = true
  }

  generate() {
    // Generate the elements needed
  }

  isActive() {
    return this.active
  }

}

export class SideView {

  setRef(ref) {
    this.ref = ref
  }

  getRef() {
    return this.ref
  }

  updateRef() {

  }

  update() {

  }
  
}