// const {compose} = require('ramda')

const getXY = (startX,startY,endX,endY) => [endX - startX, endY - startY]

// const split = (amount=1) => ([startX, startY], [endX, endY]) => {
//   const [x,y] = getXY(startX,startY,endX,endY)
//   let amounts = []
//   for (var i = 1; i <= amount; i++) {
//     amounts.push([startX+x/amount*i, startY+y/amount*i])
//   }
//   return amounts
// }

const pointOnLine = distance => ([startX, startY], [endX, endY]) => {
  const [x,y] = getXY(startX,startY,endX,endY)
  const hypot = Math.hypot(x, y)
  return [x/hypot*distance, y/hypot*distance]
}

// const movePointOnAngle = ([x,y], angle, delta) => [x + (Math.sin(angle) * delta), y - (Math.cos(angle) * delta)]

const distance = ([startX, startY], [endX, endY]) => { // was length
  // or use require('mathjs').distance
  const [x,y] = getXY(startX,startY,endX,endY)
  return Math.hypot(x, y)
}

const percentageOnLine = (percentage=0.5) => ([startX, startY], [endX, endY]) => {
  const [x,y] = getXY(startX,startY,endX,endY)
  return [startX+x*percentage,startY+y*percentage]
}

const midpoint = percentageOnLine(0.5)

// const angle = ([startX, startY], [endX, endY]) => {
//   const [x,y] = getXY(startX,startY,endX,endY)
//   return Math.atan2(y,x)
// }

// const rotateAroundPoint = ([pointX, pointY], [originX, originY], angle) => {
//   // angle = angle * Math.PI / 180.0;
//   return [
//     Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
//     Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
//   ]
// }

// Return bounding rectangle for a set of 2d points
const getBounds = (coords) => {
  return coords.reduce( (bounds, coords) => {
    // const [x, y] = coords.split(",")
    const [x, y] = coords
    bounds.minX = Math.min(bounds.minX, x)
    bounds.minY = Math.min(bounds.minY, y)
    bounds.maxX = Math.max(bounds.maxX, x)
    bounds.maxY = Math.max(bounds.maxY, y)
    return bounds
  }, {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  })
}

module.exports = {
  // angle,
  // split,
  distance,
  pointOnLine,
  // movePointOnAngle,
  // percentageOnLine,
  // rotateAroundPoint,
  getBounds,
  midpoint
}
