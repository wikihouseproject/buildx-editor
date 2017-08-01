const fin = require('../../pieces/fin')
const Wren = require('../../index')
const wren = Wren({
  dimensions: {
    width: 5000,
    height: 3000
  }
})

// console.log(wren.points)

it('generates a fin', () => {
  expect(fin(wren.points)).toEqual([
    [-125, 1429.226203],
    [2500, -145.773797],
    [5125, 1429.226203],
    [4875, 1570.773797],
    [2500, 145.773797],
    [125, 1570.773797]
  ])
})
