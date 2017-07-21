const noflo = require('noflo');

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Get default Wren model parameters';
  c.icon = 'forward';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Geometry data'
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
    var geometry = input.getData('in');

    const scene = window.scene; // XXX: hack

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add(cube)

    const out = cube;

    // Process data and send output
    output.send({
      out: out
    });
    // Deactivate
    output.done();
  });
  return c;
};

