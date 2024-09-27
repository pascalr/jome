import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import { materialDarkStyle, materialDarkThemeOptions } from "./codemirror_theme_material_dark";
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';

export function createCodemirrorEditor(app, content) {

  let themeExtension = EditorView.theme(materialDarkThemeOptions, {dark: true})

  const highlightStyle = HighlightStyle.define(materialDarkStyle);
  let highlightExtension = syntaxHighlighting(highlightStyle)

  let editor = new EditorView({
    doc: content,
    extensions: [basicSetup, themeExtension, highlightExtension, javascript()],
    parent: document.getElementById('codemirror_editor')
  })
}
