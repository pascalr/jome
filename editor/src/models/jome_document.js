/*
Document is the model that holds the higher level data of a file.

Documents are not broken down as much as an AST.
*/

export class JomeDocument {
    constructor(filename, content) {
        this.filename = filename
        this.content = content
        this.extension = /(?:\.([^.]+))?$/.exec(filename)[1];

        // Result
        this.parts = [] // Maybe rename this to segments instead of parts?
    }
}