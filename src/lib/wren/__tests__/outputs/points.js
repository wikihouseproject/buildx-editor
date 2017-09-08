const defaults = require("../../defaults");
const dimensions = require("../../outputs/figures/dimensions")(defaults);
const points = require("../../outputs/points")(dimensions);

it.skip("generates points with keys to indicate positions.", () => {
  //    T
  // TL   TR
  // BL   BR
  const wren = new Wren({
    dimensions: {
      width: 5000,
      leftWallHeight: 6000,
      rightWallHeight: 3000,
      roofApexHeight: 9000,
      roofApexOffset: 1000
    }
  });

  expect(wren.outputs.points.center).toEqual({
    BL: [0, 9000],
    BR: [5000, 9000],
    T: [3500, 0],
    TL: [0, 3000],
    TR: [5000, 6000]
  });
});
