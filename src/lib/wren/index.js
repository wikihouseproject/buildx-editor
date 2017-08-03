const defaults = require('./defaults')
const { merge } = require('lodash')
const _outputs = require('./outputs')

function Wren(overrides) {
  const inputs = merge(defaults, overrides)
  const outputs = _outputs(inputs)

  const toSVG = () => outputs.formats.svg()

  return {
    inputs,
    outputs,
    toSVG
  }
}

module.exports = Wren
