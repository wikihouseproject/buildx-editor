const Point = require('../../utils/point')
// const { test, given } = require('sazerac')

it('calculates the midpoint of 2 points', () => {
  const points = [[0,0],[10,10]]
  expect(Point.midpoint(...points)).toEqual([5,5])
})

// test(Point.midpoint, () => {
//   given([0,0],[10,10]).expect([5,5])
//   given([-10,-10],[-5,10]).expect([-7.5,0])
// })

it('makes a line squiggly', () => {
  const points = [[1,1],[5,5]]
  const result = [
    [1, 1],
    [1.2585786437626905, 1.5414213562373094],
    [1.7292893218813452, 1.8707106781186549],
    [2.0585786437626905, 2.34142135623731],
    [2.5292893218813455, 2.6707106781186547],
    [2.8585786437626903, 3.1414213562373097],
    [3.3292893218813453, 3.4707106781186545],
    [3.65857864376269, 3.9414213562373095],
    [4.129289321881346, 4.270710678118655],
    [4.45857864376269, 4.741421356237309],
    [5, 5]
  ]
  expect(Point.squigglify(0.1)(...points)).toEqual(result)
})

it('calculates point on line', () => {
  const points = [[0,0],[10,10]]
  const result = [1.414213562373095, 1.414213562373095]
  expect(Point.pointOnLine(2)(...points)).toEqual(result)
})

it('calculates angle between points', () => {
  const points = [[0,0],[10,10]]
  const result = [1.414213562373095, 1.414213562373095]
  expect(Point.pointOnLine(2)(...points)).toEqual(result)
})

it('calculates distance between 2 points', () => {
  const points = [[-10,-10],[10,10]]
  expect(Point.distance(...points)).toEqual(28.284271247461902)
})

it('can get min/max points (bounding box) from set of points', () => {
  const points = [
    [-3,4],
    [10,300],
    [-4.3,-120]
  ]
  const result = { minX: -4.3, minY: -120, maxX: 10, maxY: 300}
  expect(Point.getBounds(points)).toEqual(result)
})
