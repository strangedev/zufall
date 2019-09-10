# zufall

A small javaScript library for generating random things.
The aim of this library is to facilitate testing and fuzzing
by making it easy to generate random inputs.

At the moment, primitive types, Arrays, Objects and mongodb-style DbRefs are
supported.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

Install from npmjs.com:

```sh
yarn add zufall
yarn add -D zufall # when used for testing
```

## Usage

Node:

```javascript
const Zufall = require("zufall");
```

ES6:

```javascript
import Zufall from "zufall";
```

### Types

Zufall uses strings to indicate types. Obtain a list of all types:

```javascript
Zufall.TYPES;
/* OUT:
[
  'string', 'integer',
  'number', 'NaN',
  'null',   'undefined',
  'Array',  'Object'
]
*/
```

Zufall distinguishes between `VALUE_TYPES` and `OBJECT_TYPES`:

```javascript
Zufall.VALUE_TYPES;
// OUT: ['string', 'integer', 'number', 'NaN', 'null', 'undefined']

Zufall.OBJECT_TYPES;
// OUT: ['Array', 'Object']
```

You can find out the type of a value by using `Zufall.typeOf()`:

```javascript
Zufall.typeOf("test");
// OUT: 'string'

Zufall.typeOf(1);
// OUT: 'integer'

Zufall.typeOf(["test"]);
// OUT: 'Array'
```

#### `Zufall.randomType :: string`

Returns a random type string.

```javascript
Zufall.randomType();
// OUT: 'NaN'
```

#### `Zufall.randomValueType :: string`

Returns a random value type string.

```javascript
Zufall.randomValueType();
// OUT: 'number'
```

#### `Zufall.randomTypeExcept :: [string] -> string`

Returns a random type string, excludes given types from being selected.

```javascript
Zufall.randomTypeExcept(["NaN", "number", "integer", ...Zufall.OBJECT_TYPES]);
// OUT: 'string'
```

### Monte-Carlo

#### `Zufall.choose :: [a] -> a`

Randomly choose a single element from an Array.

```javascript
Zufall.choose([1, 2, 3]);
// OUT: 1
```

#### `Zufall.chooseN :: [a] -> integer -> [a]`

Choose a subset of length n from an Array by
choosing without replacement. Throws if n is
greater than the number of choices.

```javascript
Zufall.chooseN([1, 2, 3], 2);
// OUT: [3, 1]
```

#### `Zufall.chooseNReplace :: [a] -> integer -> [a]`

Choose a subset of length n from an Array by
choosing with replacement.

```javascript
Zufall.chooseNReplace([1, 2, 3], 4);
// OUT: [ 3, 1, 3, 3 ]
```

### Primitive values

#### `Zufall.randomBoolean :: boolean`

Returns either `true` or `false`.

```javascript
Zufall.randomBoolean();
// OUT: false
```

#### `Zufall.randInt :: integer -> integer`

Given n, returns a random integer from [0;n).

```javascript
Zufall.randInt(10);
// OUT: 3
```

#### `Zufall.randNum :: number -> number`

Given n, returns a random number from [0;n).

```javascript
Zufall.randNum(10);
// OUT: 3.988404789833939
```

#### `Zufall.randomWord :: Optional integer -> string`

Returns a random string by concatenating n words.

```javascript
Zufall.randomWord();
// OUT: 'atomfuß'
Zufall.randomWord(3);
// OUT: 'karrengeschwurbelpunkt'
```

#### `Zufall.randomValue :: (ValueType a) => a`

Returns a random value of random VALUE_TYPE.

```javascript
Zufall.randomValue();
// OUT: 'fußgeschwurbel'
Zufall.randomValue();
// OUT: 7709165238833651
Zufall.randomValue();
// OUT: undefined
```

### Arrays

Arrays are generated with random length per default. The methods provided take an upper limit for the array length so that the resulting array will be between 0 and n elements long.

#### `Zufall.randomArray :: (ValueType a) => Optional integer -> [a]`

Generates an array of a single random VALUE_TYPE.
Optionally takes an upper limit for the array size.

```javascript
Zufall.randomArray();
// OUT: [ undefined, undefined, undefined ]
Zufall.randomArray();
/* OUT: 
[
  7215554091823195, 4722635101592093,
  493279431500843,  759458253392443
]
*/
Zufall.randomArray();
/* OUT:
[
  1.249291526663151e+308,
  1.3237729018799112e+308,
  1.172642447815066e+308
]
*/
Zufall.randomArray(0);
// OUT: []
Zufall.randomArray(2);
// OUT: [ null ]
```

#### `Zufall.randomArrayOf :: (Type a) => string -> Optional integer -> [a]`

