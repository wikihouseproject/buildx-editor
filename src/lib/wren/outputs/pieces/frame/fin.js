// The fin is the shape of the frame of a wikihouse.

const Point = require('../../../utils/point')
const List = require('../../../utils/list')
const { compose } = require('ramda')
const { curry, zipObject, flatten } = require('lodash')

const draw = (points, useComplexShapes) => {
  const arrayLength = Object.values(points.outer).length
  const si = List.safeIndex(arrayLength)

  let shapes = []

  for (let i = 0; i < arrayLength; i++) {
    let shape = [
      points.outer[si(i-1)].MID,
      points.outer[i].START,
      points.outer[i].MID,
      points.inner[i].MID,
      points.inner[i].START,
      points.inner[si(i-1)].MID,
    ]
    if (useComplexShapes > 0) {
      shape = flatten(List.loopifyInPairs(shape).map(points => Point.squigglify(15)(...points) ))
    }
    shapes.push(shape)
  }

  return shapes
}

const returnWithMidpoints = ([start,end]) => {
  return ([start, Point.midpoint(start,end), end])
}

const fin = (points, useComplexShapes) => {

  const withMidpoints = compose(
    curry(zipObject)(['START', 'MID', 'END']),
    returnWithMidpoints,
  )

  const pointsWithMidPoints = {
    outer: List.loopifyInPairs(Object.values(points.outer)).map(withMidpoints),
    inner: List.loopifyInPairs(Object.values(points.inner)).map(withMidpoints)
  }

  return draw(pointsWithMidPoints, useComplexShapes)
}

module.exports = fin
