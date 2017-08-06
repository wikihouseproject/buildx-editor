const side = require('./side')
const fin = require('./fin')

const pieces = (points, inputs) => {
  const s = side(inputs, 'm')

  const plyThickness = inputs.materials.plywood.depth/1000

  console.log(points)

  return {
    fins: [
      fin(points)
    ],
    sides: {
      leftInnerWall: s(
        [points.inner.TL, points.inner.BL],
        { x: points.inner.BL[0]/1000, y: plyThickness },
        { y: Math.PI/2 }
      ),
      leftOuterWall: s(
        [points.outer.TL, points.outer.BL],
        { x: points.outer.BL[0]/1000, y: plyThickness },
        { y: Math.PI/2 }
      ),
      rightInnerWall: s(
        [points.inner.TR, points.inner.BR],
        { x: points.inner.BR[0]/1000, y: plyThickness },
        { y: Math.PI/2 }
      ),
      rightOuterWall: s(
        [points.outer.TR, points.outer.BR],
        { x: points.outer.BR[0]/1000, y: plyThickness },
        { y: Math.PI/2 }
      ),
      leftInnerRoof: s(
        [points.inner.TL, points.inner.T],
        { x: points.inner.TL[0]/1000, y: (points.inner.BL[1]-points.inner.TL[1])/1000 + plyThickness },
        { y: Math.PI/2 }
      ),
      leftOuterRoof: s(
        [points.outer.TL, points.outer.T],
        { x: points.outer.TL[0]/1000, y: (points.outer.BL[1]-points.outer.TL[1])/1000 + plyThickness },
        { y: Math.PI/2 }
      ),
      rightInnerRoof: s(
        [points.inner.TR, points.inner.T],
        { x: points.inner.TR[0]/1000, y: (points.inner.BR[1]-points.inner.TR[1])/1000 + plyThickness },
        { y: Math.PI/2 }
      ),
      rightOuterRoof: s(
        [points.outer.TR, points.outer.T],
        { x: points.outer.TR[0]/1000, y: (points.outer.BR[1]-points.outer.TR[1])/1000 + plyThickness },
        { y: Math.PI/2 }// , {  }
      ),
      floor: s(
        [points.outer.BL,points.outer.BR],
        { x: points.outer.BR[0]/1000 },
        { order: 'ZYX', y: Math.PI/2, z: Math.PI/2 }
      ),
    }
  }
}

module.exports = pieces
