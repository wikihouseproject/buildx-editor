const _areas = require('./figures/areas')
const estimates = require('./figures/estimates')
const _volumes = require('./figures/volumes')
const _dimensions = require('./figures/dimensions')

const _points = require('./points')
const _pieces = require('./pieces')

const figures = (inputs, points) => {

  const dimensions = _dimensions(inputs, points)
  const areas = _areas(inputs, dimensions, points)
  const volumes = _volumes(inputs, dimensions, points, areas)

  return {
    areas,
    dimensions,
    volumes,
    estimates: estimates(inputs, volumes),
  }
}

exports.figures = figures;
exports.points = _points;
exports.pieces = _pieces;
