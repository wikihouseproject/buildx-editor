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
    // Read packets we need to process
    const [bays, frames, fin] = input.getData('bays', 'frames', 'fin');

    // Process data and send output
    const out = {
      points: fin,
      pieces: {
        frames,
        bays,
      }
    }

    output.send({
      out: out
    });
    // Deactivate
    output.done();
  });
  return c;
};

