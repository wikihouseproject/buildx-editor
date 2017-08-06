import { makePiece } from "./index"
import { removeDescendants } from "../utils"

const _add = parent => side => {
  const piece = makePiece(side.pts, 0.018)
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

const House = pieces => {
  const house = new THREE.Object3D()
  const addPiece = _add(house)

  const draw = pieces => {
    pieces.bays.map(bay => {
      bay.sides.leftInnerWall.map( _add(house) )
      bay.sides.leftOuterWall.map( _add(house) )
      bay.sides.rightInnerWall.map( _add(house) )
      bay.sides.rightOuterWall.map( _add(house) )
      bay.sides.floor.map( _add(house) )
      bay.sides.leftInnerRoof.map( _add(house) )
      bay.sides.leftOuterRoof.map( _add(house) )
      bay.sides.rightInnerRoof.map( _add(house) )
      bay.sides.rightOuterRoof.map( _add(house) )
    })
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
