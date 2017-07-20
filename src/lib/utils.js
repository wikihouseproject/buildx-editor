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

module.exports = { removeDescendants, rad2Deg, deg2Rad }
