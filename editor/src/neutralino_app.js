export class NeutralinoApp {

  handleError(error) {
    console.error(error)
  }

  // Returns entries, a list of paths
  showOpenDialog() {
    Neutralino.os.showOpenDialog().then(entries => {
      console.log('open dialog entries', entries)
    }).catch(this.handleError)
  }

}