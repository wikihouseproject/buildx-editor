const { compose } = require('ramda')

const makeClosedPathFromPoints = points => {
  const start = `M${points[0]} L`
  const middle = points.slice(1).map(point => `${point}`).join(" ")
  return `${start}${middle}z`
}

const svg = elements => `<svg xmlns="http://www.w3.org/2000/svg">${elements.join()}</svg>`
const g = elements => `<g>${elements.join("")}</g>`
const path = points => `<path d="${makeClosedPathFromPoints(points)}"></path>`

const wrap = item => ([item])

const drawSVG = compose(
  svg,
  wrap,
  g,
  wrap,
  path
)

module.exports = {
  path,
  g,
  svg,
  drawSVG
}
