const side = require('./side')

const Bay = (points, inputs, index=0) => {

  const s = side(inputs, 'm')
  const halfWidth = ((points.outer.BR[0] - points.outer.BL[0])/2)/1000
  const bayLength = inputs.dimensions.bayLength/1000
  const plyThickness = inputs.materials.plywood.depth/1000
  const bayZ = (bayLength * index) - (bayLength * inputs.dimensions.bays)/2

  return {
    skis: [],
    connectors: [],
    underboards: [],
    sides: {
      inner: {
        leftWall: s(
          [points.inner.TL, points.inner.BL],
          { x: points.inner.BL[0]/1000 - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1])/1000, z: bayZ },
          { y: Math.PI/2 }
        ),
        rightWall: s(
          [points.inner.TR, points.inner.BR],
          { x: points.inner.BR[0]/1000 - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1])/1000, z: bayZ },
          { y: Math.PI/2 }
        ),
        leftRoof: s(
          [points.inner.TL, points.inner.T],
          { x: points.inner.TL[0]/1000 - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1])/1000 + (points.inner.BL[1]-points.inner.TL[1])/1000, z: bayZ },
          { y: Math.PI/2, z: Math.PI }
        ),
        rightRoof: s(
          [points.inner.TR, points.inner.T],
          { x: points.inner.TR[0]/1000 - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1])/1000 + (points.inner.BR[1]-points.inner.TR[1])/1000, z: bayZ-bayLength },
          { y: -Math.PI/2, z: Math.PI }
        ),
        floor: s(
          [points.inner.BL,points.inner.BR],
          { x: points.inner.BR[0]/1000 - halfWidth, y: (points.outer.BR[1] - points.inner.BR[1])/1000, z: bayZ },
          { y: Math.PI/2 }
        )
      },
      outer: {
        floor: [/* NOT YET IMPLEMENTED */],
        leftWall: s(
          [points.outer.TL, points.outer.BL],
          { x: points.outer.BL[0]/1000 - halfWidth, y: plyThickness, z: bayZ },
          { y: Math.PI/2 }
        ),
        rightWall: s(
          [points.outer.TR, points.outer.BR],
          { x: points.outer.BR[0]/1000 - halfWidth, y: plyThickness, z: bayZ },
          { y: Math.PI/2 }
        ),
        leftRoof: s(
          [points.outer.TL, points.outer.T],
          { x: points.outer.TL[0]/1000 - halfWidth, y: (points.outer.BL[1]-points.outer.TL[1])/1000 + plyThickness*2, z: bayZ },
          { y: Math.PI/2, z: Math.PI }
        ),
        rightRoof: s(
          [points.outer.TR, points.outer.T],
          { x: points.outer.TR[0]/1000 - halfWidth, y: (points.outer.BR[1]-points.outer.TR[1])/1000 + plyThickness*2, z: bayZ-bayLength },
          { y: -Math.PI/2, z: Math.PI }
        )
      }
    }
  }
}

module.exports = Bay
