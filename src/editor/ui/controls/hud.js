const addControlTo = (gui, obj, changeDimensionsFn) => (param, min, max, step) => {
  var control = gui.add(obj, param).min(min).max(max).step(step)
  control.onChange(value => changeDimensionsFn({[param]: value}))
}

const HUD = (dimensions, changeDimensionsFn) => {
  const gui = new dat.GUI();
  const addControl = addControlTo(gui, dimensions, changeDimensionsFn)

  addControl('width', 1000, 5000, 1)
  addControl('roofApexHeight', 2000, 5000, 1)
  addControl('roofApexOffset', -3000, 3000, 1)
  addControl('leftWallHeight', 1000, 5500, 1)
  addControl('rightWallHeight', 1000, 5500, 1)

  addControl('bays', 3, 15, 1)
}

module.exports = HUD
