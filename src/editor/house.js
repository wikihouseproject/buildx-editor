import { outline, frame, clone, connector, outerWall, roof, floor, ball, segment, outlinedComponent } from "./components"
import { scene } from "./scene"
import { removeDescendants } from "./utils"
import { compose } from "ramda"

const renderObj = obj =>
  Object.keys(obj).map(key =>
    `<tr><td>${key}</td><td>${obj[key].toFixed(2)}</td></tr>`).join("\n")

const metricsTable = document.getElementById('metrics')
// const costsTable = document.getElementById('costs')

const sourceBall = ball()

let balls = [
  clone(sourceBall, {}, {}, {boundVariable: 'height', bindFn: (x => x), dragAxis: 'y'}),
  // clone(sourceBall, {y: parameters.wallHeight/2, z: (parameters.bayLength * parameters.totalBays)/2 }, {}, {dragAxis: 'z' }),
  clone(sourceBall, {}, {}, {boundVariable: 'width', bindFn: (x => x*2), dragAxis: 'x'}),
  clone(sourceBall, {}, {}, {boundVariable: 'width', bindFn: (x => -x*2), dragAxis: 'x'})
]

const component = (chassis, parameters) => name => {
  const comp = chassis.bays[0][name]
  return outlinedComponent(comp, parameters, comp[1], comp[2])
}

const House = wren => {

  let parameters = wren.parameters.defaults

  const house = new THREE.Object3D()
  const components = new THREE.Object3D()
  house.add(components)
  house.add(...balls)

  let chassis = wren.chassis(parameters)

  // let outlineMesh = undefined
  // const addOutlineMesh = () => {
  //   outlineMesh = outline(wren.framePoints, wren.totalLength)
  //   outlineMesh.position.z = -wren.totalLength/2-0.04
  //   outlineMesh.position.y = -0.03
  //   outlineMesh.scale.multiplyScalar(1.03)
  //   outlineMesh.material.visible = false
  //   house.add(outlineMesh)
  // }
  // addOutlineMesh()

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

    const piece = name => {
      const mesh = component(chassis, parameters)(name)

      // const xArrow = new THREE.ArrowHelper( new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 3, 'red')
      // mesh.add(xArrow)
      // const yArrow = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 3, 'green')
      // mesh.add(yArrow)
      // const zArrow = new THREE.ArrowHelper( new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 3, 'blue')
      // mesh.add(zArrow)

      // mesh.translateZ(2)

      // mesh.updateMatrixWorld();
      // var normalMatrix = new THREE.Matrix3().getNormalMatrix(  mesh.matrixWorld )
      // var newNoraml = normal.clone().applyMatrix3( normalMatrix ).normalize();
      // console.log(newNormal)
      // console.log(mesh.rotation)
      // v.x += (avgVertexNormals[count].x * v.velocity * control.scale) * dir;
      // v.y += (avgVertexNormals[count].y * v.velocity * control.scale) * dir;
      // v.z += (avgVertexNormals[count].z * v.velocity * control.scale) * dir;
      return mesh
    }

    for (var i = 0; i <= parameters.totalBays; i++) {

      const bay = new THREE.Object3D()

        // const boxg = new THREE.BoxGeometry(1,1,1)
        // const box = new THREE.Mesh(boxg, new THREE.MeshBasicMaterial({color: 'red', wireframe: true}))
        // bay.add(box)

      // bay.position.z = i*parameters.bayLength - wren.totalLength/2
      bay.position.z = i*parameters.bayLength-(parameters.totalBays*parameters.bayLength)/2

      // const frame = clone(sourceFrame, {})
      // bay.add(frame)
      for (let seg = 0; seg < 5; seg++) {
        // const s = segment(wren.chassis(parameters).frames[0].points(seg), parameters, parameters.frameDepth, '#E9E6C5')
        // bay.add(clone(s, {x: -parameters.width/2, y: parameters.height-wren.chassis(parameters).frames[0].points(0)[0][1], z: parameters.frameDepth/2 }, { x: Math.PI }))
        // const s = outlinedComponent(wren.chassis(parameters).frames[0][0].points(seg), parameters)
        // bay.add(s)
      }
      // only add a frame to the first bay
      if (i > 0) {
        bay.add(piece('leftInnerWall'))
        bay.add(piece('leftOuterWall'))
        bay.add(piece('rightInnerWall'))
        bay.add(piece('rightOuterWall'))
        bay.add(piece('floor'))
        bay.add(piece('underboard'))
        bay.add(piece('leftOuterRoof'))
        bay.add(piece('leftInnerRoof'))
        bay.add(piece('rightOuterRoof'))
        bay.add(piece('rightInnerRoof'))
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

    // bays.forEach(bay => components.add(bay))
    // // house.children.forEach(child => {
    // //   child.children.forEach(c => {
    // //     // c.geometry.translate( child.position.x, child.position.y, child.position.z );
    // //     c.updateMatrix()
    // //     outlineGeometry.merge(c.geometry, c.matrix)
    // //   })
    // // })
    // addOutlineMesh()
    updateBalls()
  }

  return {
    house,
    // outlineMesh,
    // balls,
    redraw,
    // redrawHouse,
    // outline
  }
}

module.exports = House
