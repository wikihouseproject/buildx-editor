const defaults = require('../../../defaults')
const dimensions = require('../../../outputs/figures/dimensions')(defaults)
const {internal, external} = require('../../../outputs/figures/areas')(dimensions)

it('calculates areas in mm²', () => {
  expect(external.footprint).toEqual(50467500)
  expect(internal.floor).toEqual(37676012)

  // expect(internal.roof).toEqual(48830972.21805112) //49240

  // expect(outputs).toHaveProperty('areas.intRoof', 49240),
  // expect(outputs).toHaveProperty('areas.intWall', 88890),
  // expect(outputs).toHaveProperty('areas.openings', 14660),
  // expect(outputs).toHaveProperty('areas.surface', 185440)
});
