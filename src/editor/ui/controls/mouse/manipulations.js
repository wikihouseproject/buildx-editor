// Mouse Events
// let hitTestObjects = [],
//     intersects = [],
//     intersectFn = undefined
// function mouseEvent() {
//   raycaster.setFromCamera(mouse.state.position, camera)
//   // if (currentAction === 'RESIZE') {
//   //   hitTestObjects = house.balls
//   //   intersectFn = handleResize
//   // } else if (currentAction === 'MOVE') {
//   //   hitTestObjects = [house.outlineMesh]
//   //   intersectFn = handleMove
//   // } else if (currentAction === 'ROTATE') {
//   //   hitTestObjects = [house.outlineMesh]
//   //   intersectFn = handleRotate
//   // }
//   // intersects = raycaster.intersectObjects(hitTestObjects)
//   // mouse.handleIntersects(intersects)
//   // intersectFn(intersects, new THREE.Vector3())
// }
// mouse.events.on('all', mouseEvent)
// // function handleOutlineMesh(intersects) {
// //   if (intersects.length > 0) {
// //     house.outlineMesh.material.visible = true
// //   } else {
// //     if (!mouse.state.isDown) house.outlineMesh.material.visible = false
// //   }
// // }
// // function handleMove(intersects, intersection) {
// //   handleOutlineMesh(intersects)
// //   if (mouse.state.activeTarget) {
// //     if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
// //       house.house.position.x = intersection.x
// //       house.house.position.z = intersection.z
// //     }
// //   }
// // }
// // function handleRotate(intersects, intersection) {
// //   handleOutlineMesh(intersects)
// //   if (mouse.state.activeTarget) {
// //     house.house.rotation.y = mouse.state.position.x * 4
// //   }
// // }
// // function handleResize(intersects, intersection) {
// //   if (mouse.state.activeTarget) {
// //     const ball = mouse.state.activeTarget.object
// //     raycastPlane.setFromNormalAndCoplanarPoint(
// //       camera.getWorldDirection(raycastPlane.normal),
// //       ball.position
// //     )
// //     if (raycaster.ray.intersectPlane(raycastPlane, intersection)) {
// //       // ball.position[ball.userData.dragAxis] = intersection[ball.userData.dragAxis]
// //       house.redraw({ [ball.userData.boundVariable]: ball.userData.bindFn(intersection[ball.userData.dragAxis]) })
// //       document.getElementById(ball.userData.boundVariable).value = intersection[ball.userData.dragAxis].toFixed(1)
// //     }
// //   }
// // }
