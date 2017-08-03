const O = require('../../utils/object')
const { unit } = require('mathjs')

const volumes = (inputs, dimensions, points, areas, _unit="mm3") => {

  const inputDimensions = inputs.dimensions

  const iEndWallVolume = inputDimensions.finDepth * areas.internal.endWall; // endwall sits inside frame
  const eEndWallVolume = inputDimensions.finDepth * areas.external.endWall; // endwall sits inside frame
  const frameVolume = eEndWallVolume - iEndWallVolume

  const _volumes = {
    internal: {
      total: dimensions.internal.length * areas.internal.endWall,
      endWall: iEndWallVolume,
      insulation: frameVolume + (iEndWallVolume * 2), // rough est for insulation needed
    },
    external: {
      total: dimensions.external.length * areas.external.endWall,
      endWall: eEndWallVolume
    }
  }

  return O.mutatingMap(_volumes, v => unit(v, 'mm3').toNumber(_unit))
}

module.exports = volumes
