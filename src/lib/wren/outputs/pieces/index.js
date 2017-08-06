const bay = require('./bay')
const { times } = require('lodash')

const pieces = (points, inputs) => {

  return {
    bays: times(inputs.dimensions.bays, (i) => bay(points, inputs, i))
  }
}

module.exports = pieces
