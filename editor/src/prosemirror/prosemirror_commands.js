// function insertEmoji(state, dispatch) {
//   let type = starSchema.nodes.emoji
//   let {$from} = state.selection
//   if (!$from.parent.canReplaceWith($from.index(), $from.index(), type))
//     return false
//   dispatch(state.tr.replaceSelectionWith(type.create()))
//   return true
// }

import { NodeSelection } from "prosemirror-state";

function updateObjectAttribute(state, dispatch) {
  return false
}

function selectObject(state, dispatch) {

  let pos = findNodePosition(state.doc, FIXME)

  // Create a NodeSelection at that position
  const nodeSelection = NodeSelection.create(state.doc, pos);

  // Create a transaction that sets the selection
  const transaction = state.tr.setSelection(nodeSelection);

  // Dispatch the transaction to update the editor's state
  if (dispatch) {dispatch(transaction)}
  return true;
}