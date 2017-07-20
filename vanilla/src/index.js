import { ground, frame, clone, house, connector, outerWall, roof, ball, floor, outline } from "./components"
import { renderer, container, scene, camera, orbitControls, setCursor, stats, rendererStats } from "./scene"
import { removeDescendants, rad2Deg } from "../../src/lib/utils"
import BasicWren from "../../src/lib/wren/basic_wren"
import defaults from '../../src/extras/config'
let wren = BasicWren(Object.assign({}, defaults, {totalBays: 6}))

let balls = []
let outlineMesh
const sourceBall = ball()

const clippingPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,2.4,0));
renderer.clippingPlanes = [ clippingPlane ];

scene.add(ground(20,20))

// const outlineGeometry = new THREE.Geometry()
const outlineMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide})

scene.add(house)

function redrawHouse() {
  const { config } = wren

  const sourceConnector = connector(config)
  const sourceFrame = frame(wren.framePoints, config)
  const sourceOuterWall = outerWall(config)
  const sourceRoof = roof(config)
  const sourceFloor = floor(config)

  let bays = []
  for (var i = 0; i <= config.totalBays; i++) {
    const bay = new THREE.Object3D();
    bay.position.z = i*config.bayLength - wren.totalLength/2
    const frame = clone(sourceFrame, {})
    bay.add(frame)
    scene.add(new THREE.SectionHelper(frame, 0x444444))

    // only add a frame to the first bay
    if (i > 0) {

      // roof connector
      bay.add(clone(sourceConnector, {y: config.height - config.connectorHeight}, {y: Math.PI/2}))

      // wall connectors
      bay.add(clone(sourceConnector, {y: config.wallHeight - config.connectorHeight, x: config.width/2}, {y: Math.PI/2, x: -Math.PI/2, order: 'ZYX'}))
      bay.add(clone(sourceConnector, {y: config.wallHeight - config.connectorHeight, x: -config.width/2}, {y: Math.PI/2, x: Math.PI/2, order: 'ZYX'}))

      // floor connectors
      for (let j = 0; j <= 5; j++) {
        const x = config.width/5*j - config.width/2
        const conn = clone(sourceConnector, {x}, {y: Math.PI/2})
        bay.add(conn)
      }

      // floors
      bay.add(clone(sourceFloor, {y: config.connectorHeight, x: config.width/2}, {z: Math.PI/2, x: -Math.PI/2}))

      // roof
      const leftRoof = clone(sourceRoof, {y: config.height}, {z: Math.PI/2, x: -Math.PI/2, y: wren.roofAngle-Math.PI/2})
      const rightRoof = clone(sourceRoof, {y: config.height + config.plyThickness }, {z: -Math.PI/2, x: Math.PI/2, y: wren.roofAngle-Math.PI/2})
      bay.add(leftRoof)
      bay.add(rightRoof)

      scene.add(new THREE.SectionHelper(leftRoof, 0x444444))
      scene.add(new THREE.SectionHelper(rightRoof, 0x444444))

      // ceiling
      // bay.add(clone(sourceRoof, {y: config.height-config.connectorHeight}, {z: Math.PI/2, x: -Math.PI/2}))
      // bay.add(clone(sourceRoof, {y: config.height-config.connectorHeight}, {z: -Math.PI/2, x: Math.PI/2}))

      // outer walls
      bay.add(clone(sourceOuterWall, {x: config.width/2, z: -config.bayLength/2}, {y: Math.PI/2}))
      bay.add(clone(sourceOuterWall, {x: -config.width/2 - config.plyThickness, z: -config.bayLength/2}, {y: Math.PI/2}))
    }
    bays.push(bay)
  }
  return bays
}

function redraw(newConfig) {
  const numChildren = (house.children || []).length
  // wren.config = Object.assign({}, wren.config, newConfig)
  wren = BasicWren(Object.assign({}, wren.config, newConfig))

  removeDescendants(house)

  const bays = redrawHouse()

  // house.children = bays
  bays.forEach(bay => house.add(bay))

  // house.children.forEach(child => {
  //   child.children.forEach(c => {
  //     // c.geometry.translate( child.position.x, child.position.y, child.position.z );
  //     c.updateMatrix()
  //     outlineGeometry.merge(c.geometry, c.matrix)
  //   })
  // })
  outlineMesh = outline(wren.framePoints, wren.totalLength)
  outlineMesh.position.z = -wren.totalLength/2-0.04
  outlineMesh.position.y = -0.03
  outlineMesh.scale.multiplyScalar(1.03)
  house.add(outlineMesh)

  balls = [
    clone(sourceBall, {y: wren.config.height, z: wren.config.frameDepth/2 }, {}, {boundVariable: 'height', bindFn: (x => x), dragAxis: 'y'}),
    // clone(sourceBall, {y: wren.config.wallHeight/2, z: (wren.config.bayLength * wren.config.totalBays)/2 },{}, {dragAxis: 'z' }),
    clone(sourceBall, {y: wren.config.wallHeight/2, x: wren.config.width/2 + wren.config.frameDepth}, {}, {boundVariable: 'width', bindFn: (x => x*2), dragAxis: 'x'}),
    clone(sourceBall, {y: wren.config.wallHeight/2, x: -wren.config.width/2}, {}, {boundVariable: 'width', bindFn: (x => -x*2), dragAxis: 'x'})
  ]
  balls.forEach(ball => house.add(ball))
}

