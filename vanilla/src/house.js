import { outline, frame, clone, connector, outerWall, roof, floor, ball } from "./components"
import { scene } from "./scene"
import { removeDescendants } from "../../src/lib/utils"

import BasicWren from "../../src/lib/wren/basic_wren"

// const outlineGeometry = new THREE.Geometry()
// const outlineMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide})

const sourceBall = ball()

const House = wren => {

  const house = new THREE.Object3D()

  let balls = []

  let outlineMesh = outline(wren.framePoints, wren.totalLength)
  outlineMesh.position.z = -wren.totalLength/2-0.04
  outlineMesh.position.y = -0.03
  outlineMesh.scale.multiplyScalar(1.03)
  house.add(outlineMesh)

  const addBalls = () => {
    balls = [
      clone(sourceBall, {y: wren.config.height, z: wren.config.frameDepth/2 }, {}, {boundVariable: 'height', bindFn: (x => x), dragAxis: 'y'}),
      // clone(sourceBall, {y: wren.config.wallHeight/2, z: (wren.config.bayLength * wren.config.totalBays)/2 },{}, {dragAxis: 'z' }),
      clone(sourceBall, {y: wren.config.wallHeight/2, x: wren.config.width/2 + wren.config.frameDepth}, {}, {boundVariable: 'width', bindFn: (x => x*2), dragAxis: 'x'}),
      clone(sourceBall, {y: wren.config.wallHeight/2, x: -wren.config.width/2}, {}, {boundVariable: 'width', bindFn: (x => -x*2), dragAxis: 'x'})
    ]
    balls.forEach(ball => house.add(ball))
  }

  const redrawHouse = wren => {

    const { config } = wren

    const sourceConnector = connector(config)
    const sourceFrame = frame(wren.framePoints, config)
    const sourceOuterWall = outerWall(config)
    const sourceRoof = roof(config)
    const sourceFloor = floor(config)

    let bays = []
    for (var i = 0; i <= config.totalBays; i++) {
      const bay = new THREE.Object3D();
      bay.position.z = i*config.bayLength - wren.totalLength/2
      const frame = clone(sourceFrame, {})
      bay.add(frame)
      scene.add(new THREE.SectionHelper(frame, 0x444444))

      // only add a frame to the first bay
      if (i > 0) {

        // roof connector
        bay.add(clone(sourceConnector, {y: config.height - config.connectorHeight}, {y: Math.PI/2}))

        // wall connectors
        bay.add(clone(sourceConnector, {y: config.wallHeight - config.connectorHeight, x: config.width/2}, {y: Math.PI/2, x: -Math.PI/2, order: 'ZYX'}))
        bay.add(clone(sourceConnector, {y: config.wallHeight - config.connectorHeight, x: -config.width/2}, {y: Math.PI/2, x: Math.PI/2, order: 'ZYX'}))

        // floor connectors
        for (let j = 0; j <= 5; j++) {
          const x = config.width/5*j - config.width/2
          const conn = clone(sourceConnector, {x}, {y: Math.PI/2})
          bay.add(conn)
        }

        // floors
        bay.add(clone(sourceFloor, {y: config.connectorHeight, x: config.width/2}, {z: Math.PI/2, x: -Math.PI/2}))

        // roof
        const leftRoof = clone(sourceRoof, {y: config.height}, {z: Math.PI/2, x: -Math.PI/2, y: wren.roofAngle-Math.PI/2})
        const rightRoof = clone(sourceRoof, {y: config.height + config.plyThickness }, {z: -Math.PI/2, x: Math.PI/2, y: wren.roofAngle-Math.PI/2})
        bay.add(leftRoof)
        bay.add(rightRoof)

        scene.add(new THREE.SectionHelper(leftRoof, 0x444444))
        scene.add(new THREE.SectionHelper(rightRoof, 0x444444))

        // ceiling
        // bay.add(clone(sourceRoof, {y: config.height-config.connectorHeight}, {z: Math.PI/2, x: -Math.PI/2}))
        // bay.add(clone(sourceRoof, {y: config.height-config.connectorHeight}, {z: -Math.PI/2, x: Math.PI/2}))

        // outer walls
        bay.add(clone(sourceOuterWall, {x: config.width/2, z: -config.bayLength/2}, {y: Math.PI/2}))
        bay.add(clone(sourceOuterWall, {x: -config.width/2 - config.plyThickness, z: -config.bayLength/2}, {y: Math.PI/2}))
      }
      bays.push(bay)
    }
    return bays
  }

  const redraw = newConfig => {
    wren = BasicWren(Object.assign({}, wren.config, newConfig))

    removeDescendants(house)
    const bays = redrawHouse(wren)
    // house.children = bays
    bays.forEach(bay => house.add(bay))
    // house.children.forEach(child => {
    //   child.children.forEach(c => {
    //     // c.geometry.translate( child.position.x, child.position.y, child.position.z );
    //     c.updateMatrix()
    //     outlineGeometry.merge(c.geometry, c.matrix)
    //   })
    // })

    // outlineMesh = outline(wren.framePoints, wren.totalLength)
    // outlineMesh.position.z = -wren.totalLength/2-0.04
    // outlineMesh.position.y = -0.03
    // outlineMesh.scale.multiplyScalar(1.03)
    // house.add(outlineMesh)
    addBalls()
  }

  addBalls()

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
