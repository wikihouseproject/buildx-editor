const { compose } = require('ramda')
const { chunk } = require('lodash')
const Point = require('../utils/point')
const List = require('../utils/list')

const _makeClosedPathFromPoints = points => {
  const start = `M${points[0]} L`
  const middle = points.slice(1).map(point => `${point}`).join(" ")
  return `${start}${middle}z`
}

const _extractPointsFromString = string => chunk(string.match(/([\-0-9\.]+)/ig), 2)

// const viewBoxFromPoints = compose(getViewBox, getBounds)
const _calculateViewBox = (elements, padding=0) => {
  const points = _extractPointsFromString(elements.toString())
  if (points.length === 0) {
    return ""
  } else {
    const {minX, minY, maxX, maxY} = Point.getBounds(points)
    return [
      minX-padding,
      minY-padding,
      Math.abs(maxX-minX)+padding*2,
      Math.abs(maxY-minY)+padding*2
    ].join(" ")
  }
}

const svg = elements => {
  let str = '<svg xmlns="http://www.w3.org/2000/svg"'

  const viewBox = _calculateViewBox(elements)
  if (viewBox !== "") str += ` viewBox="${viewBox}"`
  //   return str + `>${adjustedElements.join("")}</svg>`
  // } else {
  return str + `>${elements.join("")}</svg>`
}

const g = elements => `<g>${elements.join("")}</g>`

const path = points =>
    `<path d="${_makeClosedPathFromPoints(points)}"></path>`

const drawSVG = compose(
  svg,
  List.wrap,
  g,
  List.wrap,
  path
)

module.exports = {
  path,
  g,
  svg,
  drawSVG
}
