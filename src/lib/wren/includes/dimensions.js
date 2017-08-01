const dimensions = inputs => {
  const d = inputs.dimensions
  const m = inputs.materials
  return {
    internal: {
      width: d.width - d.finDepth - (m.plywood.depth + d.battenHeight + m.plasterboard.thickness)*2,
      length: d.length + d.beamWidth - (d.finDepth + (m.plywood.depth + m.plasterboard.depth/2 + d.battenHeight)*2)
    },
    external: {
      width: d.width + d.finDepth + (m.plywood.depth + m.cladding.thickness + m.cladding.horizontalBattenWidth + m.cladding.verticalBattenWidth)*2,
      length: d.length + d.beamWidth + (m.cladding.thickness + m.cladding.horizontalBattenWidth + m.cladding.verticalBattenWidth)*2
    }
  }
}

module.exports = dimensions
