const Wren = require('./index')

onmessage = function(e) {
  const wren = Wren(e.data)
  postMessage({pieces: wren.outputs.pieces})
}
