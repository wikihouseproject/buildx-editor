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
