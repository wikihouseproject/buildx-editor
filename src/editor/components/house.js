import { makePiece } from "./index"
import { removeDescendants } from "../utils"

import { getPointsPosition } from '../../lib/wren/outputs/3d'

const _add = (parent, thickness, color) => side => {
  const piece = makePiece(side.pts, thickness, color)
  piece.position.copy(side.pos)
  piece.rotation.x = side.rot.x
  piece.rotation.y = side.rot.y
  piece.rotation.z = side.rot.z
  piece.rotation.order = side.rot.order
  const geom = new THREE.EdgesGeometry(piece.geometry)
  const lines = new THREE.LineSegments(geom, new THREE.LineBasicMaterial( { color: '#ad9f83', overdraw: 0.5 }))

  // const xArrow = new THREE.ArrowHelper( new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 3, 'red')
  // piece.add(xArrow)
  // const yArrow = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 3, 'green')
  // piece.add(yArrow)
  // const zArrow = new THREE.ArrowHelper( new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 3, 'blue')
  // piece.add(zArrow)

  piece.add(lines)
  parent.add(piece)
}

function pointsPreview(part, size=0.01, color=0xFF00FF) {
  var group = new THREE.Group()

  const points = getPointsPosition(part)
  for (var i=0; i<points.length; i++) {
    const geometry = new THREE.BoxBufferGeometry( size, size, size )
    const material = new THREE.MeshBasicMaterial( {color: color} )
    const marker = new THREE.Mesh( geometry, material )
    const pt = points[i]
    marker.position.x = pt[0]
    marker.position.y = pt[1]
    marker.position.z = pt[2]
    group.add(marker)
  }
  return group
}

const House = pieces => {
  const house = new THREE.Object3D()
  const addBayPiece = _add(house, 18.0, 0x00FF00)
  const addFramePiece = _add(house, 250.0, 0x00CC00)

  const draw = pieces => {
    const positions = ['inner', 'outer']
    for (const bay of pieces.bays) {
      for (const position of positions) {
        bay.sides[position].leftWall.map( addBayPiece )
        bay.sides[position].rightWall.map( addBayPiece )
        bay.sides[position].floor.map( addBayPiece )
        bay.sides[position].leftRoof.map( addBayPiece )
        bay.sides[position].rightRoof.map( addBayPiece )

        bay.sides[position].leftWall.map( (f) => {
          house.add(pointsPreview(f, 0.1, 0xFF0000))
        })

      }
    }
    for (const frame of pieces.frames) {

      frame.fins[0].map( (f) => {
        house.add(pointsPreview(f, 0.1, 0xFF0000))
      })

      frame.fins[0].map( addFramePiece )
    }
  }

  const update = pieces => {
    removeDescendants(house)
    draw(pieces)
  }

  update(pieces)

  return {
    output: house,
    update
  }
}

module.exports = House
