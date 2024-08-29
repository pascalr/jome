// Because DOM lists do not have the forEach method
export function forEach(list, callback) {
  for (let i = 0; i < list.length; i++) {
    callback(list[i])
  }
}