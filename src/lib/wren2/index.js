const defaults = require('./defaults')
const Polygon = require('./patterns/polygon')
const _points = require('./includes/points')
const _dimensions = require('./includes/dimensions')
const math = require('mathjs')
const { merge } = require('lodash')

const { fin, side } = require('./pieces')

function Wren(overrides) {

  const inputs = merge(defaults, overrides)

  const points = _points(inputs.dimensions)
  const dimensions = _dimensions(inputs)

  const _roof = () => {
    const rightRoof = [points.inner[2], points.inner[3]]
    const leftRoof = [points.inner[3], points.inner[4]]
    return math.distance(...rightRoof)
  }

  const _pieces = () => {
    return {
      fins: [
        fin(points)
      ],
      sides: {
        leftWall: side({
          width: inputs.dimensions.bayLength,
          height: inputs.dimensions.leftWallHeight
        }),
        rightWall: side({
          width: inputs.dimensions.bayLength,
          height: inputs.dimensions.leftWallHeight
        }),
        floor: side({
          width: inputs.dimensions.bayLength,
          height: dimensions.internal.width
        })
      }
    }
  }

  const _outputs = () => {
    const r = _roof()
    return {
      pieces: _pieces(),
      dimensions,
      areas: {
        internal: {
          floor: dimensions.internal.width * dimensions.internal.length,
          roof: (r * dimensions.internal.length)*2,
          // wall: 88890,
        },
        external: {
          footprint: dimensions.external.width * dimensions.external.length,
        }
      },
      volumes: {
        insulation: 420960
      },
      calculations: {
        estimatedSheets: 200
      }
    }
  }

  return {
    inputs,
    outputs: _outputs(),
    points
  }
}

module.exports = Wren
