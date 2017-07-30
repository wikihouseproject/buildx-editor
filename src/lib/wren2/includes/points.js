const Clipper = require('../patterns/clipper')

const points = ({ finDepth, width, leftWallHeight, rightWallHeight, roofApexHeight, roofApexOffset }) => {

  const _center = [
    [0,0],
    [width,0],
    [width,rightWallHeight],
    [width/2+roofApexOffset,roofApexHeight],
    [0,leftWallHeight]
  ]
  // order all of the points consistently
  // output is ordered counterclockwise, starting from top-right
  const center = Clipper.offset(_center, {DELTA: 0})
  const inner = Clipper.offset(center, {DELTA: -finDepth/2})
  const outer = Clipper.offset(center, {DELTA: finDepth/2})

  const TR = 0, T = 1, TL = 2, BL = 3, BR = 4

  const mapping = {
    rightRoof: [T,TR],
    leftRoof: [TL,T],
    leftWall: [BL,TL],
    floor: [BL,BR],
    rightWall: [BR,TR]
  }

  return {
    center,
    inner,
    outer,
    mapping
  }
}

module.exports = points
