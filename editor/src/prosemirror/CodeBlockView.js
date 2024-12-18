// Source: https://prosemirror.net/examples/codemirror/

import {
  EditorView as CodeMirror, keymap as cmKeymap, drawSelection
} from "@codemirror/view"
import {javascript} from "@codemirror/lang-javascript"
import {defaultKeymap} from "@codemirror/commands"
import {HighlightStyle, syntaxHighlighting, defaultHighlightStyle} from "@codemirror/language"

import {exitCode} from "prosemirror-commands"
import {undo, redo} from "prosemirror-history"

import {keymap} from "prosemirror-keymap"
import { Selection, TextSelection } from "prosemirror-state"

import {basicSetup} from "codemirror"
import { materialDarkStyle, materialDarkThemeOptions } from "../codemirror/codemirror_theme_material_dark";

export class CodeBlockView {
  constructor(node, view, getPos) {
    // Store for later
    this.node = node
    this.view = view
    this.getPos = getPos

    let themeExtension = CodeMirror.theme(materialDarkThemeOptions, {dark: true})
    const highlightStyle = HighlightStyle.define(materialDarkStyle);
    let highlightExtension = syntaxHighlighting(highlightStyle)

    // Create a CodeMirror instance
    this.cm = new CodeMirror({
      doc: this.node.textContent,
      extensions: [
        cmKeymap.of([
          ...this.codeMirrorKeymap(),
          ...defaultKeymap
        ]),
        drawSelection(),
        basicSetup,
        themeExtension,
        highlightExtension,
        javascript(),
        CodeMirror.updateListener.of(update => this.forwardUpdate(update))
      ]
    })

    // The editor's outer node is our DOM representation
    this.dom = this.cm.dom

    // This flag is used to avoid an update loop between the outer and
    // inner editor
    this.updating = false
  }

  forwardUpdate(update) {
    if (this.updating || !this.cm.hasFocus) return
    let offset = this.getPos() + 1, {main} = update.state.selection
    let selFrom = offset + main.from, selTo = offset + main.to
    let pmSel = this.view.state.selection
    if (update.docChanged || pmSel.from != selFrom || pmSel.to != selTo) {
      let tr = this.view.state.tr
      update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
        if (text.length) // FIXME: schema.text!!!!!!!!!!!!!!!! How to do without schema?
          tr.replaceWith(offset + fromA, offset + toA,
                         schema.text(text.toString()))
        else
          tr.delete(offset + fromA, offset + toA)
        offset += (toB - fromB) - (toA - fromA)
      })
      tr.setSelection(TextSelection.create(tr.doc, selFrom, selTo))
      this.view.dispatch(tr)
    }
  }

  codeMirrorKeymap() {
    let view = this.view
    return [
      {key: "ArrowUp", run: () => this.maybeEscape("line", -1)},
      {key: "ArrowLeft", run: () => this.maybeEscape("char", -1)},
      {key: "ArrowDown", run: () => this.maybeEscape("line", 1)},
      {key: "ArrowRight", run: () => this.maybeEscape("char", 1)},
      {key: "Ctrl-Enter", run: () => {
        if (!exitCode(view.state, view.dispatch)) return false
        view.focus()
        return true
      }},
      {key: "Ctrl-z", mac: "Cmd-z",
       run: () => undo(view.state, view.dispatch)},
      {key: "Shift-Ctrl-z", mac: "Shift-Cmd-z",
       run: () => redo(view.state, view.dispatch)},
      {key: "Ctrl-y", mac: "Cmd-y",
       run: () => redo(view.state, view.dispatch)}
    ]
  }

  maybeEscape(unit, dir) {
    let {state} = this.cm, {main} = state.selection
    if (!main.empty) return false
    if (unit == "line") main = state.doc.lineAt(main.head)
    if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false
    let targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize)
    let selection = Selection.near(this.view.state.doc.resolve(targetPos), dir)
    let tr = this.view.state.tr.setSelection(selection).scrollIntoView()
    this.view.dispatch(tr)
    this.view.focus()
  }

  update(node) {
    if (node.type != this.node.type) return false
    this.node = node
    if (this.updating) return true
    let newText = node.textContent, curText = this.cm.state.doc.toString()
    if (newText != curText) {
      let start = 0, curEnd = curText.length, newEnd = newText.length
      while (start < curEnd &&
             curText.charCodeAt(start) == newText.charCodeAt(start)) {
        ++start
      }
      while (curEnd > start && newEnd > start &&
             curText.charCodeAt(curEnd - 1) == newText.charCodeAt(newEnd - 1)) {
        curEnd--
        newEnd--
      }
      this.updating = true
      this.cm.dispatch({
        changes: {
          from: start, to: curEnd,
          insert: newText.slice(start, newEnd)
        }
      })
      this.updating = false
    }
    return true
  }

  selectNode() { this.cm.focus() }
  stopEvent() { return true }
}

function arrowHandler(dir) {
  return (state, dispatch, view) => {
    if (state.selection.empty && view.endOfTextblock(dir)) {
      let side = dir == "left" || dir == "up" ? -1 : 1
      let $head = state.selection.$head
      let nextPos = Selection.near(
        state.doc.resolve(side > 0 ? $head.after() : $head.before()), side)
      if (nextPos.$head && nextPos.$head.parent.type.name == "code_block") {
        dispatch(state.tr.setSelection(nextPos))
        return true
      }
    }
    return false
  }
}

export const arrowHandlers = keymap({
  ArrowLeft: arrowHandler("left"),
  ArrowRight: arrowHandler("right"),
  ArrowUp: arrowHandler("up"),
  ArrowDown: arrowHandler("down")
})
