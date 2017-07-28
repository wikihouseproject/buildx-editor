import { outline, frame, clone, connector, outerWall, roof, floor, ball, segment, outlinedComponent } from "./index"
import { scene } from "../ui/scene"
import dimensionLines from "../ui/dimension_lines"
import { removeDescendants } from "../utils"
import { compose } from "ramda"

const renderObj = obj =>
  Object.keys(obj).map(key =>
    `<tr><td>${key}</td><td>${obj[key].toFixed(2)}</td></tr>`).join("\n")

const metricsTable = document.getElementById('metrics')
// const costsTable = document.getElementById('costs')

const sourceBall = ball()

let balls = [
  clone(sourceBall, {}, {}, {boundVariable: 'height', bindFn: (x => x), dragAxis: 'y'}),
  clone(sourceBall, {}, {}, {boundVariable: 'width', bindFn: (x => x*2), dragAxis: 'x'}),
  clone(sourceBall, {}, {}, {boundVariable: 'width', bindFn: (x => -x*2), dragAxis: 'x'})
]

// scene.add(dimensionLines(3, 2))

const component = (chassis, parameters) => name => {
  const comps = chassis.bays[0][name]
  // if (comps[1]) {
  //   console.log('----')
  //   console.log(comps[0][1])
  //   console.log(comps[1][1])
  // }
  return comps.map(comp => outlinedComponent(comp, parameters, comp[1], comp[2]))
  // const comp = chassis.bays[0][name][0]
  // return outlinedComponent(comp, parameters, comp[1], comp[2])
}

const House = wren => {

  let parameters = wren.parameters.defaults

  const house = new THREE.Object3D()
  const components = new THREE.Object3D()
  house.add(components)
  house.add(...balls)

  let chassis = wren.chassis(parameters)

  const updateBalls = () => {
    const {height, frameDepth, wallHeight, width} = parameters
    balls[0].position.y = height
    balls[0].position.z = frameDepth/2

    balls[1].position.y = wallHeight/2
    balls[1].position.x = width/2

    balls[2].position.y = wallHeight/2
    balls[2].position.x = -width/2
  }
  updateBalls()

  const redrawHouse = () => {
    const sourceConnector = connector(parameters)
    const sourceOuterWall = outerWall(parameters)
    const sourceRoof = roof(parameters)
    const sourceFloor = floor(parameters)

    // const sourceFrame = fframe(parameters)
    // const sourceFrame = frame(wren.framePoints, parameters)

    metricsTable.innerHTML = renderObj(wren.geometrics(parameters))

    let bays = []

    const chassis = wren.chassis(parameters)

    const pieces = name => {
      let meshes = component(chassis, parameters)(name)

      // meshes.map(mesh => {
      //   const xArrow = new THREE.ArrowHelper( new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 3, 'red')
      //   mesh.add(xArrow)
      //   const yArrow = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 3, 'green')
      //   mesh.add(yArrow)
      //   const zArrow = new THREE.ArrowHelper( new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 3, 'blue')
      //   mesh.add(zArrow)
      // })

      // mesh.translateZ(2)

      // mesh.updateMatrixWorld();
      // var normalMatrix = new THREE.Matrix3().getNormalMatrix(  mesh.matrixWorld )
      // var newNoraml = normal.clone().applyMatrix3( normalMatrix ).normalize();
      // console.log(newNormal)
      // console.log(mesh.rotation)
      // v.x += (avgVertexNormals[count].x * v.velocity * control.scale) * dir;
      // v.y += (avgVertexNormals[count].y * v.velocity * control.scale) * dir;
      // v.z += (avgVertexNormals[count].z * v.velocity * control.scale) * dir;

      return meshes
    }

    for (var i = 0; i <= parameters.totalBays; i++) {

      const bay = new THREE.Object3D()
      bay.position.z = i*parameters.bayLength-(parameters.totalBays*parameters.bayLength)/2
      // only add a frame to the first bay
      if (i > 0) {
        bay.add(...pieces('leftInnerWall'))
        bay.add(...pieces('leftOuterWall'))
        bay.add(...pieces('rightInnerWall'))
        bay.add(...pieces('rightOuterWall'))
        bay.add(...pieces('floor'))
        // bay.add(...pieces('underboard'))

        bay.add(...pieces('leftOuterRoof'))
        bay.add(...pieces('leftInnerRoof'))
        bay.add(...pieces('rightOuterRoof'))
        bay.add(...pieces('rightInnerRoof'))
      }
      bays.push(bay)
    }
    return bays
  }

  const redraw = newparameters => {
    parameters = Object.assign({}, parameters, newparameters)

    // TODO: Make this operation less expensive
    chassis = wren.chassis(parameters)

    removeDescendants(components)

    const bays = redrawHouse()
    components.add(...bays)

    updateBalls()
  }

  return {
    house,
    redraw
  }
}

module.exports = House
