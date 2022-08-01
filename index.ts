import cloneDeep from 'lodash/cloneDeep';
import { defekt } from 'defekt';
import { oneLine } from 'common-tags';

class ParameterIsOutOfRange extends defekt({ code: 'ParameterIsOutOfRange' }) {}

const words = [
  [ 'fuß', 'geschwurbel', 'mate', 'laz0r', 'einhorn' ],
  [ 'saft', 'lampe', 'fliege', 'kleber', 'gedöns' ],
  [ 'zwerg', 'rundi', 'ülf', 'mauzi', 'hörnchen' ],
  [ 'punkt', 'kopf', 'random', 'atom', 'klappe' ],
  [ 'demokratie', 'lan', 'sheesh', 'chong' ],
  [ 'anne', 'gret', 'kramp', 'karren', 'bauer' ]
].flat();

const randomNumber = (minimum?: number, maximum?: number): number => {
  const min = minimum ?? 0;
  const max = (maximum ?? Number.MAX_VALUE) - min;

  return min + (Math.random() * max);
};

const randomInteger = (minimum?: number, maximum?: number): number => Math.floor(randomNumber(maximum, minimum));

const choose = <TData>(choices: TData[]): TData => choices[randomInteger(choices.length)];

const shuffle = <TData>(values: TData[]): TData[] => {
  const shuffledValues = cloneDeep(values);

  for (let i = values.length - 1; i > 0; i--) {
    const j = randomInteger(i + 1);
    const swap = shuffledValues[i];

    shuffledValues[i] = shuffledValues[j];
    shuffledValues[j] = swap;
  }

  return shuffledValues;
};

const sample = <TData>(choices: TData[], sampleSize: number): TData[] => {
  if (sampleSize > choices.length) {
    throw new ParameterIsOutOfRange({
      message: oneLine`The sample size cannot be larger than the set of choices,
      as the sample function draws without replacement.
      Maybe you are looking for the draw function instead?`
    });
  }
  if (sampleSize === choices.length) {
    return choices;
  }

  const sampledItems = [];
  const remainingIndices = new Set<number>(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    choices.map((_, index): number => index)
  );

  while (sampledItems.length < sampleSize) {
    const nextSampleIndex = choose<number>([ ...remainingIndices ]);

    sampledItems.push(choices[nextSampleIndex]);
    remainingIndices.delete(nextSampleIndex);
  }

  return sampledItems;
};

const randomArrayBy = <TData>(generatorFn: (i: number, values: TData[]) => TData, length: number): TData[] =>
  Array.from({ length }).
  // eslint-disable-next-line @typescript-eslint/naming-convention
    map((_: unknown, i: number): number => i).
    reduce<TData[]>(
    (result, currentIndex): TData[] => [
      ...result,
      generatorFn(currentIndex, result)
    ],
    []
  );

const draw = <TData>(choices: TData[], amount: number): TData[] => randomArrayBy((): TData => choose(choices), amount);

const randomBoolean = (): boolean => choose([ true, false ]);

const randomString = (length?: number): string => {
  let word = choose(words);

  if (length === undefined) {
    return word;
  }

  while (word.length < length) {
    word += choose(words);
  }

  return word.slice(0, length);
};

const randomObjectBy = <TKey extends string | number | symbol, TValue>(
  generatorFn: (i: number, currentObject: Record<TKey, TValue>) => [TKey, TValue],
  length = 16
): Record<TKey, TValue> =>
  Array.from({ length }).
    // eslint-disable-next-line @typescript-eslint/naming-convention
    map((_, i): number => i).
    reduce<Record<TKey, TValue>>(
    (currentObject, i): Record<TKey, TValue> => {
      const [ key, value ] = generatorFn(i, currentObject);

      return {
        ...currentObject,
        [key]: value
      };
    },
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as Record<TKey, TValue>
  );

export {
  draw,
  choose,
  randomArrayBy,
  randomBoolean,
  randomInteger,
  randomNumber,
  randomObjectBy,
  randomString,
  sample,
  shuffle
};
