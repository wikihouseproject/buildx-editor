const defaults = require('../../defaults')
const points = require('../../outputs/points')(defaults.dimensions)

const _dimensions = require('../../outputs/figures/dimensions')
const _areas = require('../../outputs/figures/areas')
const _volumes = require('../../outputs/figures/volumes')
const _estimates = require('../../outputs/figures/estimates')

const dimensions = _dimensions(defaults, points)
const areas = _areas(defaults, dimensions, points, 'm2')

describe('dimensions', () => {
  it('outputs dimensions in mm', () => {
    expect(dimensions).toEqual({
      internal: {
        width: 3553,
        length: 10604
      },
      external: {
        width: 4486,
        length: 11250,
        height: 4486
      }
    })
  });
})

describe('areas', () => {
  it('calculates areas in m²', () => {
    expect(areas).toEqual({
      internal: {
        floor: 37.676012, // 75.34
        walls: 72.18142209335001, // 88.89
        roof: 48.830972218051116, // 49.24
        endWall: 10.641111046675002, // 10.41
        // ceilingHeight: x (if more than 1 storey)
      },
      external: {
        footprint: 50.4675,
        endWall: 14.046202506499998
        // surface: 185.44,
      }
    })
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
})

describe('volumes', () => {
  const areas = _areas(defaults, dimensions, points)
  const volumes = _volumes(defaults, dimensions, points, areas, 'm3')

  it('calculates volumes in m³', () => {
    expect(volumes).toEqual({
      internal: {
        total: 112.83834153894173,
        endWall: 2.660277761668751,
        insulation: 6.1718283882937515,
      },
      external: {
        total: 158.01977819812498,
        endWall: 3.5115506266249996
      },
      materials: {
        singleSheet: 0.0535824
      }
    })
  });
})

describe('estimates', () => {
  const areas = _areas(defaults, dimensions, points)
  const volumes = _volumes(defaults, dimensions, points, areas)
  const estimates = _estimates(defaults, volumes)
  // const estimates
  it('estimates number of sheets required', () => {
    expect(estimates.sheets).toEqual(200)
  });
})
