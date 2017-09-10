const Wren = require("../index");

const { defaultDimensions } = require("./fixtures");

it("has default dimensions", () => {
  return Wren().then(wren => {
    expect(wren.inputs.dimensions).toEqual(defaultDimensions);
  });
});

it("can override default dimensions", () => {
  const params = { dimensions: { roofApexHeight: 3000 } };
  return Wren(params).then(wren => {
    expect(wren.inputs.dimensions.roofApexHeight).toEqual(3000);
  });
});

it("returns outputs object", () => {
  const params = { dimensions: { roofApexHeight: 3000 } };
  return Wren(params).then(wren => {
    expect(Object.keys(wren.outputs)).toEqual(["points", "pieces", "figures"]);
    expect(Object.keys(wren.outputs.figures)).toEqual([
      "areas",
      "dimensions",
      "volumes",
      "estimates",
      "metrics"
    ]);
  });
});

describe("SVG export", () => {
  describe("when passed geometry", () => {
    it("renders an SVG string", () => {
      return Wren().then(wren => {
        expect(wren.toSVG()).toMatch("</svg>");
      });
    });
  });
});
