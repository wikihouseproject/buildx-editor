const _areas = require('./figures/areas')
const estimates = require('./figures/estimates')
const _volumes = require('./figures/volumes')
const _points = require('./points')
const _dimensions = require('./figures/dimensions')
const _pieces = require('./pieces')
// const Point = require('../utils/point')
const SVG = require('./formats/svg')
// const CSV = require('./formats/csv')

const outputs = inputs => {
  const points = _points(inputs.dimensions)
  const dimensions = _dimensions(inputs, points)
  const pieces = _pieces(points, inputs)
  const areas = _areas(inputs, dimensions, points)
  const volumes = _volumes(inputs, dimensions, points, areas)
  return {
    figures: {
      areas,
      dimensions,
      volumes,
      estimates: estimates(inputs, volumes),
    },
    formats: {
      csv: null,
      svg: () => pieces.frames[0].fins[0].map(fin => fin.pts).map(SVG.drawSVG).join("\n")
    },
    pieces,
    points
  }
}

module.exports = outputs
