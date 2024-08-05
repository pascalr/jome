/*
Document is the model that holds the higher level data of a file.

Documents are not broken down as much as an AST.
*/

export class Document {
    constructor(filename, content) {
        this.filename = filename
        this.content = content
        this.extension = /(?:\.([^.]+))?$/.exec(filename)[1];
        this.cursor = 0 // For parsing
        this.length = content.length
    }
}