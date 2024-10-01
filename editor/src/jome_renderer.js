import { renderCanvas } from "./canvas_renderer";
import { e } from "./helpers";
import { capitalize } from "./utils";

let RENDERERS = {

  input({name, args}) {

    let el = e('div', {}, [
      e('input', {id: args.id, type: args.type||'text', value: args.defaultValue})
    ])
    if (args.id) {
      el.prepend(e('label', {for: args.id}, [capitalize(args.id)+': ']))
    }
    if (args.enableEquivalentUnits) {
      // TODO
    }
    if (args.unit) {
      el.appendChild(e('span', {}, [' '+args.unit]))
    }
    if (args.comment) {
      el.appendChild(e('span', {style: "font-size: 0.8em; color: gray; margin-left: 1.5em;"}, [' '+args.comment]))
    }

    return el;
  },

  img({name, args}) {
    return e('img', {src: args.src})
  },

  canvas: renderCanvas

}

export function renderCommand(ref, cmd) {

  let renderer = RENDERERS[cmd.name]

  if (renderer) {
    let el = renderer(cmd)
    ref.appendChild(el)
  } else {
    console.error('Missing renderer for: ', cmd.name)
  }
}