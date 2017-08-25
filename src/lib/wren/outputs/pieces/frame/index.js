const fin = require('./fin')

const Frame = (points, inputs, index=0) => {

  const bayLength = inputs.dimensions.bayLength
  const frameZ = (bayLength * (index-1)) - (bayLength * inputs.dimensions.bays)/2
  const frameX = -(inputs.dimensions.width + inputs.dimensions.finDepth)/2
  const frameY = (inputs.dimensions.roofApexHeight) + inputs.dimensions.beamWidth

  const finsGroup = fin(points).map(piece => ({
    pts: piece,
    pos: { x: frameX, y: frameY, z: frameZ },
    rot: { x: Math.PI, y: 0, z: 0, order: 'XYZ' }
  }))

  return {
    fins: [
      finsGroup,
      finsGroup
    ],
    spacers: [

    ],
    skis: [

    ],
    reinforcers: [
      finsGroup,
      finsGroup
    ]
  }
}

module.exports = Frame
