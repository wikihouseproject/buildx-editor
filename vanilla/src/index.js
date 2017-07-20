import { ground } from "./components"
import { renderer, container, scene, camera, orbitControls, stats, rendererStats, updateClippingPlane } from "./scene"
import BasicWren from "../../src/lib/wren/basic_wren"
import defaults from '../../src/extras/config'
import Mouse from './mouse'
import House from './house'

let wren = BasicWren(Object.assign({}, defaults, {totalBays: 6}))

let currentAction = 'RESIZE'

const mouse = Mouse(window,container)

const groundPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0))
const plane = new THREE.Plane()

const house = House(wren)

scene.add(ground(20,20))
scene.add(house.house)

const raycaster = new THREE.Raycaster()

document.querySelectorAll('li').forEach(li => li.addEventListener('click', function(event){
  currentAction = event.target.id
  if (currentAction === 'RESIZE') {
    house.balls.forEach(ball => ball.visible = true)
  } else {
    house.balls.forEach(ball => ball.visible = false)
  }
  if (currentAction === 'MOVE' || currentAction === 'ROTATE') {
    house.outline.visible = true
  } else {
    house.outline.visible = false
  }
  document.querySelectorAll('li').forEach(li => li.classList.remove('active'))
  event.target.classList.add('active')
}))

const controls = ['totalBays', 'width', 'height']
controls.forEach( val =>
  document.getElementById(val).addEventListener('input', event => house.redraw({ [val]: Number(event.target.value) }))
)

document.getElementById('clippingHeight').addEventListener('input', event => {
  updateClippingPlane(Number(event.target.value))
})

mouse.events.on('down', () => {
  if (mouse.state.target) {
    // state.offset = state.activeTarget.point.sub(state.activeTarget.object.position)
    orbitControls.enabled = false
  }
})

mouse.events.on('up', () => {
  orbitControls.enabled = true
})

mouse.events.on('all', mouseEvent)

function mouseEvent() {
  raycaster.setFromCamera(mouse.state.position, camera)


  let objects = []
  if (currentAction === 'RESIZE') objects = house.balls
  else if (currentAction === 'MOVE' || currentAction === 'ROTATE') objects = [house.outlineMesh]

  const intersects = raycaster.intersectObjects(objects)

  if (intersects.length > 0) {
    if (currentAction === 'MOVE' || currentAction === 'ROTATE') house.outlineMesh.material.visible = true
    mouse.state.target = intersects[0]
    mouse.setCursor('GRAB')
  } else {
    //// if (currentAction != 'ROTATE')
    if (!mouse.state.isDown) house.outlineMesh.material.visible = false
    if (!mouse.state.clicked) {
      mouse.setCursor('DEFAULT')
      mouse.state.target = undefined
    }
  }
  let intersection = new THREE.Vector3()

  if (mouse.state.activeTarget) {
    mouse.setCursor('GRABBING')

    if (currentAction === 'RESIZE') {
      const ball = mouse.state.activeTarget.object
      plane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(plane.normal),
        ball.position
      )
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        ball.position[ball.userData.dragAxis] = intersection[ball.userData.dragAxis]
        house.redraw({ [ball.userData.boundVariable]: ball.userData.bindFn(ball.position[ball.userData.dragAxis]) })
      }
    } else if (currentAction === 'MOVE') {
      if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
        house.house.position.x = intersection.x
        house.house.position.z = intersection.z
      }
    } else {
      house.house.rotation.y = mouse.state.position.x * 4
    }
  }
}

house.redraw(wren.config)

function render() {
  stats.begin()
  renderer.render(scene, camera)
  // clippingPlane.position.y -= 0.01
  stats.end()
  rendererStats.update(renderer)
  requestAnimationFrame(render)
}

requestAnimationFrame(render)
