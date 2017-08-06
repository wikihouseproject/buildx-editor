const defaults = require('../../../defaults')
// const points = require('../../../outputs/points')(defaults.dimensions)
const side = require('../../../outputs/pieces/side')

it('generates a side', () => {

  const points = [
    [0, 3900],
    [0, 1500],
  ]

  expect(side(defaults)(points)).toEqual([{
    pts: [[0, 2400], [1200, 2400], [1200, 0], [0, 0]],
    pos: {x: 0, y: 0, z: 0},
    rot: {order: 'XYZ', x: 0, y: 0, z: 0}
  }])

})


it('generates multiple pieces for a side longer than materials.plywood.maxHeight', () => {

  const points = [
    [1950,0],
    [3900,1500]
  ]

  expect(side(defaults)(points)).toEqual([
    {
      pts: [[0, 2400], [1200, 2400], [1200, 0], [0, 0]],
      pos: {x: 0, y: 0, z: 0},
      rot: {order: 'XYZ', x: 0, y: 0, z: 0}
    },
    {
      pts: [[0, 60.18292002850876], [1200, 60.18292002850876], [1200, 0], [0, 0]],
      pos: {x: 0, y: 0, z: 0},
      rot: {order: 'XYZ', x: 0, y: 0, z: 0}
    }
  ])

})