Generates an array of a single given type.
Optionally takes an upper limit for the array size.

```javascript
Zufall.randomArrayOf("number", 2);
// [ 1.2744062956612279e+308 ]
Zufall.randomArrayOf("Object", 2);
/* OUT:
[
  {
    mauzikarren: undefined,
    anneatom: 'gedönsmate',
    mauzianne: null,
    geschwurbelanne: 1.6867571167985551e+308,
    karrenlampe: 'punktchong',
    kleberdemokratie: 1.1276508106109448e+308,
    klappebauer: 4.044959369454694e+307,
    randommate: 1984869837046861,
    einhorndemokratie: undefined,
    gretanne: null
  }
]
/*
```

#### `Zufall.randomArrayBy :: (Type a) => ([a] -> a) -> Optional integer -> [a]`

Generates an array by succesively calling a
generator function. The generator function
receives the current array and returns the next
element that should be added to it.
Optionally takes an upper limit for the array size.

```javascript
Zufall.randomArrayBy(() => Zufall.randInt(10));
// OUT: [ 4, 6, 3, 3, 6, 7, 4]

// generate unique numbers by checking
// if the next number is already contained in
// the array
const generatorFn = ary => {
  let nextElement;
  do {
    nextElement = Zufall.randInt(100);
  } while (ary.includes(nextElement));
  return nextElement;
};
Zufall.randomArrayBy(generatorFn);
// OUT: [ 73, 29, 25, 31, 11, 86, 34,  9]
```

### Objects

#### `Zufall.randomObject :: Optional integer -> Object`

Generates an object with a random number of
entries. Entries have random types.
Optionally takes an upper limit for the number
of entries. Does not nest Objects, see
`Zufall.randomObjectWithDepth()`.

```javascript
Zufall.randomObject();
/* OUT: 
{ 
    saftkopf: true, 
    fliegelampe: 6151540800962309, 
    laz0rkleber: NaN 
}
*/
Zufall.randomObject(4);
// OUT: { gretklappe: 1.1503044327731994e+308 }
Zufall.randomObject(4);
// OUT: {}
Zufall.randomObject(4);
/* OUT: 
{ 
    'mauzifuß': 'mauzilampe', 
    bauergeschwurbel: 'mauzigeschwurbel'     
}
*/
Zufall.randomObject(4);
/* OUT:
{ 
    kleberbauer: 5807444775408303,
    lampechong: undefined 
}
*/
```

#### `Zufall.randomObjects :: Optional integer -> [Object]`

Generates a fixed-length array of random Objects
using `Zufall.randomObject()`.
The length is optional and defaults to 64.

```javascript
Zufall.randomObjects(10);
/* OUT:
[
  {}, {}, {}, {}, {},
  {}, {}, {}, {}, {}
]
*/
```

#### `Zufall.randomObjectOf :: string -> Optional integer -> Object`

Given a type, generates an Object with a random
amount of entries of the type. Optionally takes an
upper limit for the number of entries.

```javascript
Zufall.randomObjectOf("string", 3);
/* OUT: 
{ 
    kopffliege: 'karrenanne',
    lampefliege: 'matebauer'
}
*/
```

#### `Zufall.randomObjectOfTypes :: [string] -> Optional integer -> Object`

Given a list of types, chooses a type at random
and creates an Object with a random amount of
entries of the type. Optionally takes an
upper limit for the number of entries.

```javascript
Zufall.randomObjectOfTypes(["null", "undefined"], 3);
/* OUT:
{
    chonglaz0r: undefined,
    mauzibauer: null
}
*/
```

#### `Zufall.randomObjectBy :: (Type a) => (Object -> a) -> Optional integer -> Optional boolean -> Object`

Generates an Object by succesively calling a
generator function. The generator function
receives the current Object and returns the next
value that should be added to it.
Optionally takes an upper limit for the number
of entries.

```javascript
Zufall.randomObjectBy(() => Zufall.randInt(10));
// OUT: { lampeklappe: 8, chongzwerg: 8, 'ülfsaft': 6 }

// generate unique numbers by checking
// if the next number is already contained in
// the object
const generatorFn = o => {
  let nextElement;
  do {
    nextElement = Zufall.randInt(100);
  } while (Object.values(o).includes(nextElement));
  return nextElement;
};
Zufall.randomObjectBy(generatorFn, 4);
// OUT: { fliegezwerg: 69, geschwurbelsheesh: 3 }
```

#### `Zufall.randomObjectWithDepth :: integer -> Optional integer -> Object`

Given d, generates a random Object with a
guaranteed Object nesting depth d.
Optionally takes the maximum branching factor
of the resulting Object.

