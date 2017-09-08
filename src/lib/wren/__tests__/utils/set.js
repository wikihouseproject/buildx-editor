const set = require("../../utils/set");

var setA = new Set([1, 2, 3, 4]),
  setB = new Set([2, 3]),
  setC = new Set([3, 4, 5, 6]),
  setD = new Set([7]);

it("checks if superset", () => {
  expect(set.isSuperset(setA, setB)).toBeTruthy();
  expect(set.isSuperset(setB, setA)).toBeFalsy();
});

it("joins two sets (union)", () => {
  expect(set.union(setA, setC)).toEqual(new Set([1, 2, 3, 4, 5, 6]));
});

it("joins more than two sets", () => {
  expect(set.unionAll(setA, setC, setD)).toEqual(
    new Set([1, 2, 3, 4, 5, 6, 7])
  );
});

it("finds shared values between two sets", () => {
  expect(set.intersection(setA, setC)).toEqual(new Set([3, 4]));
});

it("finds unique items in one set compared to another", () => {
  expect(set.difference(setA, setC)).toEqual(new Set([1, 2]));
});

it("finds unique items between two sets", () => {
  expect(set.symmetricDifference(setA, setC)).toEqual(new Set([1, 2, 5, 6]));
});
