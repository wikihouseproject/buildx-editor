const HUD = wren => {
  var gui = new dat.GUI();

  gui.add(wren.inputs.dimensions, 'width', 1000, 5500)
  gui.add(wren.inputs.dimensions, 'leftWallHeight', 1000, 5500)
  gui.add(wren.inputs.dimensions, 'rightWallHeight', 1000, 5500)
  gui.add(wren.inputs.dimensions, 'roofApexHeight', 2000, 5000)
  gui.add(wren.inputs.dimensions, 'roofApexOffset', -1000, 1000)

  gui.add(wren.inputs.dimensions, 'bays', 5, 10)
}

module.exports = HUD
