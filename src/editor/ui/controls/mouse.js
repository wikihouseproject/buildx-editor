const EventEmitter = require('eventemitter3')

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
  orbitControls.minDistance = 10;
  orbitControls.maxDistance = 30;
  orbitControls.maxPolarAngle = Math.PI/2.1
  // orbitControls.enableDamping = true;
  // orbitControls.dampingFactor = 0.125;
  // orbitControls.enableZoom = false
  // renderer.domElement.addEventListener('mousewheel', mousewheel)

  function onMouseUp(event) {
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
    state.isDown = true
    if (state.target) {
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
      case 'GRAB':
        cursor = '-webkit-grab'
        break
      case 'GRABBING':
        cursor = '-webkit-grabbing'
        break
      default:
        cursor = 'default'
    }
    container.style.cursor = cursor
  }

  return {
    state,
    events,
    setCursor,
    handleIntersects,
    orbitControls
  }

}

module.exports = Mouse
