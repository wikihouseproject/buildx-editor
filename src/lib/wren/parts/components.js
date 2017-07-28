const math = require('mathjs')

const pieces = (_totalLength, maxPieceLength) => {
  let length = _totalLength
  let lengths = []
  while(length > 0) {
    if (length > maxPieceLength) {
      lengths.push(maxPieceLength)
    } else {
      lengths.push(length)
    }
    length -= maxPieceLength
  }
  return lengths
}

const floorComponent = (s, params, arr, [from,to], _position={}, rotation={}) => {
  const floorTotalLength = arr[from][0]-arr[to][0]
  const floorLengths = pieces(floorTotalLength, params.sheetLength)

  let all = []
  for (let i = 0; i < floorLengths.length; i++) {
    const floorLength = floorLengths[i]

    const points = [
      [0,0],
      [params.bayLength,0],
      [params.bayLength, floorLength],
      [0, floorLength],
    ]
    const position = {
      x: _position.x - (params.sheetLength*i),
      y: _position.y,
      z: _position.z
    }
    all.push([points, position, rotation])
  }
  return all
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

const roofComponent = (s, params, arr, [from,to], _position={}, _rotation={}) => {
  let roofTotalLength = math.distance(arr[from], arr[to])
  const roofAngle = Math.atan2(params.width/2, (params.height-params.wallHeight))
  // const roofLength = Math.min(roofTotalLength, params.sheetLength)
  // const times = Math.ceil(roofTotalLength/params.sheetLength)
  let all = []

  const startPosition = new THREE.Vector3(
    (_position.x||0),
    (_position.y||0),
    (_position.z||0)
  )

  const rotation = {
    x: (_rotation.x||0)-roofAngle,
    y: _rotation.y||0,
    z: _rotation.z||0,
    order: 'ZYX'
  }

  const euler = new THREE.Euler( rotation.x, rotation.y, rotation.z, 'ZYX' )
  const direction = startPosition.clone().applyEuler(euler).normalize()

  let roofLengths = pieces(roofTotalLength, params.sheetLength)

  for (let i = 0; i < roofLengths.length; i++) {
    const roofLength = roofLengths[i]
    const points = [
      [0,0],
      [params.bayLength,0],
      [params.bayLength,roofLength],
      [0,roofLength]
    ]

    direction.z = 0 // position.z

    let newPos = startPosition.clone().add(
      new THREE.Vector3(0,params.sheetLength*i,0).applyEuler(euler)
    )
    // newPos.addVectors(
    //   startPosition,
    //   direction.clone().multiplyScalar(2.4*i)
    // )

    all.push([points, newPos, rotation])
  }

  return all
}

module.exports = {
  bayComponent,
  floorComponent,
  roofComponent
}
