import {h} from '@cycle/dom'

const frame = (width,height,z) => h('a-box', {
  attrs: {
    position: `0 ${height/2+0.1} ${-z}`,
    width: width,
    height: height,
    depth: 0.1,
    color: 'red'
  }
})

const frames = (width,height,amount) => {
  let arr = []
  for (let i = 0; i < amount; i++) {
    arr.push(frame(width,height,i))
  }
  return arr
}

const wall = (width,height,length) => h('a-box', {
  attrs: {
    position: {x: width/2, y: height/2, z: -length/2},
    width: 0.2,
    height: height,
    depth: 1,
    color: 'yellow'
  }
})

const walls = (width,height,length) => {
  return [
    wall(width,height,length),
    wall(-width,height,length)
  ]
}

const rail = (width,height,length) => h('a-box', {
  attrs: {
    // position: `${width/2} 0 ${-length/2}`,
    position: {x: width/2, y: 0, z: -length/2},
    width: 0.2,
    height: 0.2,
    depth: length,
    color: 'grey'
  }
})

const rails = (width,height,length) => {
  return [
    rail(width,height,length),
    rail(-width,height,length)
  ]
}

const connector = (width,wallHeight,height,length) => (position) => h('a-box', {
  attrs: {
    position,
    width: 0.1,
    height: 0.2,
    depth: 1,
    color: '#9CC003'
  }
})

const connectors = (width,wallHeight,height,length) => {
  const conn = connector(width,wallHeight,height,length)
  return [
    conn(`0 ${height} ${-length/2}`),
    conn(`${-width/2} ${wallHeight} ${-length/2}`),
    conn(`${width/2} ${wallHeight} ${-length/2}`),
    conn(`0 0.2 ${-length/2}`),
    conn(`0.3 0.2 ${-length/2}`),
    conn(`-0.3 0.2 ${-length/2}`)
  ]
}

const floor = (width,height,length) => h('a-box', {
  attrs: {
    position: `0 0.1 ${-length/2}`,
    width: width,
    height: 0.2,
    depth: 1,
    color: '#71B0CA'
  }
})

const bays = (width, wallHeight, height, length) => {
  let arr = []
  const lengthSegment = x => x+(0.1*x)
  const totalLength = lengthSegment(length)
  for (var i = 0; i < length; i++) {
    const bay = h('a-entity', {attrs: {position: {x: 0, y: 0, z: lengthSegment(i) - totalLength/2 }}}, [
      floor(width,height,length),
      // ...frames(width,height,length),
      ...connectors(width,wallHeight,height,length),
      ...walls(width,wallHeight,length)
    ])
    arr.push(bay)
  }
  return arr
}


module.exports = { frames, walls, rails, connectors, floor, bays }
