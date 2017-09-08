import { makePiece, ball, clone } from "./index"
import { removeDescendants, scale } from "../utils"
require('../utils/QuickHull')
require('../utils/ConvexGeometry')

const _add = (allVertices, parent, thicknessMM, color) => side => {
  const scaledPoints = side.pts.map(
    ([x,y]) => ([x/1000.0*scale, y/1000.0*scale])
  )
  const scaledPos = {
    x: side.pos.x/1000.0*scale,
    y: side.pos.y/1000.0*scale,
    z: side.pos.z/1000.0*scale
  }
  const piece = makePiece(scaledPoints, thicknessMM/1000.0*scale)

  piece.position.copy(scaledPos)
  piece.rotation.x = side.rot.x
  piece.rotation.y = side.rot.y
  piece.rotation.z = side.rot.z
  piece.rotation.order = side.rot.order

  allVertices.push(...piece.geometry.vertices)

  const geom = new THREE.EdgesGeometry(piece.geometry)
  const lines = new THREE.LineSegments(geom, new THREE.LineBasicMaterial( { color: '#ad9f83', overdraw: 0.5 }))

  piece.add(lines)
  parent.add(piece)
}

const House = ({pieces, figures}) => {

  const house = new THREE.Object3D()
  let allVertices = []
  const addBayPiece = _add(allVertices, house, 18, 0x00FF00)
  const addFramePiece = _add(allVertices, house, 250, 0x00CC00)

  const sourceBall = ball()
  let balls = [
    clone(sourceBall, {}, {}, {boundVariable: ['roofApexHeight'], bindFn: (x => ([x])), dragAxis: 'y'}),
    clone(sourceBall, {y: 1}, {}, {boundVariable: ['width'], bindFn: (x => ([x*2])), dragAxis: 'x'}),
    clone(sourceBall, {y: 1}, {}, {boundVariable: ['width'], bindFn: (x => ([-x*2])), dragAxis: 'x'}),
    clone(sourceBall, {y: 1}, {}, {boundVariable: ['length', 'bays'], bindFn: ((x, {bayLength}) => {
      return [-x, -Math.floor((x)%bayLength)]
    }), dragAxis: 'z'})
  ]

  let outlineMesh = undefined
  const addOutlineMesh = () => {
    const geometry = new THREE.BoxGeometry(2*scale,4*scale,11*scale)
    const material = new THREE.MeshBasicMaterial({color: 0x000000})
    outlineMesh = new THREE.Mesh(geometry, material)
    outlineMesh.position.y = 2*scale
  }

  const draw = pieces => {
    const positions = ['inner', 'outer']
    for (const bay of pieces.bays) {
      for (const position of positions) {
        bay.sides[position].leftWall.map( addBayPiece )
        bay.sides[position].rightWall.map( addBayPiece )
        bay.sides[position].floor.map( addBayPiece )
        bay.sides[position].leftRoof.map( addBayPiece )
        bay.sides[position].rightRoof.map( addBayPiece )
      }
    }
    for (const frame of pieces.frames) {
      frame.fins[0].map( addFramePiece )
    }
  }

  const updateBalls = (dimensions) => {
    console.log(dimensions.external.length)
    balls[0].position.y = dimensions.external.height/1000
    balls[1].position.x = dimensions.external.width/2000
    balls[2].position.x = -dimensions.external.width/2000
    balls[3].position.z = -dimensions.external.length/2000
  }

  const update = ({pieces, figures}) => {
    removeDescendants(house)
    draw(pieces)
    addOutlineMesh()
    house.add(...balls)
    updateBalls(figures.dimensions)
    // const yArrow = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 10, 'green')
    // house.add(yArrow)
  }
  update({pieces, figures})

  return {
    output: house,
    update,
    outlineMesh,
    balls
  }
}

module.exports = House
