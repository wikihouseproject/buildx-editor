const defaults = require('../../../defaults')
const dimensions = require('../../../outputs/figures/dimensions')(defaults)

it('outputs dimensions in mm', () => {
  const { internal, external } = dimensions;
  expect(internal.width).toEqual(3553)
  expect(external.width).toEqual(4486)
  expect(internal.length).toEqual(10604)
  expect(external.length).toEqual(11250)
});
