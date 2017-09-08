const Clipper = require("../../utils/clipper");

describe("area", () => {
  it("calculates area of a concave polygon", () => {
    // useful resource: http://www.mathopenref.com/coordpolygonarea.html
    const concavePolygon = [[9, 10], [7, 5], [11, 2], [2, 2]];
    expect(Clipper.area(concavePolygon)).toEqual(23);
  });

  it("calculates area of a convex polygon", () => {
    const convexPolygon = [[1, 5], [5, 9], [9, 5], [4, 2]];
    expect(Clipper.area(convexPolygon)).toEqual(28);
  });
});

describe("offset", () => {
  const houseShape = [[0, 0], [10, 0], [10, 5], [5, 10], [0, 5]];

  it("can shrink a polygon", () => {
    expect(Clipper.offset(houseShape, { DELTA: -2 })).toEqual([
      [8, 4.171572],
      [5, 7.171572],
      [2, 4.171572],
      [2, 2],
      [8, 2]
    ]);
  });

  it("can expand a polygon", () => {
    expect(Clipper.offset(houseShape, { DELTA: 2 })).toEqual([
      [12, 5.828427],
      [5, 12.828427],
      [-2, 5.828427],
      [-2, -2],
      [12, -2]
    ]);
  });
});
