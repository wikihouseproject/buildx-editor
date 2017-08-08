
// Control Inputs Events

// function changeCurrentAction(event) {
//   currentAction = event.target.id
//   // hide balls unless resizing
//   house.balls.forEach(ball => ball.visible = (currentAction === 'RESIZE'))
//   // hide outline unless moving or rotating
//   house.outlineMesh.visible = (currentAction === 'MOVE' || currentAction === 'ROTATE')
//   // change activeState
//   // document.querySelectorAll('li').forEach(li => li.classList.remove('active'))
//   event.target.classList.add('active')
// }
// document.querySelectorAll('li').forEach(li => li.addEventListener('click', changeCurrentAction))

// const controls = ['totalBays', 'width', 'height']
// controls.forEach( val =>
//   document.getElementById(val).addEventListener('input', event => house.redraw({ [val]: Number(event.target.value) }))
// )

// document.getElementById('clippingHeight').addEventListener('input', event => {
//   updateClippingPlane(Number(event.target.value))
// })