const raycaster = new THREE.Raycaster()
const groundPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0))
const plane = new THREE.Plane()

var light = new THREE.AmbientLight(0x404040)
scene.add(light)

let uiState = {
  action: 'RESIZE',
  target: undefined,
  activeTarget: undefined,
  offset: undefined,
  mouseDown: false,
  mouse: { x: 0, y: 0 }
}

// Event Listeners

function onMouseUp(event) {
  uiState.mouseDown = false
  uiState.activeTarget = undefined
  orbitControls.enabled = true
  mouseEvent(event)
}

function onMouseDown(event) {
  uiState.mouseDown = true
  if (uiState.target) {
    uiState.activeTarget = uiState.target
    uiState.offset = uiState.activeTarget.point.sub(uiState.activeTarget.object.position)
    orbitControls.enabled = false
  } else {
    uiState.activeTarget = undefined
  }
  mouseEvent(event)
}

function onMouseMove(event) {
  mouseEvent(event)
}

function mouseEvent(event) {
  uiState.mouse = {
    x :(event.clientX/window.innerWidth)*2 - 1,
    y: -(event.clientY/window.innerHeight)*2 + 1
  }
  raycaster.setFromCamera(uiState.mouse, camera)

  let objects = []
  if (uiState.action === 'RESIZE') objects = balls
  else if (uiState.action === 'MOVE' || uiState.action === 'ROTATE') objects = [outlineMesh]

  const intersects = raycaster.intersectObjects(objects)

  if (intersects.length > 0) {
    if (uiState.action === 'MOVE' || uiState.action === 'ROTATE') outlineMesh.material.visible = true
    uiState.target = intersects[0]
    setCursor('GRAB')
  } else {
    // if (uiState.action != 'ROTATE')
    if (!uiState.mouseDown) outlineMesh.material.visible = false
    if (!uiState.clicked) {
      setCursor('DEFAULT')
      uiState.target = undefined
    }
  }
  let intersection = new THREE.Vector3()

  if (uiState.activeTarget) {
      setCursor('GRABBING')

      if (uiState.action === 'RESIZE') {
        const ball = uiState.activeTarget.object
        plane.setFromNormalAndCoplanarPoint(
          camera.getWorldDirection(plane.normal),
          ball.position
        )
        if (raycaster.ray.intersectPlane(plane, intersection)) {
          ball.position[ball.userData.dragAxis] = intersection[ball.userData.dragAxis]
          redraw({ [ball.userData.boundVariable]: ball.userData.bindFn(ball.position[ball.userData.dragAxis]) })
        }
      } else if (uiState.action === 'MOVE') {
        if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
          house.position.x = intersection.x
          house.position.z = intersection.z
        }
      } else {
        house.rotation.y = uiState.mouse.x * 4
      }
  }
}

document.querySelectorAll('li').forEach(li => li.addEventListener('click', function(event){
  uiState.action = event.target.id

  if (uiState.action === 'RESIZE') {
    balls.forEach(ball => ball.visible = true)
  } else {
    balls.forEach(ball => ball.visible = false)
  }

  if (uiState.action === 'MOVE' || uiState.action === 'ROTATE') {
    outline.visible = true
  } else {
    outline.visible = false
  }

  document.querySelectorAll('li').forEach(li => li.classList.remove('active'))
  event.target.classList.add('active')
}))

const controls = ['totalBays', 'width', 'height']
controls.forEach( val =>
  document.getElementById(val).addEventListener('input', event => redraw({ [val]: Number(event.target.value) }))
)

document.getElementById('clippingHeight').addEventListener('input', event => {
  const clippingPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,Number(event.target.value),0));
  renderer.clippingPlanes = [ clippingPlane ];
})

container.addEventListener('mousemove', onMouseMove)
container.addEventListener('mousedown', onMouseDown)
container.addEventListener('mouseup', onMouseUp)

redraw(wren.config)

function render() {
  stats.begin()
  renderer.render(scene, camera)
  // clippingPlane.position.y -= 0.01
  stats.end()
  rendererStats.update(renderer)
  requestAnimationFrame(render)
}

requestAnimationFrame(render)
