import { Rect } from "./rect"

export const PRIMITIVES = {
  // isogon
  "RECT": Rect,
}

// TODO: set not array
const PRIMITIVE_SET = Object.keys(PRIMITIVES)

export function isPrimitive(tag) {
  return PRIMITIVE_SET.includes(tag.tagName.toUpperCase())
}

export function getPrimitive(tag) {
  return PRIMITIVE_SET[tag.tagName.toUpperCase()]
}