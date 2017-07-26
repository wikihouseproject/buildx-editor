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

// const roofComponent = (s, params, arr, [from,to], position={}, rotation={}) => {
//   const roofLength = Math.min(math.distance(arr[from], arr[to]), params.sheetLength)
//   const roofAngle = Math.atan2(params.width/2, (params.height-params.wallHeight))
//   const points = [
//     [0,0],
//     [params.bayLength,0],
//     [params.bayLength,roofLength],
//     [0,roofLength]
//   ]
//   const newPosition = {
//     x: position.x||0,
//     y: position.y||0,
//     z: position.z||0
//   }
//   const newRotation = {
//     x: (rotation.x||0)-roofAngle,
//     y: rotation.y||0,
//     z: rotation.z||0,
//     order: 'ZYX'
//   }
//   return [[points, newPosition, newRotation]]
// }

const roofComponent = (s, params, arr, [from,to], position={}, rotation={}) => {
  const roofTotalLength = math.distance(arr[from], arr[to])
  const roofAngle = Math.atan2(params.width/2, (params.height-params.wallHeight))
  const times = Math.ceil(roofTotalLength/params.sheetLength)

  const roofLength = Math.min(roofTotalLength, params.sheetLength)

  let all = []
  // i < times
  for (let i = 0; i < times; i++) {
    const points = [
      [0,0],
      [params.bayLength,0],
      [params.bayLength,roofLength],
      [0,roofLength]
    ]
    const newPosition = {
      x: (position.x||0) + i*roofLength,
      y: (position.y||0),
      z: (position.z||0)
    }
    const newRotation = {
      x: (rotation.x||0)-roofAngle,
      y: rotation.y||0,
      z: rotation.z||0,
      order: 'ZYX'
    }
    all.push([points, newPosition, newRotation])
  }

  return all
}

module.exports = {
  bayComponent,
  floorComponent,
  roofComponent
}
