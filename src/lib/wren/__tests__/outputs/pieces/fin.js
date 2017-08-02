const { finOutput } = require('../../fixtures')

const fin = require('../../../outputs/pieces/fin')
const Wren = require('../../../index')
const wren = Wren({
  dimensions: {
    width: 5000,
    height: 3000
  }
})

// console.log(wren.points)

it('generates a fin', () => {
  expect(fin(wren.outputs.points)).toEqual(finOutput)
})
