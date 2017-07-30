// const { shuffle } = require('lodash')
const Polygon = require('../../patterns/polygon');

describe.skip('normalize', () => {
  it('returns points anticlockwise ordered, with bottom-left point first', () => {
    let shape = [
      [4,0],
      [14,0],
      [14,8],
      [8,7]
    ]
    expect(Polygon.normalize(shape)).toEqual([
      [4,0],
      [14,0],
      [14,8],
      [8,7]
    ])
  })
})
