
// TODO: I think the proper way to do this is to whitelist the arguments

// Validate color for safety
export function validateColor(col) {
  if (col.match(/#[0-9a-f]{6}|#[0-9a-f]{3}/)) {
    return col
  }
  throw "Unkown color: " + col
}