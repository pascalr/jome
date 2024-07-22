/*~main
~arg force, ~unit N*, ~comment Newtons or equivalent
~arg distance, ~unit m*, ~comment meters or equivalent
*/
function main(force, distance) {
  //~run
  return force * distance; // the last value from a Jome tag is returned
  //~end
}

//~begin main
  //~arg force, ~unit N*, ~comment Newtons or equivalent
  //~arg distance, ~unit m*, ~comment meters or equivalent
  function main(force, distance) {
    return force * distance; // the last value from a Jome tag is returned
  }
//~end

/*~ignore
Ideas:
~html: Insert html
~txt: Insert text
*/