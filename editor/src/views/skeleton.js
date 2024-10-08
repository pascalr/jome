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
  return e("div", {id: REF.WINDOW}, [
    e("div", {id: REF.WINDOW_BAR}),
    e("div", {id: REF.WINDOW_CONTENT}, [
      e("div", {id: REF.HOME}, [
        e("h1", {id: "tmp_palceholder_home"}, ["Home"])
      ]),
      e("div", {id: REF.EDITOR}, [
        e("h1", {id: "tmp_palceholder_editor"}, ["Editor"])
      ])
    ])
  ])
}