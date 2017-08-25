const EventEmitter = require('eventemitter3')
require('./manipulations')

const Mouse = (_window, camera, container) => {

  let state = {
    target: undefined,
    activeTarget: undefined,
    activeTargetOffset: undefined,
    isDown: false,
    position: { x: 0, y: 0 }
  }

  const events = new EventEmitter();

  container.addEventListener('mousemove', onMouseMove)
  container.addEventListener('mousedown', onMouseDown)
  container.addEventListener('mouseup', onMouseUp)

  const orbitControls = new THREE.OrbitControls(camera, container)
  orbitControls.minDistance = 1*1000;
  orbitControls.maxDistance = 30*1000;
  orbitControls.maxPolarAngle = Math.PI/2.1
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.1;
  orbitControls.rotateSpeed = 0.2;
  // orbitControls.enableZoom = false
  // renderer.domElement.addEventListener('mousewheel', mousewheel)

  function onMouseUp(event) {
    setCursor('ROTATE_UP')

    orbitControls.enabled = true
    state.isDown = false
    state.activeTarget = undefined
    events.emit('up')
    mouseEvent(event)
  }

  function onMouseMove(event) {
    events.emit('move')
    mouseEvent(event)
  }

  function onMouseDown(event) {
    setCursor('ROTATE_DOWN')

    state.isDown = true
    if (state.target) {
      orbitControls.enabled = false
      state.activeTarget = state.target
      state.activeTargetOffset = state.activeTarget.point.sub(state.activeTarget.object.position)
    } else {
      state.activeTarget = undefined
    }
    events.emit('down')
    mouseEvent(event)
  }

  function mouseEvent(event) {
    state.position = {
      x :(event.clientX/_window.innerWidth)*2 - 1,
      y: -(event.clientY/_window.innerHeight)*2 + 1
    }
    events.emit('all')
  }

  function handleIntersects(intersects) {
    if (intersects.length > 0) {
      state.target = intersects[0]
      setCursor('GRAB')
    } else if (!state.clicked) {
      setCursor('DEFAULT')
      state.target = undefined
    }
    if (state.activeTarget) setCursor('GRABBING')
  }

  const setCursor = type => {
    let cursor;
    switch(type) {
      case 'ROTATE_UP':
        cursor = 'grab'
        break
      case 'ROTATE_DOWN':
        cursor = 'grabbing'
        break
      case 'GRAB':
        cursor = 'grab'
        break
      case 'GRABBING':
        cursor = 'grabbing'
        break
      default:
        cursor = 'default'
    }
    container.dataset.cursor = cursor
  }

  setCursor('ROTATE_UP')

  return {
    state,
    events,
    setCursor,
    handleIntersects,
    orbitControls
  }

}

module.exports = Mouse
