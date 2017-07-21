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

const rad2Deg = radians => radians * 180/Math.PI

const deg2Rad = degrees => degrees * Math.PI/180

const times = (n, iterator) => {
  var accum = Array(Math.max(0, n));
  for (var i = 0; i < n; i++) accum[i] = iterator.call();
  return accum;
}

module.exports = {
  removeDescendants,
  rad2Deg,
  deg2Rad,
  times
}
