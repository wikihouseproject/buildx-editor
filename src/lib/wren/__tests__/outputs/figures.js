const defaults = require('../../defaults')
const points = require('../../outputs/points')(defaults.dimensions)

const { mutatingMap } = require('../../utils/object')
const _dimensions = require('../../outputs/figures/dimensions')
const _areas = require('../../outputs/figures/areas')
const _volumes = require('../../outputs/figures/volumes')
const _estimates = require('../../outputs/figures/estimates')

const dimensions = _dimensions(defaults, points)


describe('dimensions', () => {
  it('outputs dimensions in mm', () => {
    expect(dimensions).toEqual({"external": {"height": 2787, "length": 1650, "width": 2986}, "internal": {"length": 1004, "width": 2053}})
  });
})

describe('areas', () => {
  it('calculates areas in mm²', () => {
    const areas = mutatingMap(_areas(defaults, dimensions, points), Math.round)
    const expected = {"external": {"endWall": 6493687, "footprint": 4926900}, "internal": {"endWall": 4193687, "floor": 2061212, "roof": 2158601, "walls": 12804974}}
    expect(areas).toEqual(expected)
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
  const volumes = mutatingMap(_volumes(defaults, dimensions, points, areas), Math.round)

  const expected = {"external": {"endWall": 1623421774, "total": 10714583705}, "internal": {"endWall": 1048421721, "insulation": 2671843495, "total": 4210461632}, "materials": {"singleSheet": 53582400}}

  it('calculates volumes', () => {
    expect(volumes).toEqual(expected)
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
