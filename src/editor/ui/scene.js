const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const container = document.getElementById('app')

const stats = new Stats()
stats.showPanel(0)
container.appendChild(stats.dom)

const rendererStats = new THREEx.RendererStats()
rendererStats.domElement.style.position = 'absolute'
rendererStats.domElement.style.left = '0px'
rendererStats.domElement.style.bottom = '0px'
container.appendChild(rendererStats.domElement)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0xEEEEEE, 1)
renderer.setSize(WIDTH, HEIGHT)

container.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 20000)
camera.position.y = 10
camera.position.z = 10
camera.position.x = 6
camera.lookAt(new THREE.Vector3(0,0,0))

const updateClippingPlane = (height) => {
  const clippingPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,height,0));
  renderer.clippingPlanes = [ clippingPlane ];
}

module.exports = { container, stats, rendererStats, renderer, scene, camera, updateClippingPlane }
