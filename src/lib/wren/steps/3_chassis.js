/*

  Now we have the fin, we can proceed to generate the geometry of the entire
  structure.

*/

const { bayComponent, floorComponent, roofComponent } = require('../parts/components')
const { finShape, splitFinPieces } = require('./2_fin')
const { times } = require('../../utils')

// Main entrypoint, generates all geometry of the chassis
function chassis(params) {

  const s = finShape(params)

  const makeFrame = () => splitFinPieces(s, params)


  const bay = () => ({
    leftOuterWall: bayComponent(s, params, s.outer, s.sides.leftWall, {x: (params.width + params.frameWidth)/2 }, { y: Math.PI/2 }),
    leftInnerWall: bayComponent(s, params, s.inner, s.sides.leftWall, {x: (params.width - params.frameWidth)/2 - params.materialThickness, y: params.frameWidth }, { y: Math.PI/2 }),
    // // rightOuterWall: bayComponent(s, params, s.outer, s.sides.rightWall, {x: -(params.width + params.frameWidth)/2 - params.materialThickness }, { y: -Math.PI/2 }),
    rightOuterWall: bayComponent(s, params, s.outer, s.sides.leftWall, {x: -(params.width + params.frameWidth)/2, z: -params.bayLength }, { y: -Math.PI/2 }),
    rightInnerWall: bayComponent(s, params, s.inner, s.sides.rightWall, {x: -(params.width - params.frameWidth)/2, y: params.frameWidth, z: -params.bayLength }, { y: -Math.PI/2 }),
    // // rightOuterRoof: roofComponent(s, params, s.sides.rightRoof),
    floor: floorComponent(s, params, s.inner, s.sides.underside, {y: params.frameWidth + params.materialThickness, z: -params.bayLength, x: params.width/2 - params.frameWidth/2 }, {x: Math.PI/2, z: Math.PI/2}),
    // underboard: floorComponent(s, params, s.outer, s.sides.underside, {y: 0, z: -params.bayLength, x: s.outer[2][0]-params.width/2 }, {x: Math.PI/2, z: Math.PI/2}),
    // roofConnector: bayComponent(s, params, s.outer, s.sides.leftWall, {x: (params.width + params.frameWidth)/2 }, { y: Math.PI/2 }),

    leftOuterRoof: roofComponent(s, params, s.outer, s.sides.leftRoof, {
        x: -params.width/2+s.outer[4][0],
        y: params.height-s.outer[4][1] + params.frameWidth/2,
        z: -params.bayLength
      }, {y: -Math.PI/2 }),

    leftInnerRoof: roofComponent(s, params, s.inner, s.sides.leftRoof, {
        x: -params.width/2+s.inner[4][0],
        y: params.height-s.inner[4][1]+ params.frameWidth/2,
        z: -params.bayLength
      }, {y: -Math.PI/2 }),

    rightOuterRoof: roofComponent(s, params, s.outer, s.sides.rightRoof, {
        x: s.outer[1][0] - params.width/2,
        y: params.height - s.outer[1][1] + params.frameWidth/2
      }, {y: Math.PI/2 }),

    rightInnerRoof: roofComponent(s, params, s.inner, s.sides.rightRoof, {
        x: s.inner[1][0] - params.width/2,
        y: params.height - s.inner[1][1] + params.frameWidth/2
      }, {y: Math.PI/2 })
  })

  return {
    frames: times(params.totalBays, makeFrame),
    bays: times(params.totalBays, bay),
    parameters: params
  }
}

module.exports = { chassis }
