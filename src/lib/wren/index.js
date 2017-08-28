const defaults = require('./defaults')
const outputs = require('./outputs')
const cutsheet = require('./outputs/cutsheet')
const nofloTools = require('../fbptools');

const { merge } = require('lodash')

function calculateNoFlo(inputs) {
  return new Promise((resolve, reject) => {
    const calculateGeometry = nofloTools.noflo.asCallback('main') // NOTE: loads components each time
    calculateGeometry({ 'parameters': inputs }, (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results.geometry)
    })
  })
}

function calculateDirectly(inputs) {
  return new Promise((resolve, reject) => {
    const points = outputs.points(inputs.dimensions)
    const pieces = outputs.pieces(points, inputs)

    const out = { points, pieces }
    return resolve(out)
  })
}

function mergeInputs(overrides) {
  return merge(defaults, overrides)
}

function Wren(overrides) {
  const inputs = mergeInputs(overrides)
  inputs.usenoflo = false
  const calculate = (inputs.usenoflo) ? calculateNoFlo : calculateDirectly

  return calculate(inputs)
  .then((out) => {
    console.timeEnd('geometry calc')

    console.time('figures calc')
    out.figures = outputs.figures(inputs, out.points)
    console.timeEnd('figures calc')

    const toSVG = (options) => { 
      const sheet = cutsheet.layout(out.pieces, options)
      return cutsheet.exportSVG(sheet)
    }

    return Promise.resolve({
      inputs,
      outputs: out,
      toSVG
    })
  })

}

Wren.inputs = mergeInputs
Wren.outputs = outputs;
Wren.defaults = defaults;

module.exports = Wren
