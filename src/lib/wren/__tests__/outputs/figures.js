const defaults = require("../../defaults");
const points = require("../../outputs/points")(defaults.dimensions);

const { mutatingMap } = require("../../utils/object");
const _dimensions = require("../../outputs/figures/dimensions");
const _areas = require("../../outputs/figures/areas");
const _volumes = require("../../outputs/figures/volumes");
const _estimates = require("../../outputs/figures/estimates");

const dimensions = _dimensions(defaults, points);

describe("dimensions", () => {
  it("outputs dimensions in mm", () => {
    expect(dimensions).toEqual({
      external: {
        height: 4486,
        leftRoof: 2617.8869532698677,
        leftWall: 2586.550187,
        length: 11250,
        rightRoof: 2617.8869532698677,
        rightWall: 2586.550187,
        width: 4486
      },
      internal: {
        leftRoof: 2302.4788861774387,
        length: 10604,
        rightRoof: 2302.4788861774387,
        width: 3553
      }
    });
  });
});

describe("areas", () => {
  it("calculates areas in mm²", () => {
    const areas = mutatingMap(_areas(defaults, dimensions, points), Math.round);
    const expected = {
      external: {
        endWall: 14046203,
        footprint: 50467500,
        roof: 58902456,
        surface: 203389620
      },
      internal: {
        endWall: 10641111,
        floor: 37676012,
        roof: 48830972,
        walls: 72181422
      }
    };
    expect(areas).toEqual(expected);
  });
  // openings: {
  //   total: 14.66
  // }
  // expect(internal.materials.plasterboard).toEqual(80988)
  // expect(internal.materials.cladding).toEqual(83991)
  // expect(materials.wallCladding).toEqual(1466)

  // materials
  //   Internal lining - Plasterboard
  //   Floor underside panels
  //   Wall Cladding
  //   Roof Cladding
  //   External Membrane
  //   Internal Membrane
});

describe("volumes", () => {
  const areas = _areas(defaults, dimensions, points);
  const volumes = mutatingMap(
    _volumes(defaults, dimensions, points, areas),
    Math.round
  );

  const expected = {
    endWalls: 532055552,
    external: { endWall: 3511550627, total: 158019778198 },
    insulation: 9576819730758,
    internal: {
      endWall: 2660277762,
      insulation: 31627005661,
      total: 112838341539
    },
    materials: { singleSheet: 53582400 },
    portalFrame: 9576819730758
  };

  it("calculates volumes", () => {
    expect(volumes).toEqual(expected);
  });
});

describe("estimates", () => {
  const areas = _areas(defaults, dimensions, points);
  const volumes = _volumes(defaults, dimensions, points, areas);
  const estimates = _estimates(defaults, areas, volumes);
  // const estimates
  it("estimates number of sheets required", () => {
    expect(estimates.sheets).toEqual(220);
  });
});
