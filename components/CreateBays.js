const noflo = require('noflo');

const Bay = require('../src/lib/wren/outputs/pieces/bay')

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Create bays, the sections between frames';
  c.icon = 'forward';
  c.inPorts.add('parameters', {
    datatype: 'object',
    description: 'Wren model parameters'
  });
  c.inPorts.add('fin', {
    datatype: 'object',
    description: 'Wren fin profile'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  c.process(function (input, output) {
    // Check preconditions on input data
    if (!input.hasData('parameters', 'fin')) {
      return;
    }
    // Read packets we need to process
    const params = input.getData('parameters');
    const fin = input.getData('fin');

    // Process data and send output
    const numFrames = params.dimensions.bays + 1
    var bays = []
    for (var i=0; i<numFrames; i++) {
      bays.push(Bay(fin, params, i))
    }
    output.send({
      out: bays
    });
    // Deactivate
    output.done();
  });
  return c;
};

