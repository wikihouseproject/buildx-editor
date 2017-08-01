const defaults = require('./defaults')
const _points = require('./includes/points')
const _dimensions = require('./includes/dimensions')
const { merge } = require('lodash')
const Point = require('./utils/point')
const Piece = require('./pieces')
const SVG = require('./outputs/svg')

function Wren(overrides) {

  const inputs = merge(defaults, overrides)
  const points = _points(inputs.dimensions)
  const dimensions = _dimensions(inputs)

  const _roof = () => {
    const rightRoof = [points.inner.T, points.inner.TR]
    const leftRoof = [points.inner.T, points.inner.TL]
    return Point.distance(...rightRoof)
  }

  const _pieces = () => {
    return {
      fins: [
        Piece.fin(points)
      ],
      sides: {
        leftWall: Piece.side({
          width: inputs.dimensions.bayLength,
          height: inputs.dimensions.leftWallHeight
        }),
        rightWall: Piece.side({
          width: inputs.dimensions.bayLength,
          height: inputs.dimensions.leftWallHeight
        }),
        floor: Piece.side({
          width: inputs.dimensions.bayLength,
          height: dimensions.internal.width
        })
      }
    }
  }
  const pieces = _pieces()

  const toSVG = () => pieces.fins[0].map(SVG.drawSVG).join("\n")

  const _outputs = () => {
    const r = _roof()
    return {
      pieces,
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
    points,
    toSVG
  }
}

module.exports = Wren
