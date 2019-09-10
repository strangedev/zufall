const UUT = require("../");
const R = require("ramda");

const xs = ["1", "2", "3", "4", "5"];
const m = xs.length;
const createBuckets = ary => {
  const buckets = {};
  ary.forEach(element => {
    buckets[element] = 0;
  });
  return buckets;
};
const epsilon = 0.1;
const n = 10000;
const small_n = 100;
const tiny_n = 10;
const max_nesting = 4;

const relDist = E => x => Math.abs(1 - E / x);
const withinEpsilonOf = E => x => relDist(E)(x) < epsilon;
const isDbRef = R.allPass([R.is(Object), R.has("id"), R.has("collection")]);

describe("choose()", () => {
  it("chooses from a array uniformly", () => {
    const buckets = createBuckets(xs);
    for (let i = 0; i < n; i++) {
      const choice = UUT.choose(xs);
      buckets[choice]++;
    }
    const E = n / m;
    expect(R.all(withinEpsilonOf(E), Object.values(buckets))).toBe(true);
  });
});

describe("chooseN", () => {
  it("chooses a subset of length n without replacement", () => {
    for (let i = 0; i < small_n; i++) {
      const sampleLength = UUT.randInt(m);
      const sample = UUT.chooseN(xs, sampleLength);
      sample.forEach(s => {
        expect(xs).toContain(s);
        expect(sample.filter(R.equals(s))).toHaveLength(1);
      });
      expect(sample.length).toBe(sampleLength);
    }
  });
  it("throws an error, when n is greater than the number of choices", () => {
    expect(() => UUT.chooseN(xs, m + 1)).toThrow();
  });
});

describe("chooseNReplace", () => {
  it("chooses n times with replacement", () => {
    const sample = UUT.chooseNReplace(xs, 2 * m);
    sample.forEach(s => {
      expect(xs).toContain(s);
      expect(sample.filter(R.equals(s)).length).toBeGreaterThanOrEqual(1);
    });
    expect(R.any(s => sample.filter(R.equals(s)).length > 1, sample)).toBe(
      true
    );
    expect(sample.length).toBe(2 * m);
  });
});

describe("isPrefixOf()", () => {
  it("is true, if second arg is prefix of first", () => {
    for (let i = 0; i <= xs.length; i++) {
      const prefix = xs.slice(0, i);
      expect(UUT.isPrefixOf(xs, prefix)).toBe(true);
    }
  });
  it("is false, if second arg is not prefix of first", () => {
    const ys = R.reverse(xs);
    for (let i = 1; i <= ys.length; i++) {
      const nonPrefix = ys.slice(0, i);
      expect(UUT.isPrefixOf(xs, nonPrefix)).toBe(false);
    }
  });
});

describe("typeOf", () => {
  it("returns the type of something as compatible string for use with zufall", () => {
    expect(UUT.typeOf(1)).toBe("integer");
    expect(UUT.typeOf(1.1)).toBe("number");
    expect(UUT.typeOf("1")).toBe("string");
    expect(UUT.typeOf([])).toBe("Array");
    expect(UUT.typeOf({})).toBe("Object");
    expect(UUT.typeOf(null)).toBe("null");
    expect(UUT.typeOf(undefined)).toBe("undefined");
    expect(UUT.typeOf(NaN)).toBe("NaN");
  });
});

describe("randomType()", () => {
  it("chooses a type string from TYPES uniformly", () => {
    const buckets = createBuckets(UUT.TYPES);
    for (let i = 0; i < n; i++) {
      const choice = UUT.randomType();
      buckets[choice]++;
    }
    const E = n / UUT.TYPES.length;
    expect(R.all(withinEpsilonOf(E), Object.values(buckets))).toBe(true);
  });
});

describe("randomValueType()", () => {
  it("chooses a type string from VALUE_TYPES uniformly", () => {
    const buckets = createBuckets(UUT.VALUE_TYPES);
    for (let i = 0; i < n; i++) {
      const choice = UUT.randomValueType();
      buckets[choice]++;
    }
    const E = n / UUT.VALUE_TYPES.length;
    expect(R.all(withinEpsilonOf(E), Object.values(buckets))).toBe(true);
  });
});