**Careful**: Certain combinations of large depth
and large branching factors may take a considerably
amount of time to generate.

```javascript
Zufall.randomObjectWithDepth(3, 3);
/* OUT: 
{
  'hörnchenklappe': {
    'fußrundi': { atomsheesh: null },
    chongeinhorn: { kopfanne: undefined }
  },
  randomzwerg: { chongchong: {} }
}
*/
```

### DbRefs

Borrowed from [mongodb](https://docs.mongodb.com/manual/reference/database-references/), DbRefs are
a format for storing relationships in a document-based
database. Zufall uses the following `DbRef` format:

```json
{
  "collection": "saftfliege",
  "id": "5d77f0562693be5c4cc88c3a"
}
```

#### `Zufall.randomDbRef :: Object`

Generates an Object formatted like a `DbRef`.

```javascript
Zufall.randomDbRef();
/* OUT:
{
    collection: 'sheeshlan',
    id: '5d77f0a52693be5c4cc88c3b'
}
*/
```

#### `Zufall.randomDbRefs :: Optional integer -> [Object]`

Generates a fixed-length Array of random DbRefs.
The length is optional and defaults to 64.

```javascript
Zufall.randomDbRefs(5);
/* OUT:
[
  { 
    collection: 'gedönskramp',
    id: '5d77f10d2693be5c4cc88c55' 
  },
  { 
    collection: 'matekramp',
    id: '5d77f10d2693be5c4cc88c56'
  },
  { 
    collection: 'laz0rrundi',
    id: '5d77f10d2693be5c4cc88c57'
  },
  {
    collection: 'kopfsaft',
    id: '5d77f10d2693be5c4cc88c58'
  },
  {
    collection: 'fußdemokratie',
    id: '5d77f10d2693be5c4cc88c59'
  }
]
*/
```

#### `Zufall.randomDocument :: integer -> Optional integer -> Optional integer -> Object`

Generates a (nested) object and inserts a number
of random DbRefs into it. Returns an Object
containing the generated document, a Map
of paths to DbRef Object in order to find the
DbRefs in the generated document and an Array
of all collections referenced in the document.

The second parameter is optional and determines
the maximum number of DbRefs inserted.
The thirs parameter is optional and determines
the branching factor of the document.

```javascript
let ret = Zufall.randomDocument(3, 3, 3);
ret.root;
/* OUT: 
{ 
   "kopfatom":{ 
      "lanrandom":{ 
         "punktlaz0r":null,
         "atomsheesh":false
      },
      "gedönsatom":{ 

      }
   },
   "punktrundi":{ 
      "laz0rkopf":{ 
         "collection":"lampeanne",
         "id":"5d77f32bc8a8486167164f4a"
      }
   }
}
*/
ret.dbrefs;
/* OUT:
Map {
  [ 'punktrundi', 'laz0rkopf' ] => { collection: 'lampeanne', id: '5d77f32bc8a8486167164f4a' }
}
*/
ret.collections;
// OUT: [ 'lampeanne' ]
```

### Madness

#### `Zufall.randomThing :: (Type a) => a`

Returns a random thing of any type.

```javascript
Zufall.randomThing();
// OUT: true
Zufall.randomThing();
// OUT: undefined
Zufall.randomThing();
// OUT: 2289309868526099
Zufall.randomThing();
// OUT: 'einhornhörnchen'
```

#### `Zufall.randomThingOf :: (Type a) => string -> a`

Returns a random thing of the given type.

```javascript
Zufall.randomThingOf("string");
// OUT: 'laz0rkarren'
Zufall.randomThingOf("integer");
// OUT: 3889316909728921
```

#### `Zufall.randomThingOfTypes :: (Type a) => [string] -> a`

Chooses a type from a given array of types, the returns
a random thing of the type.

```javascript
Zufall.randomThingOfTypes(["number", "integer"]);
// OUT: 7.393000727470504e+307
```

### Helpers

#### `Zufall.isPrefixOf :: (Eq a) => [a] -> [a] -> boolean`

Returns true, if second argument is a prefix of
the first.

```javascript
Zufall.isPrefixOf([1, 2, 3, 4], [1, 2]);
// OUT: true
Zufall.isPrefixOf([1, 2, 3, 4], []);
// OUT: true
Zufall.isPrefixOf([1, 2, 3, 4], [3, 4]);
// OUT: false
```

#### `(constant) Zufall.words :: [string]`

A list of words used to generate random strings.

```javascript
Zufall.words.slice(0, 4);
// OUT: [ 'fuß', 'geschwurbel', 'mate', 'laz0r' ]
```

## Support

Please [open an issue](https://github.com/strangedev/zufall/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/strangedev/zufall/compare/).
