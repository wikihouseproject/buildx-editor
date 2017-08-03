const side = require('../../../outputs/pieces/side')

it('generates a roof', () => {
  const params = {
    height: 200,
    width: 100
  }
  expect(side(params)).toEqual([
    [0,200],
    [100,200],
    [100,0],
    [0,0]
  ])
})
