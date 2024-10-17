import { NodeSelection } from "prosemirror-state";

import { findNodePosition } from "./prosemirror_helpers";

export function updateObjectAttribute(state, dispatch) {
  return false
}

export function selectObject(state, dispatch, node) {

  let pos = findNodePosition(state.doc, node)
  console.log('selectObject pos', pos)
  if (pos === null) {return false;}

  // Create a NodeSelection at that position
  const nodeSelection = NodeSelection.create(state.doc, pos);
  const transaction = state.tr.setSelection(nodeSelection);
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