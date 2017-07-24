import { ground } from "./components"
import { renderer, container, scene, camera, orbitControls, stats, rendererStats, updateClippingPlane } from "./scene"
import * as w from "../lib/wren"
import defaults from '../config'
import Mouse from './mouse'
import House from './house'

let currentAction = "RESIZE"

const mouse = Mouse(window,container)

const raycaster = new THREE.Raycaster()

const groundPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0))
const plane = new THREE.Plane()

const house = House(w)
house.redraw()

scene.add(ground(20,20))
scene.add(house.house)

// Control Inputs Events

function changeCurrentAction(event) {
  currentAction = event.target.id

  // hide balls unless resizing
  house.balls.forEach(ball => ball.visible = (currentAction === 'RESIZE'))
  // hide outline unless moving or rotating
  house.outlineMesh.visible = (currentAction === 'MOVE' || currentAction === 'ROTATE')

  // change activeState
  document.querySelectorAll('li').forEach(li => li.classList.remove('active'))
  event.target.classList.add('active')
}
document.querySelectorAll('li').forEach(li => li.addEventListener('click', changeCurrentAction))

const controls = ['totalBays', 'width', 'height']
controls.forEach( val =>
  document.getElementById(val).addEventListener('input', event => house.redraw({ [val]: Number(event.target.value) }))
)

document.getElementById('clippingHeight').addEventListener('input', event => {
  updateClippingPlane(Number(event.target.value))
})

// Mouse Events

mouse.events.on('down', () => {
  if (mouse.state.target) orbitControls.enabled = false
})

mouse.events.on('up', () => {
  orbitControls.enabled = true
})

let hitTestObjects = [],
    intersects = [],
    intersectFn = undefined

mouse.events.on('all', mouseEvent)

function mouseEvent() {
  raycaster.setFromCamera(mouse.state.position, camera)

  if (currentAction === 'RESIZE') {
    hitTestObjects = house.balls
    intersectFn = handleResize
  } else if (currentAction === 'MOVE') {
    hitTestObjects = [house.outlineMesh]
    intersectFn = handleMove
  } else if (currentAction === 'ROTATE') {
    hitTestObjects = [house.outlineMesh]
    intersectFn = handleRotate
  }

  intersects = raycaster.intersectObjects(hitTestObjects)
  mouse.handleIntersects(intersects)
  intersectFn(intersects, new THREE.Vector3())
}

function handleOutlineMesh(intersects) {
  if (intersects.length > 0) {
    house.outlineMesh.material.visible = true
  } else {
    if (!mouse.state.isDown) house.outlineMesh.material.visible = false
  }
}

function handleMove(intersects, intersection) {
  handleOutlineMesh(intersects)
  if (mouse.state.activeTarget) {
    if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
      house.house.position.x = intersection.x
      house.house.position.z = intersection.z
    }
  }
}

function handleRotate(intersects, intersection) {
  handleOutlineMesh(intersects)
  if (mouse.state.activeTarget) {
    house.house.rotation.y = mouse.state.position.x * 4
  }
}

function handleResize(intersects, intersection) {
  if (mouse.state.activeTarget) {
    const ball = mouse.state.activeTarget.object
    plane.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(plane.normal),
      ball.position
    )
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      // ball.position[ball.userData.dragAxis] = intersection[ball.userData.dragAxis]
      house.redraw({ [ball.userData.boundVariable]: ball.userData.bindFn(intersection[ball.userData.dragAxis]) })
      document.getElementById(ball.userData.boundVariable).value = intersection[ball.userData.dragAxis].toFixed(1)
    }
  }
}

function render() {
  stats.begin()
  renderer.render(scene, camera)
  // clippingPlane.position.y -= 0.01
  stats.end()
  rendererStats.update(renderer)
  requestAnimationFrame(render)
}

requestAnimationFrame(render)
