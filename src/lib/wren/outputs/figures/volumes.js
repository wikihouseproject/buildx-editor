const O = require('../../utils/object')

const volumes = (inputs, dimensions, points, areas) => {

  const inputDimensions = inputs.dimensions
  const m = inputs.materials

  const iEndWallVolume = inputDimensions.finDepth * areas.internal.endWall; // endwall sits inside frame
  const eEndWallVolume = inputDimensions.finDepth * areas.external.endWall; // endwall sits inside frame
  const frameVolume = eEndWallVolume - iEndWallVolume

  const _volumes = {
    internal: {
      total: dimensions.internal.length * areas.internal.endWall,
      endWall: iEndWallVolume,
      insulation: frameVolume + (iEndWallVolume * 2), // rough est for insulation needed

      // frame: 1,
      // connectors: 1
    },
    external: {
      total: dimensions.external.length * areas.external.endWall,
      endWall: eEndWallVolume
    },
    materials: {
      singleSheet: (m.plywood.width*m.plywood.height)*m.plywood.depth
    }
  }

  return _volumes
}

module.exports = volumes
