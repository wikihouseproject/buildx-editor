const math = require('mathjs')

const floorComponent = (s, params, arr, [from,to], position={}, rotation={}) => {
  const floorLength = Math.min(arr[from][0]-arr[to][0], params.sheetLength)
  const points = [
    [0,0],
    [params.bayLength,0],
    [params.bayLength, floorLength],
    [0, floorLength],
  ]
  return [[points, position, rotation]]
}

const bayComponent = (s, params, arr, [from,to], position={}, rotation={}) => {
  const points = [
    [0,0],
    [params.bayLength,0],
    [params.bayLength, Math.abs(arr[from][1]-arr[to][1])],
    [0, Math.abs(arr[from][1]-arr[to][1])],
  ]
  return [[points, position, rotation]]
}

const roofComponent = (s, params, arr, [from,to], position={}, rotation={}) => {
  const roofTotalLength = math.distance(arr[from], arr[to])
  const roofAngle = Math.atan2(params.width/2, (params.height-params.wallHeight))
  const roofLength = Math.min(roofTotalLength, params.sheetLength)

  const times = Math.ceil(roofTotalLength/params.sheetLength)

  let all = []

  let normalPosition = {
    x: (position.x||0),
    y: (position.y||0),
    z: (position.z||0)
  }

  for (let i = 0; i < times; i++) {
    const points = [
      [0,0],
      [params.bayLength,0],
      [params.bayLength,roofLength],
      [0,roofLength]
    ]
    const newRotation = {
      x: (rotation.x||0)-roofAngle,
      y: rotation.y||0,
      z: rotation.z||0,
      order: 'ZYX'
    }

    const startPosition = new THREE.Vector3(...Object.values(normalPosition))

    const direction = new THREE.Vector3({
      x: newRotation.x,
      y: newRotation.y,
      z: newRotation.z
    })
    console.log(direction)
    let newPos = new THREE.Vector3()
    newPos.addVectors(startPosition, direction.multiplyScalar(params.sheetLength*(i+1)) );


    // all.push([points, {x,y,z}, newRotation])
    all.push([points, newPos, newRotation])
  }

  return all
}

module.exports = {
  bayComponent,
  floorComponent,
  roofComponent
}
