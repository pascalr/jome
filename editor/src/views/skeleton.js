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
}

export function createSkeleton() {
  return e("div", {id: REF.WINDOW, style: "width: 100%; height: 100%; display: flex; flex-direction: column;"}, [
    e("div", {id: REF.WINDOW_BAR}),
    e("div", {id: REF.WINDOW_CONTENT, style: "flex-grow: 1;"}, [
      e("div", {id: REF.HOME, style: "height: 100%; display: none;"}, [
        e("h1", {id: "tmp_palceholder_home"}, ["Home"])
      ]),
      e("div", {id: REF.EDITOR, style: "height: 100%;"}, [
        e("h1", {id: "tmp_palceholder_editor"}, ["Editor"])
      ])
    ])
  ])
}