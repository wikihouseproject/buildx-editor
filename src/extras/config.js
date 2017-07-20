// all units in metres unless otherwise specified

const config = {
  width: 5,
  height: 3,
  wallHeight: 2,
  totalBays: 10,
  bayLength: 1.2,

  // only used in /src/lib/wren so far
    initialCameraPosition: { x: 0, y: 8, z: 8 },
    colours: [ 'yellow', 'green', 'pink', 'blue', 'orange'],
    extrusion: 0.25,
    spacing: 1,

  // only used in /vanilla so far
    connectorWidth: 1.2,
    connectorHeight: 0.25,
    plyThickness: 0.018,
    frameDepth: 0.15,
    frameWidth: 0.264
}

module.exports = config
