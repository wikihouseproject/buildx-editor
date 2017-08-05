const side = require('../../../outputs/pieces/side')

it('generates a side', () => {
  const params = {
    height: 200,
    width: 100
  }
  expect(side(params)).toEqual({
    pts: [[0, 200], [100, 200], [100, 0], [0, 0]],
    pos: {x: 0, y: 0, z: 0},
    rot: {x: 0, y: 0, z: 0}
  })
})
