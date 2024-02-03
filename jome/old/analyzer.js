// FIXME: THIS IS NOT WORKING YET BECAUSE OF THE H1 CLASS!!!
// export class H1 text => { super: Tag "h1", text }
// Le problème est que présentement je crée un constructeur sans paramètres...
// TODO: Générer une erreur quand on fournit des paramètres à une fonction qui ne prend pas de paramètres
// Ça ne marche pas parce que ça ne génère par un premier paramètre qui s'appelle params

/**
 * Check for syntax error (if tokens are all in valid order)
 * 
 * Check for dependencies so you can call classes and functions that are declared after they are used.
 */
function analyze(rootToken) {
  analyzeNode(rootToken)
}

function analyzeNode(node, context) {

}

module.exports = {
  analyze
}