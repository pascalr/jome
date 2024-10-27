/*~

  <h1>Test Jome Parser</h1>

  <p>The Jome parser is responsible for extracting the Jome comment blocks. It must know the language in which it is embedded in order to parse properly. For example, don't extract Jome from strings and from regular comments.</p>

  <p>This is a WIP to use nodes to create tests.</p>

  <p>It is using Jome code to interact with the existing code and to output javascript code.</p>

~*/

import { JomeParser } from "../src/jome_parser";

let parser = new JomeParser()

/*~
  <p>The parser should not detect a jome block with regular code.</p>

  <jome-code key="Code1">parser.parse('let x = 0')</jome-code>

  <jome-test-equals key="TestEquals1" expected=""></jome-test-equals>

  <p>TODO: Inside jome-meta, link actual attribute to be a formula of "=Code1+'.segments.length'"</p>

  <p>What will the output look like?</p>
~*/

/*
The parser should not detect a jome block with regular code.

Testing parser.parse('let x = 0')
Expect "segments.length" To be 1
Expect "segments[0].type" To be "code"
*/


/*~ <p>The parser should not detect a jome block with regular code.</p> ~*/



/*~
  <jome-assert-many input="parser.parse('let x = 0')">
    <equals></equals>
  </jome-assert-many>

  <jome-assert-equals calc="parser.parse('let x = 0')" expected=""></jome-assert-equals>

  <p>The parser should not detect a jome block within strings.</p>

  <p>The parser should not detect a jome block within strings.</p>

  <p>An empty jome block should do nothing.</p>

  <jome-assert-equals calc="parser.parse('let s = `/*~ ~*\/`')" expected=""></jome-assert-equals>

~*/