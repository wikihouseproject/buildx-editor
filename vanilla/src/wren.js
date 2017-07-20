import { offset } from "../../src/lib/wren/patterns/clipper"

const Wren = config => {
  const framePoints = [
    [0,config.height],
    [config.width/2,config.wallHeight],
    [config.width/2,0],
    [-config.width/2,0],
    [-config.width/2,config.wallHeight]
  ]

  const totalLength = config.bayLength * config.totalBays

  const innerFramePoints = offset(framePoints, { DELTA: config.frameWidth/2 })

  const outerFramePoints = offset(framePoints, { DELTA: -config.frameWidth/2 })

  const roofAngle = Math.atan2(config.width/2, (config.height-config.wallHeight))

  return {
    config,
    totalLength,
    framePoints,
    innerFramePoints,
    outerFramePoints,
    roofAngle,
    outerHeight
  }
}

module.exports = Wren
