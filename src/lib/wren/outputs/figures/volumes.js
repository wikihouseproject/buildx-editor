const O = require("../../utils/object");

const volumes = (inputs, dimensions, points, areas) => {
  const inputDimensions = inputs.dimensions;
  const m = inputs.materials;

  const iEndWallVolume = inputDimensions.finDepth * areas.internal.endWall; // endwall sits inside frame
  const eEndWallVolume = inputDimensions.finDepth * areas.external.endWall; // endwall sits inside frame
  const frameVolume =
    (eEndWallVolume - iEndWallVolume) * dimensions.external.length;

  const externalVolume = dimensions.external.length * areas.external.endWall;
  const internalVolume = dimensions.internal.length * areas.internal.endWall;

  const _volumes = {
    portalFrame: frameVolume,
    insulation: frameVolume,
    endWalls: iEndWallVolume * 0.2,
    internal: {
      total: internalVolume,
      endWall: iEndWallVolume,
      insulation: (externalVolume - internalVolume) * 0.7 // rough est for insulation needed
      // frame: 1,
      // connectors: 1
    },
    external: {
      total: externalVolume,
      endWall: eEndWallVolume
    },
    materials: {
      singleSheet: m.plywood.width * m.plywood.height * m.plywood.depth
    }
  };

  return _volumes;
};

module.exports = volumes;
