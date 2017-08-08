const fin = require('../../../outputs/pieces/frame/fin')
const Wren = require('../../../index')
const wren = Wren({
  dimensions: {
    width: 5000,
    height: 3000
  }
})

it('generates a fin', () => {
  const result = [
    [
      [3812.5, 641.7262029999999],
      [5125, 1429.226203],
      [5125, 2727.1131015],
      [4875, 2672.8868985],
      [4875, 1570.773797],
      [3687.5, 858.2737970000001]
    ],[
      [5125, 2727.1131015],
      [5125, 4025],
      [2500, 4025],
      [2500, 3775],
      [4875, 3775],
      [4875, 2672.8868985]
    ],[
      [2500, 4025],
      [-125, 4025],
      [-125, 2727.1131015],
      [125, 2672.8868985],
      [125, 3775],
      [2500, 3775]
    ],[
      [-125, 2727.1131015],
      [-125, 1429.226203],
      [1187.5, 641.7262029999999],
      [1312.5, 858.2737970000001],
      [125, 1570.773797],
      [125, 2672.8868985]
    ],[
      [1187.5, 641.7262029999999],
      [2500, -145.773797],
      [3812.5, 641.7262029999999],
      [3687.5, 858.2737970000001],
      [2500, 145.773797],
      [1312.5, 858.2737970000001]
    ]
  ]

  expect(fin(wren.outputs.points)).toEqual(result)
})
