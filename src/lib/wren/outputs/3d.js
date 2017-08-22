
// Apply pos,rot transformation to part.pts
export function getPointsPosition(part) {
  var positions = []

  //const order = part.rot.order.split("").reverse().join("")
  //console.log('r', part.rot, order)
  const euler = new THREE.Euler(part.rot.x, part.rot.y, part.rot.z, part.rot.order)
  //const euler = new THREE.Euler(Math.PI, 0, 0, part.rot.order)
  const pos = part.pos
 
  for (var i=0; i<part.pts.length; i++) {
    const pt = part.pts[i]
    console.log('p', pt, pos)
    var v = new THREE.Vector3(pos.x+pt[0], pos.y+pt[1], pos.z+0.0)
    //var v = new THREE.Vector3(pos.x, pos.y, pos.z)
    v.applyEuler(euler)
    positions.push([v.x, v.y, v.z])
    //positions.push([v.x+pt[0], v.y+pt[1], v.z])
  }
  return positions
}
