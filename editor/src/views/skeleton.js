import { e } from "../helpers";

export function getRef(id) {
  return document.getElementById(id)
}

export const REF = {
  WINDOW: "window",
  HOME: "home",
  EDITOR: "editor",
  WINDOW_BAR: "window_bar",
  WINDOW_CONTENT: "window_content",
  DOCK_BUTTONS: "dock_buttons",
  DOCK_CONTENT: "dock_buttons",
  FILE_TABS: "file_tabs",
  EDITOR_CONTENT: "editor_content",
  SELECTION_PANEL: "tool_panel"
}

export function createSkeleton() {
  return e("div", {id: REF.WINDOW, style: "width: 100%; height: 100%; display: flex; flex-direction: column;"}, [
    e("div", {id: REF.WINDOW_BAR}),
    e("div", {id: REF.WINDOW_CONTENT, style: "flex-grow: 1;"}, [
      e("div", {id: REF.HOME, style: "height: 100%;"}),
      e("div", {id: REF.EDITOR, style: "height: 100%;"}, [
        e('div', {className: "split-content"}, [
          e('div', {id: 'split-0', className: "context_panel"}, [
            e('div', {id: REF.DOCK_BUTTONS, className: "context_buttons"}),
            e('div', {id: REF.DOCK_CONTENT, className: "context_content"}),
          ]),
          e('div', {id: 'split-1', className: "main_panel"}, [
            e('div', {id: REF.FILE_TABS, className: "tab-buttons"}),
            e('div', {id: REF.EDITOR_CONTENT}),
          ]),
          e('div', {id: 'split-2', className: "selection_panel"}, [
            e('div', {id: REF.SELECTION_PANEL})
          ])
        ]),
        e("h1", {id: "tmp_palceholder_editor"}, ["Editor"])
      ])
    ])
  ])
}