describe("randomTypeExcept()", () => {
  it("chooses a type string from TYPES uniformly", () => {
    const buckets = createBuckets(UUT.TYPES);
    for (let i = 0; i < n; i++) {
      const choice = UUT.randomTypeExcept([]);
      buckets[choice]++;
    }
    const E = n / UUT.TYPES.length;
    expect(R.all(withinEpsilonOf(E), Object.values(buckets))).toBe(true);
  });
  it("does not choose an exempted type", () => {
    const buckets = createBuckets(UUT.OBJECT_TYPES);
    for (let i = 0; i < n; i++) {
      const choice = UUT.randomTypeExcept(UUT.VALUE_TYPES);
      buckets[choice]++;
    }
    const E = n / UUT.OBJECT_TYPES.length;
    expect(R.all(withinEpsilonOf(E), Object.values(buckets))).toBe(true);
  });
});

describe("randInt()", () => {
  it("chooses an integer in [0;n) ", () => {
    for (let i = 0; i < n; i++) {
      const anInt = UUT.randInt(n);
      expect(anInt).toBeGreaterThanOrEqual(0);
      expect(anInt).toBeLessThan(n);
      expect(UUT.typeOf(anInt)).toBe("integer");
    }
  });
});

describe("randNum()", () => {
  it("chooses a float in [0;n) ", () => {
    for (let i = 0; i < n; i++) {
      const aNum = UUT.randNum(n);
      expect(aNum).toBeGreaterThanOrEqual(0);
      expect(aNum).toBeLessThan(n);
      expect(UUT.typeOf(aNum)).toBe("number");
    }
  });
});

describe("randomWord()", () => {
  it("generates a random word", () => {
    for (let i = 0; i < n; i++) {
      expect(UUT.typeOf(UUT.randomWord())).toBe("string");
    }
  });
});

describe("randomValue()", () => {
  it("generates a random value that is not an Array or Object", () => {
    for (let i = 0; i < n; i++) {
      const aValue = UUT.randomValue();
      expect(R.is(Array, aValue)).toBe(false);
      expect(R.is(Object, aValue)).toBe(false);
      expect(UUT.VALUE_TYPES.includes(UUT.typeOf(aValue)));
    }
  });
});

describe("randomArray()", () => {
  it("generates an array of maximum length n with elements of one random VALUE_TYPE", () => {
    for (let i = 0; i < small_n; i++) {
      const ary = UUT.randomArray(tiny_n);
      expect(ary.length).toBeGreaterThanOrEqual(0);
      expect(ary.length).toBeLessThan(tiny_n);
      ary.forEach(x => {
        expect(R.is(Array, x)).toBe(false);
        expect(R.is(Object, x)).toBe(false);
        expect(UUT.VALUE_TYPES.includes(UUT.typeOf(x)));
      });
    }
  });
});

describe("randomArrayOf()", () => {
  it("generates an array of maximum length n with elements of the given type", () => {
    for (let i = 0; i < small_n; i++) {
      const aType = UUT.randomType();
      const ary = UUT.randomArrayOf(aType, tiny_n);
      expect(ary.length).toBeGreaterThanOrEqual(0);
      expect(ary.length).toBeLessThan(tiny_n);
      ary.forEach(x => {
        expect(UUT.typeOf(x) === aType);
      });
    }
  });
});

describe("randomArrayBy()", () => {
  const generatorFn = jest.fn(xs => xs.length);
  it("generates an array of maximum length n", () => {
    for (let i = 0; i < small_n; i++) {
      const ary = UUT.randomArrayBy(generatorFn, tiny_n);
      expect(ary.length).toBeGreaterThanOrEqual(0);
      expect(ary.length).toBeLessThan(tiny_n);
    }
  });
  it("generates an array by calling the generatorFn, passing the current state of the array", () => {
    for (let i = 0; i < small_n; i++) {
      const ary = UUT.randomArrayBy(generatorFn, tiny_n);
      ary.forEach(x => {
        expect(UUT.typeOf(x) === "integer");
      });
      for (let j = 0; j < ary.length; j++) {
        expect(ary[j]).toBe(j);
      }
    }
  });
});

describe("randomObject()", () => {
  it("generates a random object with a maximum of n values of random VALUE_TYPEs", () => {
    for (let i = 0; i < small_n; i++) {
      const o = UUT.randomObject(tiny_n);
      const values = Object.values(o);
      values.forEach(v => expect(UUT.VALUE_TYPES.includes(UUT.typeOf(v))));
      expect(values.length).toBeGreaterThanOrEqual(0);
      expect(values.length).toBeLessThan(tiny_n);
    }
  });
});

describe("randomObjects()", () => {
  it("generates an array of length n containing random Objects with a maximum of 16 values of random VALUE_TYPEs", () => {
    for (let i = 0; i < small_n; i++) {
      const os = UUT.randomObjects(tiny_n);
      expect(os.length).toBe(tiny_n);
      os.forEach(o => {
        expect(UUT.typeOf(o)).toBe("Object");
        const values = Object.values(o);
        values.forEach(v => expect(UUT.VALUE_TYPES.includes(UUT.typeOf(v))));
        expect(values.length).toBeGreaterThanOrEqual(0);
        expect(values.length).toBeLessThan(16);
      });
    }
  });
});

