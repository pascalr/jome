import { e } from "../helpers";

export function createSkeleton() {
  return e("div", {id: "window"}, [
    e("div", {id: "home"}, [
      e("h1", {id: "tmp_palceholder_home"}, ["Home"])
    ]),
    e("div", {id: "editor"}, [
      e("h1", {id: "tmp_palceholder_editor"}, ["Editor"])
    ])
  ])
}