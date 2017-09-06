import { makePiece, ball, clone } from "./index"
import { removeDescendants, scale } from "../utils"
require('../utils/QuickHull')
require('../utils/ConvexGeometry')

// temporarily hardcoded
const wren = {
  config: {
    height: 4,
    wallHeight: 2,
    width: 3,
    frameDepth: 0
  }
}

const _add = (allVertices, parent, thicknessMM, color) => side => {

  const scaledPoints = side.pts.map(([x,y]) => ([x/1000.0*scale, y/1000.0*scale]))
  const scaledPos = {
    x: side.pos.x/1000.0*scale,
    y: side.pos.y/1000.0*scale,
    // z: side.pos.z/1000.0*scale
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

  // const xArrow = new THREE.ArrowHelper( new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 3, 'red')
  // piece.add(xArrow)
  // const yArrow = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 3, 'green')
  // piece.add(yArrow)
  // const zArrow = new THREE.ArrowHelper( new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 3, 'blue')
  // piece.add(zArrow)

  piece.add(lines)
  parent.add(piece)
}

const sourceBall = ball()
let balls = [
  clone(sourceBall, {y: wren.config.height, z: wren.config.frameDepth/2}, {}, {boundVariable: 'height', bindFn: (x => x), dragAxis: 'y'}),
  clone(sourceBall, {y: wren.config.wallHeight/2, x: wren.config.width/2}, {}, {boundVariable: 'width', bindFn: (x => x*2), dragAxis: 'x'}),
  clone(sourceBall, {y: wren.config.wallHeight/2, x: -wren.config.width/2}, {}, {boundVariable: 'width', bindFn: (x => -x*2), dragAxis: 'x'})
]

const House = pieces => {
  const house = new THREE.Object3D()
  let allVertices = []
  const addBayPiece = _add(allVertices, house, 18, 0x00FF00)
  const addFramePiece = _add(allVertices, house, 250, 0x00CC00)

  let outlineMesh = undefined
  const addOutlineMesh = () => {

    // const geometry = new THREE.Geometry()
    // geometry.vertices.push(hull.vertices)
    // geometry.faces.push(hull.faces)

    // const hull = new THREE.QuickHull()
    // hull.setFromObject(house)
    // const outlineGeometry = new THREE.ConvexBufferGeometry(allVertices)

    const geometry = new THREE.BoxGeometry(2*scale,4*scale,11*scale)

    const material = new THREE.MeshBasicMaterial({color: 0x000000})
    outlineMesh = new THREE.Mesh(geometry, material)
    outlineMesh.position.y = 2*scale
    // house.add(outlineMesh)
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

  const updateBalls = () => {
    const bbox = new THREE.Box3().setFromObject(house)

    balls[0].position.y = bbox.max.y - 0.4
    // balls[0].position.z = wren.config.frameDepth/2

    // balls[1].position.y = wren.config.wallHeight/2
    balls[1].position.x = bbox.max.x

    // balls[2].position.y = wren.config.wallHeight/2
    balls[2].position.x = bbox.min.x
  }

  const update = pieces => {
    removeDescendants(house)
    draw(pieces)
    addOutlineMesh()
    house.add(...balls)
    updateBalls()
    // const yArrow = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 10, 'green')
    // house.add(yArrow)
  }

  update(pieces)

  return {
    output: house,
    update,
    outlineMesh,
    balls
  }
}

module.exports = House
