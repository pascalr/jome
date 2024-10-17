import { NodeSelection } from "prosemirror-state";

import { findNodePosition } from "./prosemirror_helpers";

export function updateObjectAttribute(state, dispatch, field, value) {
  const {selection} = state;

  if (!(selection instanceof NodeSelection)) {return false;}

  const selectedNode = selection.node;
  const pos = selection.from; // Get the position of the selected node

  // Define the new attributes
  const newAttrs = {
    ...selectedNode.attrs, // Keep existing attributes
    [field]: value, // Update or add the attribute
  };

  // Create a transaction to update the node's markup
  const transaction = state.tr.setNodeMarkup(pos, selectedNode.type, newAttrs, selectedNode.marks);

  // Dispatch the transaction
  dispatch(transaction);
  return true
}

export function selectObject(state, dispatch, node) {

  let pos = findNodePosition(state.doc, node)
  console.log('selectObject pos', pos)
  if (pos === null) {return false;}

  // Create a NodeSelection at that position
  const nodeSelection = NodeSelection.create(state.doc, pos);
  const transaction = state.tr.setSelection(nodeSelection).setMeta('sourceOfChange', 'selectObject');
  if (dispatch) {dispatch(transaction)}
  return true;
}


// function insertEmoji(state, dispatch) {
//   let type = starSchema.nodes.emoji
//   let {$from} = state.selection
//   if (!$from.parent.canReplaceWith($from.index(), $from.index(), type))
//     return false
//   dispatch(state.tr.replaceSelectionWith(type.create()))
//   return true
// }