const math = require('mathjs')

// const innerWall = (s, params) => {
//   return [
//     [0,0],
//     [params.bayLength*100,0],
//     [params.bayLength*100, s.inner[2][1]-s.inner[1][1]],
//     [0, s.inner[2][1]-s.inner[1][1]],
//   ]
// }

// const roofComponent = (s, params, [from,to]) => {
//   const points = [
//     [0,0],
//     [params.bayLength*100,0],
//     [params.bayLength*100, s.outer[from][1]-s.outer[to][1]],
//     [0, s.outer[from][1]-s.outer[to][1]],
//   ]
//   const position = {y: params.height-s.outer[0][1]/100}
//   const rotation = {}
//   return [points, position, rotation]
// }

export const floorComponent = (s, params, arr, [from,to], position={}, rotation={}) => {
  const floorLength = Math.min(arr[from][0]-arr[to][0], params.sheetLength*100)
  const points = [
    [0,0],
    [params.bayLength*100,0],
    [params.bayLength*100, floorLength],
    [0, floorLength],
  ]
  return [points, position, rotation]
}

export const bayComponent = (s, params, arr, [from,to], position={}, rotation={}) => {
  const points = [
    [0,0],
    [params.bayLength*100,0],
    [params.bayLength*100, Math.abs(arr[from][1]-arr[to][1])],
    [0, Math.abs(arr[from][1]-arr[to][1])],
  ]
  return [points, position, rotation]
}

export const roofComponent = (s, params, arr, [from,to], position={}, rotation={}) => {
  const roofLength = Math.min(math.distance(arr[from], arr[to]), params.sheetLength*100)

  const roofAngle = Math.atan2(params.width/2, (params.height-params.wallHeight))

  const points = [
    [0,0],
    [params.bayLength*100,0],
    [params.bayLength*100,roofLength],
    [0,roofLength]
  ]
  return [points, position, { z: Math.PI/2, x: -Math.PI/2, y: roofAngle-Math.PI/2 }]
}
