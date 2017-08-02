const defaults = require('../../../defaults')
const dimensions = require('../../../outputs/figures/dimensions')(defaults)
const estimates = require('../../../outputs/figures/estimates')(dimensions)

it('estimates number of sheets required', () => {
  expect(estimates.sheets).toEqual(200)
});
