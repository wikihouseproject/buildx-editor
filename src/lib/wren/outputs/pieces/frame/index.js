const fin = require('./fin')

const Frame = (points, inputs, index=0) => {

  const bayLength = inputs.dimensions.bayLength/1000
  const frameZ = (bayLength * (index-1)) - (bayLength * inputs.dimensions.bays)/2 - (inputs.dimensions.finDepth/1000)/2
  const frameX = inputs.dimensions.width/1000

  const finsGroup = fin(points, inputs.dimensions.complex).map(piece => ({
    pts: piece.map( ([x,y]) => ([x/1000,y/1000]) ),
    pos: { x: frameX, y: 0, z: frameZ },
    rot: { x: 0, y: 0, z: 0, order: 'XYZ' }
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
