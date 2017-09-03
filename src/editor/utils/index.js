const removeDescendants = current => {
  if (current) {
    if (current.type === "Object3D" && current.children) {
      // const numChildren = current.children.length
      for(let i = current.children.length - 1; i >= 0; i--) {
        removeDescendants(current.children[i])
      }
      // current.children.forEach(removeDescendants)

    } else if (current.type === "Mesh") {
      current.parent.remove(current)
      current.geometry.dispose()
      current.material.dispose()
    }
  }
}

// house.children.forEach(child => {
//   child.children.forEach(c => {
//     // c.geometry.translate( child.position.x, child.position.y, child.position.z );
//     c.updateMatrix()
//     outlineGeometry.merge(c.geometry, c.matrix)
//   })
// })

module.exports = {
  removeDescendants,
  scale: 1
}
