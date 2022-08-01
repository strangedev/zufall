# zufall

A small JS/TS library for generating random numbers and sampling data,
because using `Math.random()` is tiresome.

This library is aimed at testing and other _non-security_ applications. It
is just a wrapper for `Math.random()`, so don't expect any cryptographic
properties from it!

## Migrating to v2

Zufall has been rewritten in TypeScript! It is now more streamlined, too.
Only the basic functions are included now, removing the dependency on mongodb
that we had before.

We reckon that it is more important to provide a few focussed functions that you
can build on, instead of providing many small functions for every possible use
case.

In v2 we removed:
- The `TYPES`, `VALUE_TYPES`, and `OBJECT_TYPES` constants. If you want to create random values of certain types, you can easily do so by combining the other functions like `draw`, `randomInteger`, and `randomArrayBy`.
- The `randomValue`, `randomThing`, `randomThingOf`, `randomThingOfTypes`, `randomArrayOf`, `randomObjectOf`, and `randomObjectOfTypes` functions. These were meant for fuzzing purposes, but we discovered that their behavior was too unpredictable in real world applications, as you couldn't control the random generation enough. If you need to generate random inputs, combine the `randomInteger`, `randomNumber`, `randomString`, `draw` and the `randomArrayBy` and `randomObjectBy`functions.
- The `randomType`, `randomValueType` and `randomTypeExcept` functions. These were meant as helpers for the aforementioned functions, so they served no purpose anymore.
- The object generation function `randomObjectWithDepth`. Its behavior can be accomplished using `randomObjectBy`.
- The `randomObjects` function, as it can be built easily by combining `randomArrayBy` and `randomObjectBy`, and doing it manually gives more control.
- The `randomDbRef`, `randomDbRefs`, and `randomDocument` functions. These were very specific to one use case, which was the use case we had when writing this library. Since then, we wanted to use the library in different contexts and even the browser, and having the dependency on mongodb proved to be a limitation.
- The `words` constant. Get your own words ;D
- The `isPrefixOf` helper. It does not belong in this library.

We also renamed some things:
- `randInt` and `randNum` have been renamed to `randomInteger` and `randomNumber`.
- `chooseN` is now called `sample`, as it models sampling a populace.
- `chooseNReplace` is now called `draw`, as it models drawing numbers.
- `randomWord` is now called `randomString` to better match the naming of the other functions.

Some of the function signatures have also changed:
- `randomInteger` now receives a minimum and a maximum parameter.
- `randomNumber` now receives a minimum and a maximum parameter.
- `randomArrayBy` now receives an exact length instead of randomizing the length based on the given parameter.
- `randomObjectBy` now receives an exact length instead of randomizing the length based on the given parameter.
- `randomString` now receives an exact length instead of randomizing the length based on the given parameter.

We also added a `shuffle` function that you can use to immutably shuffle arrays!

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

Install from npmjs.com:

```sh
npm install zufall
npm install -D zufall # when used for testing
```

## Usage

Node:

```javascript
const Zufall = require("zufall");
```

ES6:

```javascript
import { draw, choose } from "zufall";
```

### Generating random numbers

You can generate random floats and integers with zufall.
You can either get a value between 0 and `Math.MAX_VALUE`, if you don't pass
any parameters, or you can adjust the allowed interval by passing a minimum
and a maximum.

_Note:_ The `maximum` is always excluded from the interval! In mathematical
terms, the value if chosen from the interval `[min; max)`. This has been chosen
to be compatible with `Math.random()`, which also excludes the 1, and it also
makes it easier to work with array indices.

```ts
// Generate a random float between 0 and Math.MAX_VALUE 
randomNumber();

// Generate a random float between 2 and 11
randomNumber(2, 11);

// The minimum can also be negative!
randomNumber(-3, 4);
```

```ts
// Generate a random integer between 0 and Math.MAX_VALUE 
randomInteger();

// Generate a random integer between 2 and 11
randomInteger(2, 11);

// The minimum can also be negative!
randomInteger(-3, 4);
```

### Generating random strings

You can generate random strings with zufall. These are not really random, but
you can use them if you need some placeholder text in a pinch.

```ts
// Get a random string with 12 characters in it.
randomString(12);
```

### Drawing and sampling from arrays

You can choose a random element from an array using `choose`:

```ts
choose([1, 2, 3, 4]);
```

If you want to choose multiple elements without replacing the element between
draws, you can use `sample`.

```ts
sample([1, 2, 3, 4], 3);

// The sample size can't be larger than the given array!
sample([1, 2, 3, 4], 5); // :(
```

If you want to choose multiple elements from an array and replace the elements
between each draw (meaning you can have duplicates), you can use `draw`.

```ts
// Here, the size can be as large as you want!
draw(['heads', 'tails'], 20); 
```

### Shuffling arrays

To shuffle an array, you can use the `shuffle` function. The function does not
modify the original array. This also means that this function copies the input
array, so be careful when trying to shuffle really large arrays.

```ts
shuffle([1, 2, 3, 4]);
```

### Generating random arrays

You can generate random arrays by using `randomArrayBy`. You need to supply a
generator function, which will be called once for every item you want to have
in your array. If you want to have an array with 5 items, it will be called 5
times.

The generator function receives the index of the element it should generate and
the current array. It should return the element at the given index.

```ts
randomArrayBy(() => randomInteger(10));
// e.g.: [ 4, 6, 3, 3, 6, 7, 4]

const generatorFn = (i, currentArray) => {
  let nextElement;

  do {
    nextElement = randomInteger(100);
  } while (currentArray.includes(nextElement));
  
  return nextElement;
};

randomArrayBy(generatorFn);
// e.g.: [ 73, 29, 25, 31, 11, 86, 34,  9]
```

### Generating random objects

You can generate random objects by using `randomObjectBy`. You need to supply a
generator function, which will be called once for every key-value pair you want
to have in your object. If you want to have an object with 5 properties, it will
be called 5 times.

The generator function receives the index of the element it should generate and
the current object. It should return a key-value pair for the generated property.

```ts
randomObjectBy(() => [ randomString(), randomInteger(10) ], 3);
// e.g.: { lampe: 8, zwerg: 8, saft: 6 }

// generate unique numbers by checking
// if the next number is already contained in
// the object
const generatorFn = (i, currentObject) => {
  let nextElement;

  do {
    nextElement = randomInteger(100);
  } while (Object.values(currentObject).includes(nextElement));

  return [ randomString(), nextElement ];
};

randomObjectBy(generatorFn, 2);
// e.g.: { fliege: 69, geschwurbel: 3 }
```

## Running quality assurance

```shell
npx roboter
```

## Support

Please [open an issue](https://github.com/strangedev/zufall/issues/new) for support.
