const Clipper = require('../patterns/clipper')

const points = ({ finDepth, width, leftWallHeight, rightWallHeight, roofApexHeight, roofApexOffset }) => {
  // TOP LEFT IS 0,0
  // const _center = [
  //   [0,roofApexOffset], // bottomLeft
  //   [width,roofApexOffset], // bottomRight
  //   [width,roofApexOffset-rightWallHeight], // topOfRightWall
  //   [width/2+roofApexOffset,0], // topOfRoof
  //   [0,roofApexOffset-leftWallHeight] // topOfLeftWall
  // ]
  const _center = [
    [0,0],
    [width,0],
    [width,rightWallHeight],
    [width/2+roofApexOffset,roofApexHeight],
    [0,leftWallHeight]
  ]
  const center = Clipper.offset(_center, {DELTA: 0})
  const inner = Clipper.offset(center, {DELTA: -finDepth/2})
  const outer = Clipper.offset(center, {DELTA: finDepth/2})
  const mapping = {
    rightRoof: [0,1],
    leftRoof: [1,2],
    leftWall: [2,3],
    floor: [3,4],
    rightWall: [0,4]
  }
  // const bottomToTopAndLeftToRightMapping = {
  //   rightRoof: [1,0],
  //   leftRoof: [2,1],
  //   leftWall: [],
  //   floor: [3,4],
  //   rightWall: [0,4]
  // }
  return {
    center,
    inner,
    outer,
    mapping
  }
}

module.exports = points
