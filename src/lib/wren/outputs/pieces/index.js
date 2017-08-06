const side = require('./side')
const fin = require('./fin')

const pieces = (points, inputs) => {
  const s = side(inputs)

  return {
    fins: [
      fin(points)
    ],
    sides: {
      leftWall: s([points.outer.TL,points.outer.BL]),
      rightWall: s([points.outer.TR,points.outer.BR]),
      floor: s([points.outer.BL,points.outer.BR])
      // floor: side(points, [])
    }
  }
}

module.exports = pieces
