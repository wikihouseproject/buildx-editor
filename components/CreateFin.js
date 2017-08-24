const noflo = require('noflo');

const points = require('../src/lib/wren/outputs/points')

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Create the shape of fin';
  c.icon = 'forward';
  c.inPorts.add('parameters', {
    datatype: 'object',
    description: 'Wren model parameters'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  c.process(function (input, output) {
    // Check preconditions on input data
    if (!input.hasData('parameters')) {
      return;
    }
    // Read packets we need to process
    var data = input.getData('parameters');

    // Process data and send output
    const out = points(data.dimensions);

    output.send({
      out: out
    });
    // Deactivate
    output.done();
  });
  return c;
};

