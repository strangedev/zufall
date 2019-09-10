const R = require("ramda");
const { ObjectID } = require("mongodb");

const _words = [
  ["fuß", "geschwurbel", "mate", "laz0r", "einhorn"],
  ["saft", "lampe", "fliege", "kleber", "gedöns"],
  ["zwerg", "rundi", "ülf", "mauzi", "hörnchen"],
  ["punkt", "kopf", "random", "atom", "klappe"],
  ["demokratie", "lan", "sheesh", "chong"],
  ["anne", "gret", "kramp", "karren", "bauer"]
];
const words = R.flatten(_words);

function randNum(n = Number.MAX_VALUE) {
  return Math.random() * n;
}

function randInt(n = Number.MAX_SAFE_INTEGER) {
  return Math.floor(randNum(n));
}

function choose(choices) {
  return choices[randInt(choices.length)];
}

function chooseN(choices, n) {
  if (n > choices.length) throw Error;
  if (n === choices.length) return choices;
  const ret = [];
  for (let i = 0; i < n; i++) {
    index = randInt(choices.length);
    ret.push(choices[index]);
    choices = [
      ...choices.slice(0, index),
      ...choices.slice(index + 1, choices.length)
    ];
  }
  return ret;
}

function chooseNReplace(choices, n) {
  return Array(n)
    .fill(null)
    .map(() => choose(choices));
}

function randomBoolean() {
  return choose([true, false]);
}

function randomWord(len = 2) {
  var ret = "";
  for (i = 0; i < len; i++) {
    ret += choose(words);
  }
  return ret;
}
const VALUE_TYPES = [
  "string",
  "integer",
  "number",
  "NaN",
  "null",
  "undefined",
  "boolean"
];
const OBJECT_TYPES = ["Array", "Object"];
const TYPES = [...VALUE_TYPES, ...OBJECT_TYPES];

function typeOf(x) {
  switch (true) {
    case x === null:
      return "null";
    case x === undefined:
      return "undefined";
    case R.is(Array, x):
      return "Array";
    case R.is(Object, x):
      return "Object";
    case R.is(String, x):
      return "string";
    case R.is(Boolean, x):
      return "boolean";
    case R.is(Number, x):
      return Number.isInteger(x)
        ? "integer"
        : Number.isNaN(x)
        ? "NaN"
        : "number";
    default:
      return "UnknownType";
  }
}

const randomValueType = () => choose(VALUE_TYPES);
const randomType = () => choose(TYPES);
const randomTypeExcept = ts => choose(R.filter(t => !ts.includes(t), TYPES));

function randomThingOf(type) {
  switch (type) {
    case "string":
      return randomWord();
    case "integer":
      return randInt();
    case "number":
      return randNum();
    case "NaN":
      return NaN;
    case "boolean":
      return randomBoolean();
    case "null":
      return null;
    case "undefined":
      return undefined;
    case "Array":
      return randomArray();
    case "Object":
      return randomObject();
    default:
      throw Error;
  }
}

function randomValue() {
  return randomThingOf(randomValueType());
}

function randomThing() {
  return randomThingOf(randomType());
}

function randomThingOfTypes(types) {
  return randomThingOf(choose(types));
}

function randomArrayOf(type, n = 16) {
  return randomArrayBy(() => randomThingOf(type), n);
}

function randomArrayBy(generatorFn, n = 16) {
  const ret = [];
  const len = randInt(n);
  for (let i = 0; i < len; i++) {
    ret.push(generatorFn(ret));
  }
  return ret;
}

function randomArray(n = 16) {
  return randomArrayOf(randomValueType(), n);
}

function randomObjectBy(generatorFn, n = 16, noEmpty = false) {
  const ret = {};
  let len = randInt(n);
  if (len === 0 && noEmpty) {
    len = 1;
  }
  for (let i = 0; i < len; i++) {
    let nextKey;
    do {
      nextKey = randomWord();
    } while (R.has(nextKey, ret));
    ret[nextKey] = generatorFn(ret);
  }
  return ret;
}

function randomObject(n = 16) {
  return randomObjectBy(() => randomValue(), n);
}

function randomObjectOf(type, n = 16) {
  return randomObjectBy(() => randomThingOf(type), n);
}

function randomObjectOfTypes(types, n = 16) {
  return randomObjectBy(() => randomThingOf(choose(types)), n);
}

function randomObjects(n = 64) {
  return Array(n)
    .fill(null)
    .map(randomObject);
}

function randomObjectWithDepth(depth, n = 16) {
  if (depth === 1 || !depth) {
    return randomObject(n);
  }
  return randomObjectBy(() => randomObjectWithDepth(depth - 1, n), n, true);
}

function randomDbRef() {
  return {
    collection: randomWord(),
    id: new ObjectID().toString()
  };
}

function randomDbRefs(n = 64) {
  return Array(n)
    .fill(null)
    .map(randomDbRef);
}

function isPrefixOf(path, maybePrefix) {
  if (maybePrefix.length > path.length) return false;
  return R.all(([a, b]) => a === b, R.zip(path, maybePrefix));
}

/**
 * @param {*} depth Nesting depth of generated document
 * @param {*} n Maximum number of DbRefs to generate
 * @param {*} m Branching factor of nested document
 */
function randomDocument(depth, n = 8, m = 4) {
  let root = randomObjectWithDepth(depth, m);
  const paths = randomArrayBy(ps => {
    let path = randomArrayOf("string", depth);
    while (R.any(p => isPrefixOf(p, path), ps) || path.length === 0) {
      path = randomArrayOf("string", depth);
    }
    return path;
  }, n);
  const dbrefs = new Map();
  const collections = new Set();

  paths.forEach(path => {
    const dbref = randomDbRef();
    root = R.assocPath(path, dbref, root);
    dbrefs.set(path, dbref);
    collections.add(dbref.collection);
  });
  return { root, dbrefs, collections: Array.from(collections) };
}

module.exports = {
  VALUE_TYPES,
  OBJECT_TYPES,
  TYPES,
  typeOf,
  words,
  choose,
  chooseN,
  chooseNReplace,
  isPrefixOf,
  randomType,
  randomValueType,
  randomTypeExcept,
  randInt,
  randNum,
  randomBoolean,
  randomWord,
  randomValue,
  randomArray,
  randomArrayOf,
  randomArrayBy,
  randomObject,
  randomObjects,
  randomObjectOf,
  randomObjectOfTypes,
  randomObjectBy,
  randomObjectWithDepth,
  randomThing,
  randomThingOf,
  randomThingOfTypes,
  randomDbRef,
  randomDbRefs,
  randomDocument
};
