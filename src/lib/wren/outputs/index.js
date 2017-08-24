const _areas = require('./figures/areas')
const estimates = require('./figures/estimates')
const _volumes = require('./figures/volumes')
const _dimensions = require('./figures/dimensions')

const _points = require('./points')
const _pieces = require('./pieces')
const cutsheet = require('./cutsheet')

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
      svg: (options={}) => {
        const sheet = cutsheet.layout(pieces, options)
        return cutsheet.exportSVG(sheet)
      }
    },
    pieces,
    points
  }
}

outputs.points = _points;
outputs.pieces = _pieces;

module.exports = outputs
