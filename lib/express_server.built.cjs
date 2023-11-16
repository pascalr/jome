
import express from "express";

export class ExpressServer {
  constructor(__props__) {
    this.__props__ = {...{port: 3000}, ...__props__}
    
    this.app = express()
    this.app.use(express.json())
    
  }
  run() {
    
return this.app.listen(this.__props__.port, () => {
      return console.log(`Server is listening on port ${this.__props__.port}`)
    })
  }
  useStatic(urlOrPath, path) {
    if (path) {
      this.app.use(urlOrPath, express.static(path))
    } else {
      this.app.use(express.static(urlOrPath))
    }
  }
  use(pathOrMiddleware, middleware) {
    return this.app.use(pathOrMiddleware, middleware)
  }
  get(path, func) {
    return this.app.get(path, func)
  }
  put(path, func) {
    return this.app.put(path, func)
  }
  post(path, func) {
    return this.app.post(path, func)
  }
}

