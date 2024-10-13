export function analyzeJomeSegment(str) {

  let parser = new DOMParser();
  // Addind a dummy root component because xml requires a single root element
  let doc = parser.parseFromString('<r>'+str+'</r>', 'text/xml');

  // Get all elements in the document
  let allElements = doc.getElementsByTagName('*');

  // FIXME: hardcoded string
  let jomeTags = [...allElements].filter(el => el.tagName.startsWith('jome-') || el.tagName.startsWith('j-'));

  // TODO: group all tags that are not Jome tags together as Text

  return jomeTags;
}