const Wren = require('./index')

onmessage = function(e) {
  Wren(e.data).then((wren) => {
    postMessage({pieces: wren.outputs})
  })
}
