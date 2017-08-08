// all units in mm unless otherwise specified
const dimensions = {
  width: 3900,
  length: 10800,
  roofApexHeight: 3900, // Height to top of chassis

  roofApexOffset: 0, // Offset to left or right, negative value to move left, positive right
  leftWallHeight: 2400, // Height of wall, where the roof starts
  rightWallHeight: 2400, // "" ""

  bays: 9, // Number of bays (blocks inbetween frames)
  bayLength: 1200, // Distance between each of the frames

  finDepth: 250,
  battenHeight: 21,
  beamWidth: 150,

  pointDistance: 150,
  minPointsInReinforcer: 5,

  cncWasteFactor: 0.30,

  // if this is greater than zero then a filter will be added to the shapes to make them
  // more complex. The complex shape will be smaller than the simple shape, but the main convex
  // vertices should generally be the same for both shapes.
  complex: 0,

  frame: {
    width: 286,
  }
}

const materials = {
  plywood: {
    depth: 18,
    density: 510,
    width: 1220,
    height: 2440,
    maxWidth: 1200,
    maxHeight: 2400
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
