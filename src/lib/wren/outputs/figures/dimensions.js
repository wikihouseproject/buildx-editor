const { distance } = require("../../utils/point");

const dimensions = (inputs, points) => {
  const d = inputs.dimensions;
  const m = inputs.materials;

  const length = d.bays * d.bayLength;

  const iWidth =
    d.width -
    d.finDepth -
    (m.plywood.depth + d.battenHeight + m.plasterboard.thickness) * 2;

  const iLength =
    length +
    d.beamWidth -
    (d.finDepth +
      (m.plywood.depth + m.plasterboard.depth / 2 + d.battenHeight) * 2);

  const eWidth =
    d.width +
    d.finDepth +
    (m.plywood.depth +
      m.cladding.thickness +
      m.cladding.horizontalBattenWidth +
      m.cladding.verticalBattenWidth) *
      2;

  const eLength =
    length +
    d.beamWidth +
    (m.cladding.thickness +
      m.cladding.horizontalBattenWidth +
      m.cladding.verticalBattenWidth) *
      2;

  const eHeight =
    d.roofApexHeight +
    d.finDepth +
    (m.plywood.depth +
      m.cladding.thickness +
      m.cladding.horizontalBattenWidth +
      m.cladding.verticalBattenWidth) *
      2;

  return {
    internal: {
      width: iWidth,
      length: iLength,
      leftRoof: distance(points.inner.TL, points.inner.T),
      rightRoof: distance(points.inner.TR, points.inner.T)
      // height: 10,
    },
    external: {
      width: eWidth,
      length: eLength,
      height: eHeight,
      leftWall: distance(points.outer.BL, points.outer.TL),
      rightWall: distance(points.outer.BR, points.outer.TR),
      leftRoof: distance(points.outer.TL, points.outer.T),
      rightRoof: distance(points.outer.TR, points.outer.T)
    }
  };
};

module.exports = dimensions;
