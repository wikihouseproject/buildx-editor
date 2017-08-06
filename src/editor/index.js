import { renderer, container, scene, camera, stats, rendererStats, updateClippingPlane } from "./ui/scene"
import { ground } from "./components"
import Mouse from './ui/controls/mouse'
import HUD from './ui/controls/hud'
// import Sidebar from './ui/controls/sidebar'
import House from './components/house'
import Wren from "../lib/wren"
import { merge } from "lodash"

let wren = Wren({dimensions})
let dimensions = Wren().inputs.dimensions

const changeDimensions = house => newDimensions => {
  // console.log(newDimensions)
  dimensions = merge(dimensions, newDimensions)
  wren = Wren({dimensions})
  house.update(wren.outputs.pieces)
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

    const house = House(wren.outputs.pieces)
    scene.add(ground(10,10))
    scene.add(house.output)

    const hud = HUD(wren.inputs.dimensions, changeDimensions(house))

    requestAnimationFrame(render)
  },
  function(xhr) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  function(xhr) {
    console.error('An error occurred');
  }
)

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
