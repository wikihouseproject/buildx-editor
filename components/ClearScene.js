const noflo = require('noflo'); 

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Remove every object in scene';
  c.icon = 'forward';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to forward'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  c.process(function (input, output) {
    // Check preconditions on input data
    if (!input.hasData('in')) {
      return;
    }
    // Read packets we need to process
    const data = input.getData('in');

    const scene = window.scene;
    const objects = scene.children.length;
    for( var i = scene.children.length - 1; i >= 0; i--) {
      const child = scene.children[i];
      scene.remove(child);
    }
    const out = objects;
    // Process data and send output
    output.send({
      out: out
    });
    // Deactivate
    output.done();
  });
  return c;
};

