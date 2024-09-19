export class NeutralinoApp {

  constructor() {
    this.data = {}
  }

  async load() {
    let keys = await Neutralino.storage.getKeys()
    keys.forEach(async key => {
      this.data[key] = await Neutralino.storage.getData(key)
    })
  }

  getData(key) {
    return this.data[key]
  }

  setData(key, data) {
    console.log('Calling Neutralino.storage.setData', key, data)
    Neutralino.storage.setData(key, data).then().catch(this.handleError)
    this.data[key] = data
  }

  handleError(error) {
    console.error(error)
  }

  // Returns entries, a list of paths
  showOpenDialog() {
    Neutralino.os.showOpenDialog().then(entries => {
      let path = entries[0]
      if (path) {
        this.setData('PROJECT_PATH', path)
        console.log('open dialog entries', entries)
      }
    }).catch(this.handleError)
  }

}