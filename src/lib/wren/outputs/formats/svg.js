const { compose } = require('ramda')
const { chunk } = require('lodash')
const List = require('../../utils/list')

function _makeClosedPathFromPoints(points) {
  const start = `M${points[0]} L`
  const middle = points.slice(1).map(point => `${point}`).join(" ")
  return `${start}${middle}z`
}

function svg(elements, attributes) {
  var str = '<svg xmlns="http://www.w3.org/2000/svg"'

  for (var key in attributes) {
    var val = attributes[key].toString()
    str += `${key}="${val}"`
  }

  return str + `>${elements.join("")}</svg>`
}

const g = elements => `<g>${elements.join("")}</g>`

const path = (points, attributes={}) => {
  var str = `<path d="${_makeClosedPathFromPoints(points)}"`

  for (var key in attributes) {
    var val = attributes[key].toString()
    str += `${key}="${val}"`
  }

  return str + `></path>`
}

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
