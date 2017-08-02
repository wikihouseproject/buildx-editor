const defaults = require('../../../defaults')
const dimensions = require('../../../outputs/figures/dimensions')(defaults)
const volumes = require('../../../outputs/figures/volumes')(dimensions)

it('outputs volumes in mm³', () => {
  expect(volumes.insulation).toEqual(420960)
});
