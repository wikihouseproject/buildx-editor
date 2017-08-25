const SIZE = () => ({
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight
})
const resizeRenderer = () => renderer.setSize(SIZE().WIDTH, SIZE().HEIGHT)

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
resizeRenderer()

container.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, SIZE().WIDTH/SIZE().HEIGHT, 0.1*1000, 20000*1000)
camera.position.y = 10*1000
camera.position.z = -10*1000
camera.position.x = 60*1000
camera.lookAt(new THREE.Vector3(0,0,0))

window.addEventListener('resize', onWindowResize, false)
function onWindowResize(){
  camera.aspect = SIZE().WIDTH/SIZE().HEIGHT;
  camera.updateProjectionMatrix();
  resizeRenderer()
}

const updateClippingPlane = (height) => {
  const clippingPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,height,0));
  renderer.clippingPlanes = [ clippingPlane ];
}

module.exports = { container, stats, rendererStats, renderer, scene, camera, updateClippingPlane }
