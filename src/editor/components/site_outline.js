const SiteOutline = _coords => {
  const scale = 1000
  const coords = _coords.map( ([x,y]) => ([x*scale, y*scale]))
  const [startX, startY] = coords[0]
  const outlineY = 1

  const geometry = new THREE.Geometry()
  geometry.vertices.push( new THREE.Vector3( startX, outlineY, startY ) );
  for (const [x,y] of coords.slice(1)) {
    geometry.vertices.push( new THREE.Vector3( x, outlineY, y ) );
  }
  geometry.vertices.push( new THREE.Vector3( startX, outlineY, startY ) );

  const material = new THREE.LineBasicMaterial({ color: 0x000000 })
  const line = new THREE.Line(geometry, material)

  return line
}

module.exports = SiteOutline
