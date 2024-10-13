export function analyzeJomeSegment(str) {

  let parser = new DOMParser();
  // Addind a dummy root component because xml requires a single root element
  // let doc = parser.parseFromString('<r>'+str+'</r>', 'text/xml');
  let doc = parser.parseFromString(str, 'text/html');

  console.log('doc', doc)

  // Get all elements in the document
  let allElements = doc.body.children;

  console.log('allElements', allElements)

  // FIXME: hardcoded string
  let jomeTags = [...allElements].filter(el => el.tagName.toLowerCase().startsWith('jome-') || el.tagName.toLowerCase().startsWith('j-'));

  // TODO: group all tags that are not Jome tags together as Text

  return jomeTags;
}