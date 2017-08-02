const areas = require('./figures/areas')
const estimates = require('./figures/estimates')
const volumes = require('./figures/volumes')
const _points = require('./figures/points')
const _dimensions = require('./figures/dimensions')
const _pieces = require('./pieces')
// const Point = require('../utils/point')
const SVG = require('./formats/svg')
// const CSV = require('./formats/csv')

const outputs = inputs => {
  const dimensions = _dimensions(inputs)
  const points = _points(inputs.dimensions)
  const pieces = _pieces(points, dimensions)
  return {
    pieces,
    dimensions,
    points,
    areas: areas(dimensions),
    volumes: volumes(dimensions),
    estimates: estimates(dimensions),
    svg: () => pieces.fins[0].map(SVG.drawSVG).join("\n")
  }
}

module.exports = outputs
