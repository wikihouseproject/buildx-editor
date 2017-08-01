const Point = require('../utils/point')
const List = require('../utils/list')
const { compose } = require('ramda')
const { curry, zipObject } = require('lodash')

const draw = points => {
  const arrayLength = Object.values(points.outer).length
  const si = List.safeIndex(arrayLength)

  let shapes = []

  for (let i = 0; i < arrayLength; i++) {
    shapes.push([
      points.outer[si(i-1)].MID,
      points.outer[i].START,
      points.outer[i].MID,
      points.inner[i].MID,
      points.inner[i].START,
      points.inner[si(i-1)].MID,
    ])
  }

  return shapes
}

const returnWithMidpoints = ([start,end]) => {
  return ([start, Point.midpoint(start,end), end])
}

const fin = points => {

  const withMidpoints = compose(
    curry(zipObject)(['START', 'MID', 'END']),
    returnWithMidpoints,
  )

  const pointsWithMidPoints = {
    outer: List.loopifyInPairs(Object.values(points.outer)).map(withMidpoints),
    inner: List.loopifyInPairs(Object.values(points.inner)).map(withMidpoints)
  }

  return draw(pointsWithMidPoints)
}

module.exports = fin
