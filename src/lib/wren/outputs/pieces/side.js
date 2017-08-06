/**
 * Returns a side shape (wall, floor or roof), using top left as 0,0
 * @param {Number} height
 * @param {Number} width
 * @return {Array} side
 */

const Point = require('../../utils/point')
const WrenHelpers = require('../../utils/wrenhelpers')
const { merge } = require('lodash')
const THREE = require('three')
const { unit } = require('mathjs')

const side = (params, _unit='mm') => ([start, end], pos={ x: 0, y: 0, z: 0 }, rotationOverrides={}) => {

  const length = Point.distance(start, end)
  const angle = Point.angle(start, end)

  const rot = { x: 0, y: 0, z: Math.PI/2 - angle, order: 'ZYX' }
  let newRot = {
    x: rotationOverrides.x || rot.x,
    y: rotationOverrides.y || rot.y,
    z: rotationOverrides.z ? rot.z + rotationOverrides.z : rot.z,
    order: rot.order
  }

  const startPosition = new THREE.Vector3(pos.x,pos.y,pos.z)

  const euler = new THREE.Euler(newRot.x, newRot.y, newRot.z, newRot.order)
  const direction = startPosition.clone().applyEuler(euler).normalize()

  const pieceLengths = WrenHelpers.pieces(length, params.materials.plywood.maxHeight)

  let allPieces = []
  for (let i = 0; i < pieceLengths.length; i++) {
    const pieceLength = pieceLengths[i]
    const pts = [
      [0, pieceLength],
      [params.dimensions.bayLength, pieceLength],
      [params.dimensions.bayLength, 0],
      [0, 0]
    ].map(pts => pts.map(pt => unit(pt, 'mm').toNumber(_unit) ))

    let newPos = startPosition.clone().add(
      new THREE.Vector3(
        0,
        unit(params.materials.plywood.maxHeight*i, 'mm').toNumber(_unit),
        0
      ).applyEuler(euler)
    )
    allPieces.push({ pts, pos: newPos, rot: newRot })
  }
  return allPieces
}

module.exports = side


