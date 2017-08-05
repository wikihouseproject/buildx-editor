/**
 * Returns a side shape (wall, floor or roof), using top left as 0,0
 * @param {Number} height
 * @param {Number} width
 * @return {Array} side
 */

// s = finShape(params)
// roofComponent(s, params, s.inner, s.sides.rightRoof, {y: params.height - s.inner[0][1]/100 + params.frameWidth/2 }),
// const roofComponent = (params, arr, [from,to], position={}, rotation={}) => {
//   const roofLength = Math.min(math.distance(arr[from], arr[to]), params.sheetLength*100)
//   const roofAngle = Math.atan2(params.width/2, (params.height-params.wallHeight))
//   const rotation = { z: Math.PI/2, x: -Math.PI/2, y: roofAngle-Math.PI/2 }
//   const points = [
//     [0,roofLength],
//     [params.bayLength*100,roofLength],
//     [params.bayLength*100,0],
//     [0,0]
//   ]
//   return [points, position, rotation]
// }


const side = ({height, width}) => {
  const pos = { x: 0, y: 0, z: 0 }
  const rot = { x: 0, y: 0, z: 0 }
  const pts = [
    [0, height],
    [width, height],
    [width, 0],
    [0, 0]
  ]
  return {pts, pos, rot}
}

module.exports = side
