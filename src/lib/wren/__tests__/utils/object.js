const O = require("../../utils/object");

it("maps over nested object and edits in place", () => {
  const a = {
    b: 2,
    c: {
      d: 4,
      e: 5
    }
  };

  const double = value => value * 2;

  const result = {
    b: 4,
    c: {
      d: 8,
      e: 10
    }
  };

  expect(O.mutatingMap(a, double)).toEqual(result);
});
