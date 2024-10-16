import { e } from "../helpers"

export function createObjectLabelParts(obj) {

  let parts = [e('span', {className: "component-icon", style: `background-image: url('${obj.getIconUrl()}')`})]

  if (obj.isTextBlock || obj.isCodeBlock) {
    parts.push(e('span', {className: "component-quote"}, [obj.getQuote()]))
  } else {
    parts.push(e('span', {className: "component-label"}, [obj.getLabel()]))
    parts.push(e('span', {className: "component-description"}, [obj.getDescription()||""]))
  }

  return parts
}