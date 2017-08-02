const side = require('./side')
const fin = require('./fin')

// const r = _roof(points)

const pieces = (points, dimensions) => {
  return {
    fins: [
      fin(points)
    ],
    sides: {
      leftWall: side({
        width: dimensions.bayLength,
        height: dimensions.leftWallHeight
      }),
      rightWall: side({
        width: dimensions.bayLength,
        height: dimensions.leftWallHeight
      }),
      floor: side({
        width: dimensions.bayLength,
        height: dimensions.internal.width
      })
    }
  }
}

module.exports = pieces
