const jome = require('jome')


const {H1} = require("./lib/html.built.js");
const execSh = require("jome/lib/exec_sh");

var string = 'someStr'
class SomeNode {
  constructor(__props__) {
    this.__props__ = __props__
    this.tenMore = __props__.tenMore
    this.someText = __props__.someText
  }
  
}

var node = jome(new SomeNode({}))
  .initStateVar("stateVar", 20)
  .addChildNode("child", jome(new SomeNode({}))
  .addChildNode("child", jome((__state__) => (new SomeNode({tenMore: (__state__.stateVar + 10)})))
  .addStateVarDep("stateVar")))
  .node()
node?.$?.update({stateVar: 35})
var testH1 = new H1({}, "Un titre")
var testInterface = (__params__, arg) => {
  return arg + __params__.param
}
class ParentClass {
  getTen() {
    return 10
  }
}

class ChildClass extends ParentClass {
  constructor() {
    super()
  }
  
}

class TestFuncCall {
  getFive() {
    return 5
  }
}

var testFuncCall = jome(new TestFuncCall())
  .node()
  .getFive()
var testChainFuncCall = jome(new TestFuncCall())
  .call(o => o.getFive())
  .node()
  .getFive()
class ClassForTesting {
  constructor(__props__, arg) {
    this.arg = arg
    this.__props__ = __props__
    this.attr = __props__.attr
  }
  getArg() {
    return this.arg
  }
  getProp() {
    return this.__props__.prop
  }
}

var testObj = new ClassForTesting({attr: "attr", prop: "propVal"}, "arg")
var testObjList = [
  new ClassForTesting({attr: "attr1", prop: "propVal1"}, "arg1"),
  new ClassForTesting({attr: "attr2", prop: "propVal2"}, "arg2"),
  new ClassForTesting({attr: "attr3", prop: "propVal3"}, "arg3")
]
var testObjNested = {key1: new ClassForTesting({attr: "attr1", prop: "propVal1"}, "arg1"), key2: new ClassForTesting({attr: "attr2", prop: "propVal2"}, "arg2"), key3: new ClassForTesting({attr: "attr3", prop: "propVal3"}, "arg3")}
console.log(new ClassForTesting({prop: 'Hello'}).__props__)
execSh(`echo "Starting tests!"`);
console.log('There')
var person = "John"
var woman = 'Jane'
function f() {
  var x = 10
x = x + 20
return x
}
class SomeClassShorter {
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}

class SomeClass {
  constructor() {
    this.name = 10
  }
  getName() {
    return this.name
  }
}

class TestSyntaxe1 {
  
}

class TestEq {
  constructor(actual, expected, message) {
    if (Array.isArray(expected) ||  typeof expected === 'object') {
      this.pass = JSON.stringify(actual) === JSON.stringify(expected);
    } else {
      this.pass = actual == expected
    }
if (this.pass) {
      console.log("\x1b[32mRÉUSSI\x1b[0m", message || expected)
    } else {
      console.log("\x1b[31mÉCHEC:\x1b[0m", message, "\nExpected:", expected, "\nActually:", actual);
    }
  }
}

