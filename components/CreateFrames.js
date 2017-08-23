const noflo = require('noflo');

const Frame = require('../src/lib/wren/outputs/pieces/frame')

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Create the frames, the polygonal support of the building';
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
    var frames = []
    for (var i=0; i<numFrames; i++) {
      frames.push(Frame(fin, params, i))
    }
    output.send({
      out: frames
    });
    // Deactivate
    output.done();
  });
  return c;
};

