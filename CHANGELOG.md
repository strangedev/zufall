# [2.0.0](https://github.com/strangedev/zufall/compare/v1.1.2...v2.0.0) (2022-08-01)


### Features

* rewrite and add new functions ([#40](https://github.com/strangedev/zufall/issues/40)) ([95ef5b8](https://github.com/strangedev/zufall/commit/95ef5b80f19facecfe4d1cc87edbf5638f5c81b9))


### BREAKING CHANGES

* The TYPES, VALUE_TYPES, and OBJECT_TYPES constants were removed. If you want to create random values of certain types, you can easily do so by combining the other functions like draw, randomInteger, and randomArrayBy.
* The randomValue, randomThing, randomThingOf, randomThingOfTypes, randomArrayOf, randomObjectOf, and randomObjectOfTypes functions were removed. These were meant for fuzzing purposes, but we discovered that their behavior was too unpredictable in real world applications, as you couldn't control the random generation enough. If you need to generate random inputs, combine the randomInteger, randomNumber, randomString, draw and the randomArrayBy and randomObjectByfunctions.
* The randomType, randomValueType and randomTypeExcept functions were removed. These were meant as helpers for the aforementioned functions, so they served no purpose anymore.
* The object generation function randomObjectWithDepth was removed. Its behavior can be accomplished using randomObjectBy.
* The randomObjects function was removed, as it can be built easily by combining randomArrayBy and randomObjectBy, and doing it manually gives more control.
* The randomDbRef, randomDbRefs, and randomDocument functions were removed. These were very specific to one use case, which was the use case we had when writing this library. Since then, we wanted to use the library in different contexts and even the browser, and having the dependency on mongodb proved to be a limitation.
* The words constant was removed. Get your own words ;D
* The isPrefixOf helper was removed. It does not belong in this library.
* randInt and randNum have been renamed to randomInteger and randomNumber.
* chooseN is now called sample, as it models sampling a populace.
* chooseNReplace is now called draw, as it models drawing numbers.
* randomWord is now called randomString to better match the naming of the other functions.
* randomInteger now receives a minimum and a maximum parameter.
* randomNumber now receives a minimum and a maximum parameter.
* randomArrayBy now receives an exact length instead of randomizing the length based on the given parameter.
* randomObjectBy now receives an exact length instead of randomizing the length based on the given parameter.
* randomString now receives an exact length instead of randomizing the length based on the given parameter.

## [1.1.1](https://github.com/strangedev/zufall/compare/v1.1.0...v1.1.1) (2021-05-25)


### Bug Fixes

* Declare module correctly. ([#9](https://github.com/strangedev/zufall/issues/9)) ([f85b998](https://github.com/strangedev/zufall/commit/f85b998540f5bfca16a081417f31a456394af256))

# [1.1.0](https://github.com/strangedev/zufall/compare/v1.0.2...v1.1.0) (2021-05-25)


### Features

* Add type declaration file. ([#8](https://github.com/strangedev/zufall/issues/8)) ([cda7bda](https://github.com/strangedev/zufall/commit/cda7bda46d66c740345433cb0976b50385e839f6))

## [1.0.2](https://github.com/strangedev/zufall/compare/v1.0.1...v1.0.2) (2021-05-25)


### Bug Fixes

* security updates ([c7da414](https://github.com/strangedev/zufall/commit/c7da4142177e0223143fef618ae0c8e01d4e9f16))
