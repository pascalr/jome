// TODO: Make sure no infinite loop
function validateAllNodes(nodes) {
  nodes.forEach(node => {
    if (node.validate) {
      let err = node.validate(node)
      if (err) {
        throw new Error(err)
      }  
    }
    if (node.children?.length) {
      validateAllNodes(node.children)
    }
    if (node.parts?.length) {
      validateAllNodes(node.parts)
    }
  });
}

module.exports = {
  validateAllNodes
}