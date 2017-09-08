const dimensions = (inputs, points) => {
  const d = inputs.dimensions;
  const m = inputs.materials;

  const iWidth =
    d.width -
    d.finDepth -
    (m.plywood.depth + d.battenHeight + m.plasterboard.thickness) * 2;
  const iLength =
    d.length +
    d.beamWidth -
    (d.finDepth +
      (m.plywood.depth + m.plasterboard.depth / 2 + d.battenHeight) * 2);
  // (d.bays * d.bayLength)

  const eWidth =
    d.width +
    d.finDepth +
    (m.plywood.depth +
      m.cladding.thickness +
      m.cladding.horizontalBattenWidth +
      m.cladding.verticalBattenWidth) *
      2;
  const eLength =
    d.length +
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
      length: iLength
      // height: 10,
      // leftRoofLength: 1,
      // rightRoofLength: 1,
    },
    external: {
      width: eWidth,
      length: eLength,
      height: eHeight //points.outer.BR[1],
      // leftRoofLength: 1,
      // rightRoofLength: 1,
    }
  };
};

module.exports = dimensions;
