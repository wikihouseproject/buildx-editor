import { renderer, container, scene, camera, stats, rendererStats, updateClippingPlane } from "./ui/scene"
import { ground } from "./components"
import Mouse from './ui/controls/mouse'
import HUD from './ui/controls/hud'
// import Sidebar from './ui/controls/sidebar'
import House from './components/house'
import SiteOutline from './components/site_outline'
import { merge } from "lodash"
import Wren from "../lib/wren"

import * as uuid from 'uuid';
import * as nofloTools from '../lib/fbptools';

// Export so NoFlo build can use it
window.wren = Wren

import WrenWorker from "worker-loader?inline!../lib/wren/worker"

const CONFIG = {
  WEBWORKERS: true
}

// --------

const USING_WEBWORKERS = (window.Worker && CONFIG.WEBWORKERS)

var wrenWorker = (USING_WEBWORKERS) ? new WrenWorker : null

let dimensions = Wren.inputs({}).dimensions
const changeDimensions = house => newDimensions => {
  dimensions = merge(dimensions, newDimensions)

  if (nofloNetworkLive) {
    sendToRuntime(nofloRuntime, lastGraphName, 'parameters', { dimensions })
    return
  }

  if (USING_WEBWORKERS) {
    wrenWorker.postMessage({dimensions})
  } else {

    Wren({dimensions}).then((res) => {
      house.update(res.outputs.pieces)
    })

  }
}

let currentAction = "RESIZE"

const raycaster = new THREE.Raycaster()
const raycastPlane = new THREE.Plane()
const groundPlane = new THREE.Plane([0,1,0])
// const groundPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0))

const mouse = Mouse(window, camera, renderer.domElement)

var loader = new THREE.TextureLoader();
loader.load('img/materials/plywood/birch.jpg',
  function(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    window.plyMaterial = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});

    prerender()
  },
  function(xhr) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  function(xhr) {
    console.error('An error occurred');
  }
)

function prerender() {

  Wren({dimensions}).then((res) => {

  const house = House(res.outputs.pieces)
  const siteOutline = SiteOutline([[-10,-10], [-10,10], [10,10], [10,-10]])

  if (USING_WEBWORKERS) {
    wrenWorker.onmessage = event => house.update(event.data.pieces)
  }

  setupRuntime((updatedGeometry) => {
    house.update(updatedGeometry.pieces)
  })

  const hud = HUD(dimensions, changeDimensions(house))

  scene.add(ground(10*1000,10*1000))
  scene.add(house.output)
  scene.add(siteOutline)

  requestAnimationFrame(render)
  })
}

function render() {
  stats.begin()
  renderer.render(scene, camera)
  mouse.orbitControls.update() // needed because of damping
  // clippingPlane.position.y -= 0.01
  stats.end()
  rendererStats.update(renderer)
  requestAnimationFrame(render)
}

// NoFlo runtime setup
var nofloRuntime = null;
var lastGraphName = 'default/main';
var nofloNetworkLive = false

function setupRuntime(onOutput) {

  setupNoFlo((err, runtime) => {
    if (err) {
      throw err;
    }
    nofloRuntime = runtime;

    // Allow swithi
    const url = nofloTools.flowhubURL(runtime.id);
    const link = flowhubLink(url);
    link.id = 'flowhubLink';
    link.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      connectRuntime(nofloRuntime, onOutput) // switch to using NoFlo network for geometry calc
      runtime.openClient(link.getAttribute('href')); // Open Flowhub
    });
    document.body.appendChild(link);
  })

}

function connectRuntime(runtime, onOutput) {
  nofloNetworkLive = true

  const sendInputs = () => {
    sendToRuntime(runtime, lastGraphName, 'parameters', { dimensions } )
  }

  runtime.runtime.on('ports', (ports) => {
    lastGraphName = ports.graph
    // Assume a different network, and inputs need to be sent anew
    sendInputs()
  })

  // Data sent by NoFlo network
  runtime.runtime.on('packet', (msg) => {
      if (msg.event != 'data') {
          // ignore connect/disconnect
          return
      }
      //console.log('received', msg.port, msg)
      if (msg.port == 'geometry') {
        setTimeout(() =>
          onOutput(msg.payload)
        , 0)
      } else {
        console.log('NoFlo sent data on unknown port:', msg)
      }
  })

  // Send current values
  sendInputs()
}

function sendToRuntime(runtime, graphName, port, data) {
  //console.log('sending', graphName, port, data)
  const packet = {
    event: 'data',
    graph: graphName,
    port,
    payload: data,
  }
  runtime.runtime.sendPacket(packet, (err) => {
    if (err) {
      console.error('send packet failed', err)
    }
  })
}

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
