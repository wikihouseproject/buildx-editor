const noflo = require('noflo');

//import * as components from '../src/components'; // XXX: using import makes 'exports' go away

const components = require('../src/components');

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Render geometry into 3d-view';
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

    const is2dPoint = (p) => {
      return p && Array.isArray(p) && Array.isArray(p.length == 2)
    }
    const is2dPointArray = (a) => {
      const nonEmptyArray = a && Array.isArray(a) && a.length;
      const childIs2d = is2dPoint(a[0]);
      console.log('a', a, nonEmptyArray, childIs2d);
      return nonEmptyArray && childIs2d;
    }

    var items = [];
    if (geometry == 'box') {
      var geometry = new THREE.BoxGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
      var cube = new THREE.Mesh( geometry, material );
      items.push(cube);
    } else if (is2dPointArray(geometry)) {
      const outline = components.outline(geometry, 10);
      items.push(outline);
    }

    items.map((i) => {
      scene.add(i);
    });
    const out = items;

    // Process data and send output
    output.send({
      out: out
    });
    // Deactivate
    output.done();
  });
  return c;
};

