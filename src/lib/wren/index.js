const defaults = require('./defaults')
const { merge } = require('lodash')
const _outputs = require('./outputs')

function Wren(overrides) {
  const inputs = merge(defaults, overrides)
  console.time('wren')
  const outputs = _outputs(inputs)
  console.timeEnd('wren')

  const toSVG = (options) => outputs.formats.svg(options)

  return {
    inputs,
    outputs,
    toSVG
  }
}

module.exports = Wren
