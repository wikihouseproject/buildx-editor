const side = require('./side')

const Bay = (points, inputs, index=0) => {

  const halfWidth = (points.outer.BR[0] - points.outer.BL[0])/2
  const bayLength = inputs.dimensions.bayLength
  const plyThickness = inputs.materials.plywood.depth
  const bayZ = (bayLength * index) - (bayLength * inputs.dimensions.bays)/2

  return {
    skis: [],
    connectors: [],
    underboards: [],
    sides: {
      inner: {
        leftWall: side(inputs,
          [points.inner.TL, points.inner.BL],
          { x: points.inner.BL[0] - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1]), z: bayZ },
          { y: Math.PI/2 }
        ),
        rightWall: side(inputs,
          [points.inner.TR, points.inner.BR],
          { x: points.inner.BR[0] - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1]), z: bayZ },
          { y: Math.PI/2 }
        ),
        leftRoof: side(inputs,
          [points.inner.TL, points.inner.T],
          { x: points.inner.TL[0] - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1]) + (points.inner.BL[1]-points.inner.TL[1]), z: bayZ },
          { y: Math.PI/2, z: Math.PI }
        ),
        rightRoof: side(inputs,
          [points.inner.TR, points.inner.T],
          { x: points.inner.TR[0] - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1]) + (points.inner.BR[1]-points.inner.TR[1]), z: bayZ-bayLength },
          { y: -Math.PI/2, z: Math.PI }
        ),
        floor: side(inputs,
          [points.inner.BL,points.inner.BR],
          { x: points.inner.BR[0] - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1]), z: bayZ },
          { y: Math.PI/2 }
        )
      },
      outer: {
        floor: [/* NOT YET IMPLEMENTED */],
        leftWall: side(inputs,
          [points.outer.TL, points.outer.BL],
          { x: points.outer.BL[0] - halfWidth, y: plyThickness, z: bayZ },
          { y: Math.PI/2 }
        ),
        rightWall: side(inputs,
          [points.outer.TR, points.outer.BR],
          { x: points.outer.BR[0] - halfWidth, y: plyThickness, z: bayZ },
          { y: Math.PI/2 }
        ),
        leftRoof: side(inputs,
          [points.outer.TL, points.outer.T],
          { x: points.outer.TL[0] - halfWidth, y: (points.outer.BL[1]-points.outer.TL[1]) + plyThickness*2, z: bayZ },
          { y: Math.PI/2, z: Math.PI }
        ),
        rightRoof: side(inputs,
          [points.outer.TR, points.outer.T],
          { x: points.outer.TR[0] - halfWidth, y: (points.outer.BR[1]-points.outer.TR[1]) + plyThickness*2, z: bayZ-bayLength },
          { y: -Math.PI/2, z: Math.PI }
        )
      }
    }
  }
}

module.exports = Bay
