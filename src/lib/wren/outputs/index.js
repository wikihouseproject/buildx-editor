const _areas = require('./figures/areas')
const estimates = require('./figures/estimates')
const volumes = require('./figures/volumes')
const _points = require('./points')
const _dimensions = require('./figures/dimensions')
const _pieces = require('./pieces')
// const Point = require('../utils/point')
const SVG = require('./formats/svg')
// const CSV = require('./formats/csv')

const outputs = inputs => {
  const dimensions = _dimensions(inputs)
  const points = _points(inputs.dimensions)
  const pieces = _pieces(points, dimensions)
  const areas = _areas(inputs, dimensions, points)
  return {
    figures: {
      areas,
      dimensions,
      estimates: estimates(dimensions),
      volumes: volumes(inputs, dimensions, points, areas)
    },
    formats: {
      csv: null,
      svg: () => pieces.fins[0].map(SVG.drawSVG).join("\n")
    },
    pieces,
    points
  }
}

module.exports = outputs
