const segment = (points, {frameDepth}, thickness, color) => {
  const normalizedPoints = points.map( ([x,y]) => [x/100, y/100] )
  return makePiece(normalizedPoints, thickness, color)
}

const ground = (width, height) => {
  const geometry = new THREE.PlaneGeometry(width, height, 32)
  const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide})
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = Math.PI/2
  mesh.position.y = 0
  return mesh
}

const createShape = points => {
  let shape = new THREE.Shape()
  shape.moveTo(...points[0])
  points.slice(1).forEach( ([x,y]) => shape.lineTo(x,y))
  shape.lineTo(...points[0])
  return shape
}

const clone = (sourceMesh, position={}, rotation={}, userData={}) => {
  const geometry = sourceMesh.geometry;
  const material = sourceMesh.material;
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = (position.x || sourceMesh.position.x)
  mesh.position.y = (position.y || sourceMesh.position.y)
  mesh.position.z = (position.z || sourceMesh.position.z)
  mesh.rotation.order = (rotation.order || sourceMesh.rotation.order)
  mesh.rotation.x = (rotation.x || sourceMesh.rotation.x)
  mesh.rotation.y = (rotation.y || sourceMesh.rotation.y)
  mesh.rotation.z = (rotation.z || sourceMesh.rotation.z)
  mesh.userData = userData
  return mesh
}

const frame = (points, {frameDepth}) => makePiece(points, frameDepth)
// const outlineMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide})
const outline = (outerFramePoints, totalLength) => {
  const extrudeSettings = {
    steps: 1,
    amount: totalLength,
    bevelEnabled: false
  }
  const shape = createShape(outerFramePoints)
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
  return new THREE.Mesh(geometry, material)
}

const outerWall = ({bayLength, wallHeight, plyThickness}) => makePiece([
  [0,wallHeight],
  [bayLength/2,wallHeight],
  [bayLength/2,0],
  [-bayLength/2,0],
  [-bayLength/2,wallHeight]
], plyThickness, 0x5A717E)

const connector = ({connectorWidth, connectorHeight, plyThickness}) => makePiece([
  [0,connectorHeight],
  [connectorWidth,connectorHeight],
  [connectorWidth,0],
  [0,0]
], plyThickness, '#777')

const roof = ({width, height, wallHeight, bayLength, plyThickness}) => {
  const roofLength = Math.hypot((width/2), (height-wallHeight))
  return makePiece([
    [0,roofLength],
    [bayLength,roofLength],
    [bayLength,0],
    [0,0]
  ], plyThickness, '#777')
}

const floor = ({width, bayLength, plyThickness}) => makePiece([
  [0,width],
  [bayLength,width],
  [bayLength,0],
  [0,0]
], plyThickness, '#777')

const extrudeShape = (shape, extrudeSettings, color) => {
  // const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const material = new THREE.MeshBasicMaterial({ color });
  // const material = new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide });
  // const material = customShader;
  return new THREE.Mesh(geometry, material)
}

const makePiece = (points, amount, color=0x00ff00) => {
  const extrudeSettings = {
    steps: 1,
    amount,
    bevelEnabled: false
  }
  return extrudeShape(createShape(points), extrudeSettings, color)
}

const ball = () => {
  const geometry = new THREE.SphereGeometry(0.5, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0x00000 });
  return new THREE.Mesh(geometry, material)
}

module.exports = { ground, makePiece, clone, frame, connector, outerWall, roof, ball, floor, outline, segment }
