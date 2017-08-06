import { renderer, container, scene, camera, stats, rendererStats, updateClippingPlane } from "./ui/scene"
import { ground } from "./components"
import Mouse from './ui/controls/mouse'
import HUD from './ui/controls/hud'
// import Sidebar from './ui/controls/sidebar'
import House from './components/house'
import { merge } from "lodash"
import Wren from "../lib/wren"
import WrenWorker from "worker-loader!../lib/wren/worker"

const CONFIG = {
  WEBWORKERS: true
}

// --------

const USING_WEBWORKERS = (window.Worker && CONFIG.WEBWORKERS)

var wrenWorker = (USING_WEBWORKERS) ? new WrenWorker : null

let dimensions = Wren().inputs.dimensions
const changeDimensions = house => newDimensions => {
  dimensions = merge(dimensions, newDimensions)
  if (USING_WEBWORKERS) {
    wrenWorker.postMessage({dimensions})
  } else {
    house.update(Wren({dimensions}).outputs.pieces)
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
  let initialPieces = Wren({dimensions}).outputs.pieces
  const house = House(initialPieces)

  if (USING_WEBWORKERS) {
    wrenWorker.onmessage = event => house.update(event.data.pieces)
  }

  const hud = HUD(dimensions, changeDimensions(house))

  scene.add(ground(10,10))
  scene.add(house.output)

  requestAnimationFrame(render)
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

// requestAnimationFrame(render)
