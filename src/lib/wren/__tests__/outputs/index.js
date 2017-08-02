const defaults = require('../../defaults')
const outputs = require('../../outputs')(defaults)

it('returns object', () => {
  expect(outputs).toHaveProperty('areas')
  expect(outputs).toHaveProperty('dimensions')
  expect(outputs).toHaveProperty('points')
  expect(outputs).toHaveProperty('estimates')
  expect(outputs).toHaveProperty('volumes')
});
