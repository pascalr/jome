import { CanvasRenderer } from "./canvas_renderer";
import { e } from "./helpers";
import { capitalize } from "./utils";

let RENDERERS = {

  input: {
    // Or maybe simply sanitize HTML? Remove < and > ?
    // No because not just html. For example, it could be CSS style...
    // I need to sanitize CSS too...
    // Sanitize the end result? The element added?
    // It's more work, but it's better whitelisting args like this.
    // And it's good because the editor will use this  
    args: {
      id: "text",
      type: `enum("text"|"number")`,
      value: "text",
    },
    render({name, args}) {

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
  },

  img: {
    render({name, args}) {
      return e('img', {src: args.src})
    },
  },

  canvas: CanvasRenderer

}

export function renderCommand(ref, cmd) {

  let renderer = RENDERERS[cmd.name]

  if (renderer) {
    let el = renderer.render(cmd)
    ref.appendChild(el)
  } else {
    console.error('Missing renderer for: ', cmd.name)
  }
}