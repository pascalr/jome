/*
Document is the model that holds the higher level data of a file.

Documents are not broken down as much as an AST.
*/

export class Document {
    constructor(filename, content) {
        this.filename = filename
        this.content = content
        this.extension = /(?:\.([^.]+))?$/.exec(filename)[1];

        // For parsing
        this.cursor = 0
        this.length = content.length
        this._currCodeBlock = ""
        this.config = null // the language config

        // Result
        this.parts = []
    }
}