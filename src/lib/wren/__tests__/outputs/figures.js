const defaults = require('../../defaults')
const points = require('../../outputs/points')(defaults.dimensions)

const _dimensions = require('../../outputs/figures/dimensions')
const _areas = require('../../outputs/figures/areas')
const _volumes = require('../../outputs/figures/volumes')
const _estimates = require('../../outputs/figures/estimates')

const dimensions = _dimensions(defaults)

describe('dimensions', () => {
  it('outputs dimensions in mm', () => {
    const { internal, external } = dimensions;
    expect(internal.width).toEqual(3553)
    expect(external.width).toEqual(4486)
    expect(internal.length).toEqual(10604)
    expect(external.length).toEqual(11250)
  });
})

describe('areas', () => {
  const { internal, external } = _areas(defaults, dimensions, points, 'm2')
  it('calculates areas in m²', () => {
    //   Footprint Area
    expect(external.footprint).toEqual(50.4675)

    //   Ext Surface Area
    // expect(external.surface).toEqual(185.44)

    //   Int Floor Area
    expect(internal.floor).toEqual(37.676012) // 75.34

    //   Int Wall Area
    expect(internal.walls).toEqual(72.18142209335001) // 88.89

    //   Int Roof Area
    expect(internal.roof).toEqual(48.830972218051116) // 49.24

    //   Area of Openings
    // expect(openings.total).toEqual(14.66)

    //   End wall area
    expect(internal.endWall).toEqual(10.641111046675002) // 10.41
    // expect(internal.materials.plasterboard).toEqual(80988)
    // expect(internal.materials.cladding).toEqual(83991)
    // expect(materials.wallCladding).toEqual(1466)
  });
  // external.footprint

  // building

  // materials
  //   Internal lining - Plasterboard
  //   Floor underside panels
  //   Wall Cladding
  //   Roof Cladding
  //   External Membrane
  //   Internal Membrane
})

describe('volumes', () => {
  const areas = _areas(defaults, dimensions, points)
  // console.log(areas)
  const { internal, external } = _volumes(defaults, dimensions, points, areas, 'm3')
  describe('internal volumes', () => {
    it('outputs volumes in mm³', () => {
      // expect(internal.insulation).toEqual(42.090)
      expect(internal.total).toEqual(112.83834153894173)
      expect(internal.endWall).toEqual(2.660277761668751)
    });
  })
})

// // describe('estimates', () => {
// //   it('estimates number of sheets required', () => {
// //     expect(estimates.sheets).toEqual(200)
// //   });
// // })
