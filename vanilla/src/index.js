import { ground, frame, clone, house, connector, outerWall, roof, ball, floor } from "./components"
import { container, scene, camera, orbitControls, render, setCursor } from "./scene"
import { removeDescendants, rad2Deg } from "../../src/lib/utils"
import BasicWren from "../../src/lib/wren/basic_wren"
import defaults from '../../src/extras/config'
let wren = BasicWren(defaults)

let balls = []
const sourceBall = ball()

scene.add(ground(20,20))
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
    bay.add(clone(sourceFrame, {}))

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
      bay.add(clone(sourceRoof, {y: config.height}, {z: Math.PI/2, x: -Math.PI/2, y: wren.roofAngle-Math.PI/2}))
      bay.add(clone(sourceRoof, {y: config.height + config.plyThickness }, {z: -Math.PI/2, x: Math.PI/2, y: wren.roofAngle-Math.PI/2}))

      // ceiling
      // bay.add(clone(sourceRoof, {y: config.height-config.connectorHeight}, {z: Math.PI/2, x: -Math.PI/2}))
      // bay.add(clone(sourceRoof, {y: config.height-config.connectorHeight}, {z: -Math.PI/2, x: Math.PI/2}))

      // outer walls
      bay.add(clone(sourceOuterWall, {x: config.width/2, z: -config.bayLength/2}, {y: Math.PI/2}))
      // bay.add(clone(sourceOuterWall, {x: -config.width/2 - config.plyThickness, z: -config.bayLength/2}, {y: Math.PI/2}))
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
  house.children = redrawHouse()

  balls = [
    clone(sourceBall, {y: wren.config.height, z: wren.config.frameDepth/2 }, {}, {boundVariable: 'height', bindFn: (x => x), dragAxis: 'y'}),
    // clone(sourceBall, {y: wren.config.wallHeight/2, z: (wren.config.bayLength * wren.config.totalBays)/2 },{}, {dragAxis: 'z' }),
    clone(sourceBall, {y: wren.config.wallHeight/2, x: wren.config.width/2 + wren.config.frameDepth}, {}, {boundVariable: 'width', bindFn: (x => x*2), dragAxis: 'x'})
  ]
  balls.forEach(ball => house.add(ball))
}

const raycaster = new THREE.Raycaster()
const groundPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0))
const plane = new THREE.Plane()

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

  const intersects = raycaster.intersectObjects(balls)

  if (intersects.length > 0) {
    uiState.target = intersects[0]
    setCursor('GRAB')
  } else {
    if (!uiState.clicked) {
      setCursor('DEFAULT')
      uiState.target = undefined
    }
  }
  let intersection = new THREE.Vector3()

  if (uiState.activeTarget) {
    if (uiState.action === 'RESIZE') {
      setCursor('GRABBING')
      const ball = uiState.activeTarget.object
      plane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(plane.normal),
        ball.position
      )
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        ball.position[ball.userData.dragAxis] = intersection[ball.userData.dragAxis]
        redraw({ [ball.userData.boundVariable]: ball.userData.bindFn(ball.position[ball.userData.dragAxis]) })
      }
    }
  }

  // if (uiState.activeTarget && raycaster.ray.intersectPlane(groundPlane, intersection)) {
  //   if (uiState.action === 'MOVE') {
  //     // // uiState.activeTarget.object.position.copy(intersection.sub(uiState.offset))
  //     // uiState.activeTarget.object.position.x = intersection.x - uiState.offset.x
  //     // uiState.activeTarget.object.position.z = intersection.z - uiState.offset.z
  //   } else if (uiState.action === 'ROTATE') {
  //     uiState.activeTarget.object.rotation.y = uiState.mouse.x * 4
  //   } else if (uiState.action === 'RESIZE') {
  //     scene.add(new THREE.ArrowHelper(
  //       uiState.activeTarget.face.normal,
  //       uiState.activeTarget.object.position,
  //       2,
  //       0xFF0000
  //     ))
  //   }
  // }

}

document.querySelectorAll('li').forEach(li => li.addEventListener('click', function(event){
  uiState.action = event.target.id
  document.querySelectorAll('li').forEach(li => li.classList.remove('active'))
  event.target.classList.add('active')
}))

const controls = ['totalBays', 'width', 'height']
controls.forEach( val =>
  document.getElementById(val).addEventListener('input', event => redraw({ [val]: Number(event.target.value) }))
)

container.addEventListener('mousemove', onMouseMove)
container.addEventListener('mousedown', onMouseDown)
container.addEventListener('mouseup', onMouseUp)


redraw(wren.config)
requestAnimationFrame(render)
