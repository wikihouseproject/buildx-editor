const getXY = (startX,startY,endX,endY) => [endX - startX, endY - startY]

const split = (amount=1) => ([startX, startY], [endX, endY]) => {
  const [x,y] = getXY(startX,startY,endX,endY)
  let amounts = []
  for (var i = 1; i <= amount; i++) {
    amounts.push([startX+x/amount*i, startY+y/amount*i])
  }
  return amounts
}

const pointOnLine = (distance=1) => ([startX, startY], [endX, endY]) => {
  const [x,y] = getXY(startX,startY,endX,endY)
  const hypot = Math.hypot(x, y)
  return [x/hypot*distance,y/hypot*distance]
}

const length = ([startX, startY], [endX, endY]) => {
  const [x,y] = getXY(startX,startY,endX,endY)
  return Math.hypot(x, y)
}

const percentageOnLine = (percentage=0.5) => ([startX, startY], [endX, endY]) => {
  const [x,y] = getXY(startX,startY,endX,endY)
  const hypot = Math.hypot(x, y)
  return [startX+x*percentage,startY+y*percentage]
}

const angle = ([startX, startY], [endX, endY]) => {
  const [x,y] = getXY(startX,startY,endX,endY)
  return Math.atan2(y,x)
}

const rotateAroundPoint = ([pointX, pointY], [originX, originY], angle) => {
  // angle = angle * Math.PI / 180.0;
  return [
    Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
    Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
  ]
}

module.exports = {
  angle,
  split,
  length,
  pointOnLine,
  percentageOnLine,
  rotateAroundPoint
}
