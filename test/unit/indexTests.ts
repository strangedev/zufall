import { assert } from 'assertthat';
import { choose, draw, randomArrayBy, randomBoolean, randomInteger, randomNumber, randomObjectBy, randomString, sample, shuffle } from '../..';

const numbers = [ '1', '2', '3', '4', '5' ];
// eslint-disable-next-line id-length
const m = numbers.length;
const createBuckets = (ary: any[]): Record<any, number> => {
  const buckets = {} as Record<any, number>;

  ary.forEach((element): void => {
    buckets[element] = 0;
  });

  return buckets;
};
const epsilon = 0.1;
const largeN = 10_000;
const smallN = 100;
const tinyN = 10;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, id-length
const relDist = (E: number) => (x: number) => Math.abs(1 - (E / x));
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, id-length
const withinEpsilonOf = (E: number) => (x: number) => relDist(E)(x) < epsilon;

suite('zufall', (): void => {
  suite('draw', (): void => {
    test('chooses from an array with replacement.', async (): Promise<void> => {
      for (let i = 0; i < smallN; i += 1) {
        const sampleLength = randomInteger(smallN);
        const drawn = draw(numbers, sampleLength);

        drawn.forEach((drawnNumber): void => {
          assert.that(numbers).is.containing(drawnNumber);
        });

        assert.that(drawn.length).is.equalTo(sampleLength);
      }
    });
  });
  suite('choose', (): void => {
    test('chooses from an array uniformly.', async (): Promise<void> => {
      const buckets = createBuckets(numbers);

      for (let i = 0; i < largeN; i += 1) {
        const choice = choose(numbers);

        buckets[choice] += 1;
      }
      // eslint-disable-next-line id-length
      const E = largeN / m;

      for (const bucket of Object.values(buckets)) {
        assert.that(withinEpsilonOf(E)(bucket)).is.true();
      }
    });
  });
  suite('sample', (): void => {
    test('chooses a subset of length n without replacement.', async (): Promise<void> => {
      for (let i = 0; i < smallN; i += 1) {
        const sampleLength = randomInteger(m);
        const sampled = sample(numbers, sampleLength);

        sampled.forEach((sampledItem): void => {
          assert.that(numbers).is.containing(sampledItem);
          assert.that(sampled.filter((item): boolean => item === sampledItem).length).is.atMost(1);
        });

        assert.that(sampled.length).is.equalTo(sampleLength);
      }
    });
    test('throws an error, when n is greater than the number of choices.', async (): Promise<void> => {
      assert.that((): void => {
        sample(numbers, m + 1);
      }).is.throwing();
    });
  });
  suite('shuffle', (): void => {
    test('does not modify the original array.', async (): Promise<void> => {
      for (let i = 0; i < largeN; i += 1) {
        const original = [ 1, 2, 3, 4 ];

        shuffle(original);

        assert.that(original).is.equalTo([ 1, 2, 3, 4 ]);
      }
    });
    test('shuffles an element to a random position uniformly.', async (): Promise<void> => {
      const buckets = createBuckets([ 0, 1, 2, 3, 4 ]);

      for (let i = 0; i < largeN; i += 1) {
        const original = [ 1, 0, 0, 0, 0 ];
        const shuffled = shuffle(original);
        const newIndex = shuffled.indexOf(1);

        buckets[newIndex] += 1;
      }

      // eslint-disable-next-line id-length
      const E = largeN / 5;

      for (const bucket of Object.values(buckets)) {
        assert.that(withinEpsilonOf(E)(bucket)).is.true();
      }
    });
  });
  suite('randomArrayBy', (): void => {
    test('generates an array by calling the generatorFn, passing the current state of the array and the index.', async (): Promise<void> => {
      const array = randomArrayBy(
        (i, currentArray: number[][]): number[] => [ i, ...i === 0 ? [] : currentArray[i - 1] ],
        5
      );

      assert.that(array).is.equalTo([
        [ 0 ],
        [ 1, 0 ],
        [ 2, 1, 0 ],
        [ 3, 2, 1, 0 ],
        [ 4, 3, 2, 1, 0 ]
      ]);
    });
  });
  suite('randomBoolean', (): void => {
    test('returns only true or false.', async (): Promise<void> => {
      for (let i = 0; i < largeN; i += 1) {
        const boolean = randomBoolean();

        assert.that([ true, false ]).is.containing(boolean);
      }
    });
    test('chooses from true and false uniformly.', async (): Promise<void> => {
      const buckets = createBuckets([ 0, 1 ]);

      for (let i = 0; i < largeN; i += 1) {
        const boolean = randomBoolean();

        buckets[Number(boolean)] += 1;
      }

      // eslint-disable-next-line id-length
      const E = largeN / 2;

      for (const bucket of Object.values(buckets)) {
        assert.that(withinEpsilonOf(E)(bucket)).is.true();
      }
    });
  });
  suite('randomInteger', (): void => {
    test('chooses an integer in [0;Number.MAX_VALUE) .', async (): Promise<void> => {
      for (let i = 0; i < largeN; i += 1) {
        const anInt = randomInteger();

        assert.that(typeof anInt).is.equalTo('number');
        assert.that(anInt).is.atLeast(0);
        assert.that(anInt).is.lessThan(Number.MAX_VALUE);
      }
    });
    test('chooses an integer in [-10;4).', async (): Promise<void> => {
      for (let i = 0; i < largeN; i += 1) {
        const anInt = randomInteger(-10, 4);

        assert.that(typeof anInt).is.equalTo('number');
        assert.that(anInt).is.atLeast(-10);
        assert.that(anInt).is.lessThan(4);
      }
    });
    test('chooses an integer in [23;1033).', async (): Promise<void> => {
      for (let i = 0; i < largeN; i += 1) {
        const anInt = randomInteger(23, 1_033);

        assert.that(typeof anInt).is.equalTo('number');
        assert.that(anInt).is.atLeast(23);
        assert.that(anInt).is.lessThan(1_033);
      }
    });
    test('chooses from [0;6) uniformly.', async (): Promise<void> => {
      const buckets = createBuckets([ 0, 1, 2, 3, 4, 5 ]);

      for (let i = 0; i < largeN; i += 1) {
        const anInt = randomInteger(0, 6);

        buckets[anInt] += 1;
      }

      // eslint-disable-next-line id-length
      const E = largeN / 6;

      for (const bucket of Object.values(buckets)) {
        assert.that(withinEpsilonOf(E)(bucket)).is.true();
      }
    });
  });
  suite('randomNumber', (): void => {
    test('chooses a float in [0;Number.MAX_VALUE) .', async (): Promise<void> => {
      for (let i = 0; i < largeN; i += 1) {
        const aNum = randomNumber();

        assert.that(typeof aNum).is.equalTo('number');
        assert.that(aNum).is.atLeast(0);
        assert.that(aNum).is.lessThan(Number.MAX_VALUE);
      }
    });
    test('chooses a float in [-10;4).', async (): Promise<void> => {
      for (let i = 0; i < largeN; i += 1) {
        const aNum = randomNumber(-10, 4);

        assert.that(typeof aNum).is.equalTo('number');
        assert.that(aNum).is.atLeast(-10);
        assert.that(aNum).is.lessThan(4);
      }
    });
    test('chooses a float in [23;1033).', async (): Promise<void> => {
      for (let i = 0; i < largeN; i += 1) {
        const aNum = randomNumber(23, 1_033);

        assert.that(typeof aNum).is.equalTo('number');
        assert.that(aNum).is.atLeast(23);
        assert.that(aNum).is.lessThan(1_033);
      }
    });
  });
  suite('randomObjectBy', (): void => {
    test('generates a random object by calling the generatorFn, passing the current state of the object and the index.', async (): Promise<void> => {
      const object = randomObjectBy(
        (i, currentObject): [number, any] => [ i, currentObject ],
        4
      );

      assert.that(object).is.equalTo({
        0: {},
        1: { 0: {}},
        2: { 1: { 0: {}}, 0: {}},
        3: { 2: { 1: { 0: {}}, 0: {}}, 1: { 0: {}}, 0: {}}
      });
    });
  });
  suite('randomString', (): void => {
    test('returns a string of the given length.', async (): Promise<void> => {
      for (let i = 0; i < tinyN; i += 1) {
        const string = randomString(i);

        assert.that(string.length).is.equalTo(i);
        assert.that(typeof string).is.equalTo('string');
      }
    });
  });
});
