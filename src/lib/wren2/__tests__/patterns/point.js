const Point = require('../../patterns/point');

it('calculates the midpoint of 2 points', () => {
  const points = [[0,0],[10,10]]
  expect(Point.midpoint(...points)).toEqual([5,5])
})
