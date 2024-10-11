function extractComponentName(tagName) {
  // FIXME: hardcoded string
  if (tagName.startsWith('jome-')) {
    return tagName.slice(5)
  } else if (tagName.startsWith('j-')) {
    return tagName.slice(2)
  }
  throw "Unsupported extractComponentName"
}

export function analyzeJomeSegment(str) {

  let parser = new DOMParser();
  // Addind a dummy root component because xml requires a single root element
  let doc = parser.parseFromString('<r>'+str+'</r>', 'text/xml');

  // Get all elements in the document
  let allElements = doc.getElementsByTagName('*');

  // FIXME: hardcoded string
  let jomeTags = [...allElements].filter(el => el.tagName.startsWith('jome-') || el.tagName.startsWith('j-'));

  // TODO: group all tags that are not Jome tags together as Text

  let tags = jomeTags.map(t => ({name: extractComponentName(t.tagName)}))

  return tags;
}