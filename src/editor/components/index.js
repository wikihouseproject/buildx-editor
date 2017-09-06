const outlinedComponent = (obj, parameters, position={}, rotation={}, color='#E9E6C5') => {
  // const x = segment(obj[0], parameters, parameters.materialThickness, color)
  const x = clone(makePiece(obj[0], parameters.materialThickness, color), position, rotation)
  const geom = new THREE.EdgesGeometry(x.geometry)
  const lines = new THREE.LineSegments(geom, new THREE.LineBasicMaterial( { color: '#ad9f83' }));
  x.add(lines)
  return x
}

const frame = (points, {frameDepth}) => makePiece(points, frameDepth)

const segment = (points, {frameDepth}, thickness, color) => {
  // const normalizedPoints = points.map( ([x,y]) => [x/100, y/100] )
  const normalizedPoints = points.map( ([x,y]) => [x, y] )
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

const createShape = _points => {
  if (!Array.isArray(_points[0][0])) _points = [_points]

  const shape = new THREE.Shape()
  for (const points of _points) {
    shape.moveTo(...points[0])
    points.slice(1).forEach( ([x,y]) => shape.lineTo(x,y))
    shape.lineTo(...points[0])
  }
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
  // console.log({position: mesh.position}, {rotation: mesh.rotation})
  mesh.userData = userData
  return mesh
}

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

const outerWall = ({bayLength, wallHeight, materialThickness}) => makePiece([
  [0,wallHeight],
  [bayLength/2,wallHeight],
  [bayLength/2,0],
  [-bayLength/2,0],
  [-bayLength/2,wallHeight]
], materialThickness, 0x5A717E)

const connector = ({connectorWidth, connectorHeight, materialThickness}) => makePiece([
  [0,connectorHeight],
  [connectorWidth,connectorHeight],
  [connectorWidth,0],
  [0,0]
], materialThickness, '#777')

const roof = ({width, height, wallHeight, bayLength, materialThickness}) => {
  const roofLength = Math.hypot((width/2), (height-wallHeight))
  return makePiece([
    [0,roofLength],
    [bayLength,roofLength],
    [bayLength,0],
    [0,0]
  ], materialThickness, '#777')
}

const floor = ({width, bayLength, materialThickness}) => makePiece([
  [0,width],
  [bayLength,width],
  [bayLength,0],
  [0,0]
], materialThickness, '#777')

const extrudeShape = (shape, extrudeSettings, color=null) => {
  // const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = color ? new THREE.MeshBasicMaterial({ color, opacity: 0.3, transparent: true }) : window.plyMaterial
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

module.exports = {
  ground,
  makePiece,
  clone,
  frame,
  connector,
  outerWall,
  roof,
  ball,
  floor,
  outline,
  segment,
  outlinedComponent
}
