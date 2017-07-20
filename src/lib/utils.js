const removeDescendants = (current, parent=null) => {
  const numChildren = current.children.length
  if (numChildren > 0) {
    for (let i = 0; i < numChildren; i++) {
      removeDescendants(current.children[i], parent)
    }
  } else if (parent) {
    parent.remove(current)
    current.geometry.dispose()
    current.material.dispose()
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
