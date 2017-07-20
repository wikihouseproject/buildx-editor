const EventEmitter = require('eventemitter3')

const Mouse = (_window, container) => {

  let state = {
    target: undefined,
    activeTarget: undefined,
    offset: undefined,
    isDown: false,
    position: { x: 0, y: 0 }
  }

  const events = new EventEmitter();

  container.addEventListener('mousemove', onMouseMove)
  container.addEventListener('mousedown', onMouseDown)
  container.addEventListener('mouseup', onMouseUp)

  function onMouseUp(event) {
    state.isDown = false
    state.activeTarget = undefined
    events.emit('up')
    mouseEvent(event)
  }

  function onMouseMove(event) {
    mouseEvent(event)
    events.emit('move')
  }

  function onMouseDown(event) {
    state.isDown = true
    if (state.target) {
      state.activeTarget = state.target
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
    setCursor
  }

}

module.exports = Mouse