describe("randomObjectOf()", () => {
  it("generates a random object with a maximum of n values of a given type", () => {
    UUT.TYPES.forEach(t => {
      const o = UUT.randomObjectOf(t);
      Object.values(o).forEach(v => {
        if (t === "number")
          expect(["integer", "number"].includes(UUT.typeOf(v))).toBe(true);
        else expect(UUT.typeOf(v)).toBe(t);
      });
    });
  });
});

describe("randomObjectBy()", () => {
  it("generates a random object with a maximum of n values by calling the generatorFn, passing the current state of the object", () => {
    const generatorFn = jest.fn(o => Object.keys(o).length);
    for (let i = 0; i < small_n; i++) {
      const o = UUT.randomObjectBy(generatorFn, tiny_n);
      const values = Object.values(o);
      const expectedValues = Array.from(Array(values.length).keys());
      expect(values).toEqual(expect.arrayContaining(expectedValues));
      expect(expectedValues).toEqual(expect.arrayContaining(values));
    }
  });
});

describe("randomObjectOfTypes", () => {
  for (let i = 1; i < UUT.TYPES.length; i++) {
    const someTypes = UUT.chooseN(UUT.TYPES, i);
    for (let j = 0; j < tiny_n; j++) {
      const anObject = UUT.randomObjectOfTypes(someTypes);
      for (const value of Object.values(anObject)) {
        const theType = UUT.typeOf(value);
        if (theType === "integer" && someTypes.includes("number")) continue;
        expect(someTypes).toContain(theType);
      }
    }
  }
});

describe("randomObjectWithDepth()", () => {
  it("generates a random object with guaranteed nesting depth by recursively calling randomObject", () => {
    const depth = (acc, x) => {
      if (UUT.typeOf(x) != "Object") return acc;
      return Math.max(...R.map(y => depth(acc + 1, y), Object.values(x)));
    };
    for (let i = 0; i < tiny_n; i++) {
      const o = UUT.randomObjectWithDepth(max_nesting, tiny_n);
      expect(depth(0, o)).toBe(max_nesting);
    }
  });
});

describe("randomThing()", () => {
  it("generates a random thing of random type", () => {
    for (let i = 0; i < small_n; i++) {
      expect(UUT.TYPES).toContain(UUT.typeOf(UUT.randomThing()));
    }
  });
});

describe("randomThingOf()", () => {
  it("generates a random thing of a given type", () => {
    UUT.TYPES.forEach(t => {
      const aThing = UUT.randomThingOf(t);
      const theType = UUT.typeOf(aThing);
      if (t === "number") expect(["integer", "number"]).toContain(theType);
      else expect(theType).toBe(t);
    });
  });
});

describe("randomThingOfTypes()", () => {
  it("generates a random thing of a type chosen randomly from the given types", () => {
    for (let i = 0; i < small_n; i++) {
      expect(UUT.VALUE_TYPES).toContain(
        UUT.typeOf(UUT.randomThingOfTypes(UUT.VALUE_TYPES))
      );
    }
  });
});

describe("randomDbRef()", () => {
  it("generates a random object following the DbRef format", () => {
    for (let i = 0; i < small_n; i++) {
      expect(isDbRef(UUT.randomDbRef())).toBe(true);
    }
  });
});

describe("randomDbRefs()", () => {
  it("generates an Array of length n of DbRef objects", () => {
    const dbrefs = UUT.randomDbRefs(small_n);
    expect(dbrefs.length).toBe(small_n);
    dbrefs.forEach(dbref => {
      expect(isDbRef(dbref)).toBe(true);
    });
  });
});

describe("randomDocument()", () => {
  it("generates a random Object containing DbRefs; returns the document, all referenced collections and a list of all paths to DbRefs within the document", () => {
    for (let i = 0; i < tiny_n; i++) {
      const { root, dbrefs, collections } = UUT.randomDocument(max_nesting);
      expect(UUT.typeOf(root)).toBe("Object");
      for (const [path, expected] of dbrefs.entries()) {
        const dbrefInDocument = R.path(path, root);
        expect(dbrefInDocument).toStrictEqual(expected);
        expect(isDbRef(dbrefInDocument)).toBe(true);
        expect(collections).toContain(dbrefInDocument.collection);
      }
    }
  });
});
