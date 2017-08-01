const dimensions = {
  width: 3900,
  length: 10800,
  bayLength: 1200,
  leftWallHeight: 2400,
  rightWallHeight: 2400,
  roofApexHeight: 3900,
  roofApexOffset: 0,
  bays: 9,
  finDepth: 250,
  battenHeight: 21,
  beamWidth: 150,

  pointDistance: 150,
  minPointsInReinforcer: 5,

  frame: {
    width: 286,
  }
}

const materials = {
  plywood: {
    depth: 18,
    density: 510
  },
  plasterboard: {
    thickness: 9.5,
    depth: 18,
    density: 510
  },
  undersidePanels: {
    depth: 6,
    density: 510
  },
  insulation: {
    depth: 250,
    density: 30
  },
  cladding: {
    thickness: 43,
    horizontalBattenWidth: 32,
    verticalBattenWidth: 75
  }
}

module.exports = {
  dimensions,
  materials
}
