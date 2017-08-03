const defaults = require('../../defaults')
const outputs = require('../../outputs')(defaults)

it('returns object', () => {
  expect(outputs).toHaveProperty('figures.areas')
  expect(outputs).toHaveProperty('figures.dimensions')
  expect(outputs).toHaveProperty('figures.estimates')
  expect(outputs).toHaveProperty('figures.volumes')
  expect(outputs).toHaveProperty('points')
});
