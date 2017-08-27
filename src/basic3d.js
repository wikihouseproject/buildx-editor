import * as nofloTools from './lib/fbptools';
import Wren from './lib/wren';
import defaults from './lib/wren/defaults'

import * as uuid from 'uuid';

window.wren = Wren;

function setupNoFlo(callback) {

  // Use a persistent runtime id
  const idKey = 'noflo_runtime_id';
  const storage = window.localStorage; // could also use sessionStorage
  var runtimeId = storage.getItem(idKey);
  if (!runtimeId) {
    runtimeId = uuid.v4();
    storage.setItem(idKey, runtimeId);
  }

  const o = {
    id: runtimeId,
    namespace: 'buildx-editor',
    repository: 'wikihouse-project/buildx-editor',
  }

  nofloTools.setupAndRun(o, (err, runtime) => {
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
    const url = nofloTools.flowhubURL(runtime.id);
    const link = flowhubLink(url);
    link.id = 'flowhubLink';
    link.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      runtime.openClient(link.getAttribute('href'));
    });
    document.body.appendChild(link);

    const params = defaults
  
    var lastGraphName = 'default/main'
    const sendInputs = (graphName) => {
        // Send the scene to NoFlo
        const scenePacket = {
          graph: graphName,
          port: 'scene',
          event: 'data',
          payload: scene,
        }
        const parametersPacket = {
          graph: graphName,
          port: 'parameters',
          event: 'data',
          payload: params,
        }
        runtime.runtime.sendPacket(parametersPacket, (err) => {
          if (err) {
            console.error('send packet failed', err)
          }
        })
        runtime.runtime.sendPacket(scenePacket, (err) => {
          if (err) {
            console.error('scene send packet failed', err)
          }
        })
    }

    document.getElementById('send-data').addEventListener('click', () => sendInputs(lastGraphName))

    runtime.runtime.on('ports', (ports) => {
        console.log('Ports changed:', ports)
        lastGraphName = ports.graph
        sendInputs(ports.graph) // Assume network changed and needs inputs anew
    })

    runtime.runtime.on('packet', (msg) => {
        if (msg.event != 'data') {
            // ignore connect/disconnect
            return
        }
        console.log('NoFlo sent:', msg)
    })

    sendInputs(lastGraphName)
  });

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 2, 2, 2 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 10;

  const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)

  var animate = function () {
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
  };

  requestAnimationFrame( animate );

}
main();

