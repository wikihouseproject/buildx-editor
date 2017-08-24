const noflo = require('noflo');

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Create the shape of fin';
  c.icon = 'forward';
  c.inPorts.add('frames', {
    datatype: 'object',
    description: 'Frame geometries'
  });
  c.inPorts.add('bays', {
    datatype: 'object',
    description: 'Bay geometries'
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
    if (!input.hasData('frames', 'bays', 'fin')) {
      return;
    }

    // Process data and send output
    const out = {
      points: input.getData('fin'),
      pieces: {
        frames: input.getData('frames'),
        bays: input.getData('bays'),
      }
    };

    output.send({
      out: out
    });
    // Deactivate
    output.done();
  });
  return c;
};

