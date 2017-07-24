/*

  Now we have the fin, we can proceed to generate the geometry of the entire
  structure.

*/

const { bayComponent, floorComponent, roofComponent } = require('../parts/components')
const { finShape, splitFinPieces } = require('./2_fin')
const Utils = require('../utils')

// Main entrypoint, generates all geometry of the chassis
function chassis(params) {

  const s = finShape(params)

  const makeFrame = () => splitFinPieces(s, params)

  const bay = () => ({
    leftOuterWall: bayComponent(s, params, s.outer, s.sides.leftWall, {x: (params.width + params.frameWidth)/2 }, { y: Math.PI/2 }),
    leftInnerWall: bayComponent(s, params, s.inner, s.sides.leftWall, {x: (params.width - params.frameWidth)/2 - params.materialThickness, y: params.frameWidth }, { y: Math.PI/2 }),
    rightOuterWall: bayComponent(s, params, s.outer, s.sides.rightWall, {x: -(params.width + params.frameWidth)/2 - params.materialThickness }, { y: Math.PI/2 }),
    rightInnerWall: bayComponent(s, params, s.inner, s.sides.rightWall, {x: -(params.width- params.frameWidth)/2, y: params.frameWidth }, { y: Math.PI/2 }),
    // rightOuterRoof: roofComponent(s, params, s.sides.rightRoof),
    floor: floorComponent(s, params, s.inner, s.sides.underside, {y: params.frameWidth + params.materialThickness, z: -params.bayLength, x: params.width/2 - params.frameWidth/2 }, {x: Math.PI/2, z: Math.PI/2}),
    roofConnector: bayComponent(s, params, s.outer, s.sides.leftWall, {x: (params.width + params.frameWidth)/2 }, { y: Math.PI/2 }),
    // rightInnerRoof: bayComponent(s, params, s.sides.rightRoof),
    leftOuterRoof: roofComponent(s, params, s.outer, s.sides.leftRoof, {y: params.height - s.outer[0][1]/100 + params.frameWidth/2 }),
    leftInnerRoof: roofComponent(s, params, s.inner, s.sides.leftRoof, {y: params.height - s.inner[0][1]/100 + params.frameWidth/2 }),

    rightOuterRoof: roofComponent(s, params, s.outer, s.sides.rightRoof, {y: params.height - s.outer[0][1]/100 + params.frameWidth/2 }),
    rightInnerRoof: roofComponent(s, params, s.inner, s.sides.rightRoof, {y: params.height - s.inner[0][1]/100 + params.frameWidth/2 }),

    // rightOuterRoof: roofComponent(s, params, s.outer, s.sides.rightRoof, {y: params.height - s.outer[0][1]/100 + params.frameWidth/2 }),
    // leftInnerRoof: bayComponent(s, params, s.sides.leftRoof),
  })

  return {
    frames: Utils.times(params.totalBays, makeFrame),
    bays: Utils.times(params.totalBays, bay),
    parameters: params
  }
}

module.exports = { chassis }
