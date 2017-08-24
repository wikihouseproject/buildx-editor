const defaults = require('./defaults')
const { merge } = require('lodash')
const _outputs = require('./outputs')

function Wren(overrides) {
  const inputs = merge(defaults, overrides)
  const outputs = _outputs(inputs)

  const toSVG = (options) => outputs.formats.svg(options)

  return {
    inputs,
    outputs,
    toSVG
  }
}

Wren.outputs = _outputs;
Wren.defaults = defaults;

module.exports = Wren
