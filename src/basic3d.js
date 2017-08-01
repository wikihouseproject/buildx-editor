import * as noflo from './lib/noflo';
import * as wren from './lib/wren';

import * as uuid from 'uuid';

window.wren = wren; // Hack to expose for NoFlo components, built with another

function setupNoFlo(callback) {

  const idKey = 'noflo_runtime_id';
  const storage = window.localStorage; // could also use sessionStorage
  var runtimeId = storage.getItem(idKey);
  if (!runtimeId) {
    runtimeId = uuid.v4();
    // Persistence DISABLED, due to https://github.com/noflo/noflo-ui/issues/748
    //storage.setItem(idKey, runtimeId);
  }

  noflo.setupAndRun({ id: runtimeId }, (err, runtime) => {
    return callback(err, runtime);
  });

}

function flowhubLink(url) {
  var link = document.createElement('a');
  link.innerHTML = "Open in Flowhub";
  link.className = "debug";
  link.href = url;
  link.target = '_blank';
  return link;
}


function main() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  var nofloRuntime = null;

  setupNoFlo((err, runtime) => {
    if (err) {
      throw err;
    }

    nofloRuntime = runtime;
    console.log('NoFlo running, adding link');
    const url = noflo.flowhubURL(runtime.signaller, runtime.id);
    console.log('Open in Flowhub URL:\n', url);
    const link = flowhubLink(url);
    link.id = 'flowhubLink';
    document.body.appendChild(link);

    // Send the scene to NoFlo
    // XXX: does not work, since project mode rebuilds the graph/network
    noflo.sendToInport(runtime, 'default/main', 'scene', scene);
    window.scene = scene; // HACK
  });

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 500, 500, 500 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 1000;

  var animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;

    renderer.render(scene, camera);
  };

  animate();

}
main();

