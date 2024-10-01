import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import { materialDarkStyle, materialDarkThemeOptions } from "./codemirror_theme_material_dark";
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';

export function createCodemirrorEditor(app, ref, content) {

  let themeExtension = EditorView.theme(materialDarkThemeOptions, {dark: true})

  const highlightStyle = HighlightStyle.define(materialDarkStyle);
  let highlightExtension = syntaxHighlighting(highlightStyle)

  let el = document.createElement('div')
  ref.appendChild(el)

  let editor = new EditorView({
    doc: content,
    extensions: [basicSetup, themeExtension, highlightExtension, javascript()],
    parent: el
  })
}
