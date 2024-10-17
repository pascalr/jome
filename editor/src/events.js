// This is somehow more convenient, but it adds a useless function call,
// so I won't be doing this I think, staying with the old method.
export function withEventMethods(klass) {

  let proto = klass.prototype

  proto.emitFileChange = function(...data) { this.emit("onFileChange", ...data) }
  proto.emitProjectChange = function(...data) { this.emit("onProjectChange", ...data) }
  proto.emitDockChange = function(...data) { this.emit("onDockChange", ...data) }
  proto.emitWindowChange = function(...data) { this.emit("onWindowChange", ...data) }
  proto.emitFileOpen = function(...data) { this.emit("onFileOpen", ...data) }
  proto.emitFileClose = function(...data) { this.emit("onFileClose", ...data) }
  proto.emitDocumentChange = function(...data) { this.emit("onDocumentChange", ...data) }
  proto.emitDocumentBatchChange = function(...data) { this.emit("emitDocumentBatchChange", ...data) }
  proto.emitSelect = function(...data) { this.emit("onSelect", ...data) }
  proto.emitUpdateField = function(...data) { this.emit("onUpdateField", ...data) }

  return klass
}