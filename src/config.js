// NOTE: to be reconciled with the paramters in wren/index.js and then removed

// all units in metres unless otherwise specified

const config = {
  width: 5,
  height: 3,
  wallHeight: 2,
  totalBays: 10,
  bayLength: 1.2,
  colors: [ 'yellow', 'green', 'pink', 'blue', 'orange'],
  plyThickness: 0.018,
  frameDepth: 0.15,
  frameWidth: 0.264,

  sheetWidth: 1.2,
  sheetHeight: 2.4,

  // only used in /src/lib/wren so far
    pointDistanceCM: 15, // distance to propagate points by when dedicing grip positions. Half of grip+nongrip (300mm)
    initialCameraPosition: { x: 0, y: 8, z: 8 },
    extrusion: 0.25,
    spacing: 1,

  // only used in /vanilla so far
    connectorWidth: 1.2,
    connectorHeight: 0.25
}

module.exports = config