var titre = (texte) => {
  return console.log('%c' + texte, 'color: yellow')
};
var obj = new H1({css: {color: 'red'}}, "Un titre");
var props = obj.__props__
var obj2 = new H1({title: 'This is a tooltip'}, "Un titre 2");
var str2 = obj.toString();
[
  titre(('Test avec objects html')),
  new TestEq(new H1({}, "Un titre").toString(), "<h1>Un titre</h1>", "«H1 \"Un titre\"».toString()"),
  new TestEq(obj.toString(), "<h1 style=\"color: red\">Un titre</h1>", "« H1 \"Un titre\", css: {color: 'red'} ».toString()"),
  new TestEq(obj2.toString(), "<h1 title=\"This is a tooltip\">Un titre 2</h1>", "« H1 \"Un titre\", title: 'This is a tooltip' ».toString()"),
  new TestEq([1, 2, 3].slice( - 1)[0], 3, "Un index négatif devrait prendre l'élément en partant de la fin. -1 devrait être le dernier élément."),
  new TestEq([1, 2, 3].slice( - 2)[0], 2, "Un index négatif devrait prendre l'élément en partant de la fin. -2 devrait être avant dernier élément."),
  titre(('Vérification des opérations')),
  new TestEq((1 + 1), 1+1, "1+1"),
  new TestEq((2 * 2), 2*2, "2 * 2"),
  new TestEq((4 / 2), 4/2, "4 / 2"),
  new TestEq((5 - 2), 5-2, "5 - 2"),
  new TestEq((2 ** 2), 2 ** 2, "2 ^ 2"),
  new TestEq((1 + 1 + 1), 1+1+1, "1 + 1 + 1"),
  new TestEq((2 * 2 * 2), 2*2*2, "2 * 2 * 2"),
  new TestEq((8 / 2 / 2), 8/2/2, "8 / 2 / 2"),
  new TestEq((5 - 2 - 1), 5-2-1, "5 - 2 - 1"),
  new TestEq((2 ** 2 ** 2), 2**2**2, "2 ** 2 ** 2"),
  new TestEq((2 ** 1 ** 2 ** 1), 2**1**2**1, "2 ** 1 ** 2 ** 1"),
  new TestEq((1 || 2), 1||2, "1 || 2"),
  new TestEq((0 || 2), 0||2, "0 || 2"),
  new TestEq((1 && 2), 1&&2, "1 && 2"),
  new TestEq((0 && 2), 0&&2, "0 && 2"),
  new TestEq((0 || 0 || 3), 0||0||3, "0 || 0 || 3"),
  new TestEq((1 && 2 && 3), 1&&2&&3, "1 && 2 && 3"),
  new TestEq((1 && 0 && 3), 1&&0&&3, "1 && 0 && 3"),
  new TestEq((1 + 2 * 10), 1+2*10, "1 + 2 * 10"),
  new TestEq((1 + 2 * 10 + 3 ** 2), 1 + 2 * 10 + 3 ** 2, "1 + 2 * 10 + 3 ** 2"),
  new TestEq(((1 + 2) * 10), (1+2)*10, "(1 + 2) * 10"),
  new TestEq((2 * 2 * 2 + 1), 2*2*2+1, "2 * 2 * 2 + 1"),
  new TestEq((1 + 2 * 2 * 2), 1+2*2*2, "1 + 2 * 2 * 2"),
  new TestEq((2 * 2 + 1 + 2 * 2), 2*2+1+2*2, "2 * 2 + 1 + 2 * 2"),
  new TestEq((2 * 2 * 2 + 1 + 2 * 2 * 2), 2*2*2+1+2*2*2, "2 * 2 * 2 + 1 + 2 * 2 * 2"),
  titre(('Vérification des conditions')),
  new TestEq(true, true, "true"),
  new TestEq(true, true, "vrai"),
  new TestEq(false, false, "false"),
  new TestEq(false, false, "faux"),
  titre(('Vérification des fonctions'))
]
var addXs = function(__params__) {
  return __params__.x1 + __params__.x2
}
var addAXs = function(__params__, arg0) {
  return arg0 + __params__.x1 + __params__.x2
};
[
  titre(('Test paramètres de fonctions')),
  new TestEq(addXs({x1: 10, x2: 20}), 30, "addXs(x1: 10, x2: 20)"),
  new TestEq(addAXs({x1: 10, x2: 20}, 5), 35, "addAXs(5, x1: 10, x2: 20)"),
  titre(('Test des unités')),
  new TestEq(10.2, 10.2, "10.2km/h"),
  new TestEq(0.5 * 2, 1, "0.5W * 2h")
]
var ten = 10;
[
  titre(('Test des blocks')),
  new TestEq({x: 10}, {x: 10}, "{x: 10}"),
  new TestEq({x: 10, ten: ten}, {x: 10, ten: 10}, "{x: 10, :ten}"),
  new TestEq({ten: ten, x: 10}, {ten: 10, x: 10}, "{x: 10, :ten}"),
  new TestEq([1, 2, 3], [1,2,3], "{1,2,3}"),
  new TestEq([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
], [[1,2,3],[4,5,6],[7,8,9]], "Matrice 1 à 9"),
  new TestEq(testObj.getArg(), "arg", "class arg"),
  new TestEq(testObj.attr, "attr", "class attr"),
  new TestEq(testObj.getProp(), "propVal", "class prop"),
  new TestEq(testObjList[1].getArg(), "arg2", "class arg 2"),
  new TestEq(testObjList[1].attr, "attr2", "class attr 2"),
  new TestEq(testObjList[1].getProp(), "propVal2", "class prop 2"),
  new TestEq(testObjNested.key2.getArg(), "arg2", "class arg 2"),
  new TestEq(testObjNested.key2.attr, "attr2", "class attr 2"),
  new TestEq(testObjNested.key2.getProp(), "propVal2", "class prop 2"),
  new TestEq(new ChildClass().getTen(), 10, "testing inheritence"),
  new TestEq(testFuncCall, 5, "testFuncCall"),
  new TestEq(testChainFuncCall, 5, "testChainFuncCall"),
  titre(('Test des interfaces')),
  new TestEq(testInterface({param: 20}, 10), 30, "testInterface(10, param: 20)"),
  titre(('Test des constantes Jome')),
  new TestEq(Math.PI, Math.PI, "#PI"),
  titre(('Test des states variables')),
  new TestEq(node.child.child.tenMore, 45, "node.child.tenMore")
]