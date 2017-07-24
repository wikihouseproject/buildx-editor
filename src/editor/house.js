import { outline, frame, clone, connector, outerWall, roof, floor, ball, segment, outlinedComponent } from "./components"
import { scene } from "./scene"
import { removeDescendants } from "./utils"

const renderObj = obj =>
  Object.keys(obj).map(key =>
    `<tr><td>${key}</td><td>${obj[key].toFixed(2)}</td></tr>`).join("\n")

const metricsTable = document.getElementById('metrics')
// const costsTable = document.getElementById('costs')

const House = w => {

  const parameters = w.parameters.defaults

  const house = new THREE.Object3D()
  const components = new THREE.Object3D()

  house.add(components)

  const sourceBall = ball()

  let balls = [
    clone(sourceBall, {y: parameters.height, z: parameters.frameDepth/2}, {}, {boundVariable: 'height', bindFn: (x => x), dragAxis: 'y'}),
    // clone(sourceBall, {y: parameters.wallHeight/2, z: (parameters.bayLength * parameters.totalBays)/2 }, {}, {dragAxis: 'z' }),
    clone(sourceBall, {y: parameters.wallHeight/2, x: parameters.width/2}, {}, {boundVariable: 'width', bindFn: (x => x*2), dragAxis: 'x'}),
    clone(sourceBall, {y: parameters.wallHeight/2, x: -parameters.width/2}, {}, {boundVariable: 'width', bindFn: (x => -x*2), dragAxis: 'x'})
  ]
  house.add(...balls)
  let outlineMesh = undefined

  const addOutlineMesh = () => {
    outlineMesh = outline(wren.framePoints, wren.totalLength)
    outlineMesh.position.z = -wren.totalLength/2-0.04
    outlineMesh.position.y = -0.03
    outlineMesh.scale.multiplyScalar(1.03)
    outlineMesh.material.visible = false
    house.add(outlineMesh)
  }
  addOutlineMesh()

  const updateBalls = () => {
    balls[0].position.y = parameters.height
    balls[0].position.z = parameters.frameDepth/2

    balls[1].position.y = parameters.wallHeight/2
    balls[1].position.x = parameters.width/2

    balls[2].position.y = parameters.wallHeight/2
    balls[2].position.x = -parameters.width/2
    // balls.forEach(ball => house.add(ball))
  }

  const redrawHouse = w => {

    const parameters = w.parameters.defaults

    const sourceConnector = connector(parameters)
    const sourceFrame = frame(wren.framePoints, parameters)
    const sourceOuterWall = outerWall(parameters)
    const sourceRoof = roof(parameters)
    const sourceFloor = floor(parameters)

    metricsTable.innerHTML = renderObj(w.geometrics(parameters))

    let bays = []

    for (var i = 0; i <= parameters.totalBays; i++) {
      const bay = new THREE.Object3D();
      bay.position.z = i*parameters.bayLength - wren.totalLength/2

      // const frame = clone(sourceFrame, {})
      // bay.add(frame)
      for (let seg = 0; seg < 5; seg++) {
        const s = segment(w.chassis(parameters).frames[0].points(seg), parameters, parameters.frameDepth, '#E9E6C5')
        bay.add(clone(s, {x: -parameters.width/2, y: parameters.height-w.chassis(parameters).frames[0].points(0)[0][1]/100, z: parameters.frameDepth/2 }, { x: Math.PI }))
        // const s = outlinedComponent(w.chassis(parameters).frames[0][0].points(seg), parameters)
        // bay.add(s)
      }

      // only add a frame to the first bay
      if (i > 0) {
        // walls

        bay.add(outlinedComponent(w.chassis(parameters).bays[0].leftOuterWall, parameters))
        bay.add(outlinedComponent(w.chassis(parameters).bays[0].leftInnerWall, parameters))

        bay.add(outlinedComponent(w.chassis(parameters).bays[0].rightOuterWall, parameters))
        bay.add(outlinedComponent(w.chassis(parameters).bays[0].rightInnerWall, parameters))

        // floor

        bay.add(outlinedComponent(w.chassis(parameters).bays[0].floor, parameters))

        // roof

        bay.add(outlinedComponent(w.chassis(parameters).bays[0].leftOuterRoof, parameters))
        bay.add(outlinedComponent(w.chassis(parameters).bays[0].leftInnerRoof, parameters))

        bay.add(outlinedComponent(w.chassis(parameters).bays[0].rightOuterRoof, parameters))
        bay.add(outlinedComponent(w.chassis(parameters).bays[0].rightInnerRoof, parameters))

      }
      bays.push(bay)
    }
    return bays
  }

  const redraw = newparameters => {
    const conf = Object.assign({}, parameters, newparameters)

    // wren = BasicWren(conf)

    w = wren.chassis(conf)

    removeDescendants(components)

    const bays = redrawHouse(w)

    bays.forEach(bay => components.add(bay))
    // house.children.forEach(child => {
    //   child.children.forEach(c => {
    //     // c.geometry.translate( child.position.x, child.position.y, child.position.z );
    //     c.updateMatrix()
    //     outlineGeometry.merge(c.geometry, c.matrix)
    //   })
    // })
    addOutlineMesh()
    updateBalls()
  }

  return {
    house,
    outlineMesh,
    balls,
    redraw,
    redrawHouse,
    outline
  }
}

module.exports = House
