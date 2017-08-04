import { outline, frame, clone, connector, outerWall, roof, floor, ball, segment } from "./components"
import { scene } from "./scene"
import { removeDescendants } from "../lib/utils"

import BasicWren from "../lib/wren/basic_wren"

const sourceBall = ball()

const renderObj = obj => Object.keys(obj).map( key => `<tr><td>${key}</td><td>${obj[key].toFixed(2)}</td></tr>`).join("\n")

const metricsTable = document.getElementById('metrics')
// const costsTable = document.getElementById('costs')

const thing = (obj, config, color='#E9E6C5') => {
  const x = segment(obj[0], config, config.plyThickness, color)
  const mesh = clone(x, obj[1], obj[2])
  const geom = new THREE.EdgesGeometry(mesh.geometry);
  const lines = new THREE.LineSegments(geom, new THREE.LineBasicMaterial( { color: 0xa09e88 }));
  mesh.add(lines)
  return mesh
}

const House = (wren, w) => {

  const house = new THREE.Object3D()
  const components = new THREE.Object3D()
  house.add(components)

  let balls = [
    clone(sourceBall, {y: wren.config.height, z: wren.config.frameDepth/2}, {}, {boundVariable: 'height', bindFn: (x => x), dragAxis: 'y'}),
    // clone(sourceBall, {y: wren.config.wallHeight/2, z: (wren.config.bayLength * wren.config.totalBays)/2 }, {}, {dragAxis: 'z' }),
    clone(sourceBall, {y: wren.config.wallHeight/2, x: wren.config.width/2}, {}, {boundVariable: 'width', bindFn: (x => x*2), dragAxis: 'x'}),
    clone(sourceBall, {y: wren.config.wallHeight/2, x: -wren.config.width/2}, {}, {boundVariable: 'width', bindFn: (x => -x*2), dragAxis: 'x'})
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
    balls[0].position.y = wren.config.height
    balls[0].position.z = wren.config.frameDepth/2

    balls[1].position.y = wren.config.wallHeight/2
    balls[1].position.x = wren.config.width/2

    balls[2].position.y = wren.config.wallHeight/2
    balls[2].position.x = -wren.config.width/2
    // balls.forEach(ball => house.add(ball))
  }

  const redrawHouse = (wren, w) => {

    const { config } = wren

    const sourceConnector = connector(config)
    const sourceFrame = frame(wren.framePoints, config)
    const sourceOuterWall = outerWall(config)
    const sourceRoof = roof(config)
    const sourceFloor = floor(config)

    metricsTable.innerHTML = renderObj(w.geometrics(config))

    let bays = []
    for (var i = 0; i <= config.totalBays; i++) {
      const bay = new THREE.Object3D();
      bay.position.z = i*config.bayLength - wren.totalLength/2

      // const frame = clone(sourceFrame, {})
      // bay.add(frame)
      for (let seg = 0; seg < 5; seg++) {
        const s = segment(w.chassis(config).frames[0].points(seg), config, config.frameDepth, '#E9E6C5')
        bay.add(clone(s, {x: -config.width/2, y: config.height-w.chassis(config).frames[0].points(0)[0][1]/100, z: config.frameDepth/2 }, { x: Math.PI }))
        // const s = thing(w.chassis(config).frames[0][0].points(seg), config)
        // bay.add(s)
      }

      // scene.add(new THREE.SectionHelper(frame, 0x444444))

      // only add a frame to the first bay
      if (i > 0) {

        const rOW = thing(w.chassis(config).bays[0].leftOuterWall, config)
        bay.add(rOW)
        bay.add(thing(w.chassis(config).bays[0].leftInnerWall, config))
        bay.add(thing(w.chassis(config).bays[0].rightOuterWall, config))

        bay.add(thing(w.chassis(config).bays[0].rightInnerWall, config))

        bay.add(thing(w.chassis(config).bays[0].floor, config))

        bay.add(thing(w.chassis(config).bays[0].leftOuterRoof, config))
        bay.add(thing(w.chassis(config).bays[0].leftInnerRoof, config))

        bay.add(thing(w.chassis(config).bays[0].rightOuterRoof, config))
        bay.add(thing(w.chassis(config).bays[0].rightInnerRoof, config))

        // bay.add(thing(w.chassis(config).bays[0].rightOuterRoof, config))

        // roof connector
        bay.add(clone(sourceConnector, {y: config.height - config.connectorHeight}, {y: Math.PI/2}))

        // wall connectors
        // bay.add(clone(sourceConnector, {y: config.wallHeight - config.connectorHeight, x: config.width/2}, {y: Math.PI/2, x: -Math.PI/2, order: 'ZYX'}))
        // bay.add(clone(sourceConnector, {y: config.wallHeight - config.connectorHeight, x: -config.width/2}, {y: Math.PI/2, x: Math.PI/2, order: 'ZYX'}))

        // floor connectors
        // for (let j = 0; j <= 5; j++) {
        //   const x = config.width/5*j - config.width/2
        //   const conn = clone(sourceConnector, {x}, {y: Math.PI/2})
        //   bay.add(conn)
        // }

        // // floors
        // bay.add(clone(sourceFloor, {y: config.connectorHeight, x: config.width/2}, {z: Math.PI/2, x: -Math.PI/2}))

        // // roof
        // const leftRoof = clone(sourceRoof, {y: config.height}, {z: Math.PI/2, x: -Math.PI/2, y: wren.roofAngle-Math.PI/2})
        // bay.add(leftRoof)

        // // const rightRoof = clone(sourceRoof, {y: config.height + config.plyThickness }, {z: -Math.PI/2, x: Math.PI/2, y: wren.roofAngle-Math.PI/2})
        // // bay.add(rightRoof)
        // const r = w.chassis(config).bays[0].rightOuterRoof
        // const rightOuterRoof = segment(r[0], config, config.plyThickness, 'red')
        // bay.add(clone(rightOuterRoof, r[1], {y: Math.PI/2}))

        // scene.add(new THREE.SectionHelper(leftRoof, 0x444444))
        // scene.add(new THREE.SectionHelper(rightRoof, 0x444444))

        // ceiling
        // bay.add(clone(sourceRoof, {y: config.height-config.connectorHeight}, {z: Math.PI/2, x: -Math.PI/2}))
        // bay.add(clone(sourceRoof, {y: config.height-config.connectorHeight}, {z: -Math.PI/2, x: Math.PI/2}))

        // outer walls
        // bay.add(clone(sourceOuterWall, {x: config.width/2, z: -config.bayLength/2}, {y: Math.PI/2}))
        // bay.add(clone(sourceOuterWall, {x: -config.width/2 - config.plyThickness, z: -config.bayLength/2}, {y: Math.PI/2}))
      }
      bays.push(bay)
    }
    return bays
  }

  const redraw = newConfig => {
    const conf = Object.assign({}, wren.config, newConfig)

    wren = BasicWren(conf)
    removeDescendants(components)

    const bays = redrawHouse(wren, w)

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