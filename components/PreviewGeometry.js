const noflo = require('noflo');

//import * as components from '../src/components'; // XXX: using import makes 'exports' go away

// const components = require('../src/editor/components');
const {makePiece} = require('../src/editor/components');

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Render geometry into 3d-view';
  c.icon = 'forward';
  c.inPorts.add('color', {
    datatype: 'all',
    description: 'Fin color'
  });
  c.inPorts.add('geometry', {
    datatype: 'all',
    description: 'Geometry data'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  c.process(function (input, output) {
    // Check preconditions on input data
    if (!input.hasData('geometry')) {
      return;
    }
    // Read packets we need to process
    var geometry = Object.values(input.getData('geometry'));
    var color = input.getData('color');

    const scene = window.scene; // XXX: hack

    const is2dPoint = (p) => {
      return (p && Array.isArray(p) && (p.length == 2));
    }
    const is2dPointArray = (a) => {
      const nonEmptyArray = (a && Array.isArray(a) && (a.length > 0));
      const childIs2d = is2dPoint(a[0]);
      // console.log('a', a, nonEmptyArray, a[0], a[0].length);
      return nonEmptyArray && childIs2d;
    }

    var items = [];
    if (geometry == 'box') {
      var geometry = new THREE.BoxGeometry( 500, 500, 500 );
      var material = new THREE.MeshBasicMaterial( { color: color } );
      var cube = new THREE.Mesh( geometry, material );
      items.push(cube);
    } else if (is2dPointArray(geometry)) {
      const shrunkGeometry = geometry.map( ([x,y]) => ([x/1000, y/1000]) )
      const piece = makePiece(shrunkGeometry, 1, color);
      items.push(piece);
    }

    items.map(item => {
      scene.add(item);
    })

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

