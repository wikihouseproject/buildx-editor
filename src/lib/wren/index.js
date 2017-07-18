const {compose} = require('ramda')
export const SVG = require('./svg')
const List = require('./patterns/list')
const Clipper = require('./patterns/clipper')
const Points = require('./patterns/points')

const getBounds = coords => {
  return coords.reduce( (bounds, coords) => {
    // const [x, y] = coords.split(",")
    const [x, y] = coords
    bounds.minX = Math.min(bounds.minX, x)
    bounds.minY = Math.min(bounds.minY, y)
    bounds.maxX = Math.max(bounds.maxX, x)
    bounds.maxY = Math.max(bounds.maxY, y)
    return bounds
  }, {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  })
}

const getViewBox = (bounds, padding=10) =>
  [
    bounds.minX-padding,
    bounds.minY-padding,
    bounds.maxX - bounds.minX+padding*2,
    bounds.maxY - bounds.minY+padding*2
  ].join(" ")

//
const viewBoxFromPoints = compose(getViewBox, getBounds)
//
const GAP = 10
//
const firstHalfPoints = ({POINTS, CIRCLE}, $) => {
  const _POINTS = List.wrapped(POINTS).map( ([startPoint, endPoint]) => {
    const distance = Points.length(startPoint, endPoint)
    let points = []
    for (let i = GAP; i < distance/2; i += GAP) {
      const [x,y] = Points.pointOnLine(i)(startPoint, endPoint)
      points.push([x+startPoint[0],y+startPoint[1]])
    }
    return points
  })
  return _POINTS
}
//
const secondHalfPoints = ({POINTS, CIRCLE}, $) => {
  const _POINTS = List.wrapped(POINTS).map( ([endPoint, startPoint]) => {
    const distance = Points.length(startPoint, endPoint)
    let points = []
    for (let i = GAP; i < distance/2; i += GAP) {
      const [x,y] = Points.pointOnLine(i)(startPoint, endPoint)
      points.push([x+startPoint[0],y+startPoint[1]])
    }
    return points.reverse()
  })
  return _POINTS
}
//
const getPoints = (corner, firstHalf, secondHalf) => {
  const ends = [firstHalf[firstHalf.length-1], secondHalf[0]]
  const distance = Points.length(...ends)
  if (distance < GAP*1.2) {
    firstHalf = firstHalf.slice(0, -1)
    secondHalf = secondHalf.slice(1)
  }
  return [corner, ...firstHalf, Points.percentageOnLine(0.5)(...ends), ...secondHalf]
}
//
const firstPoints = (outerCorners, innerCorners, fifthPoints) => i => {
  const wrapped = (index, array) => {
    if (index < 0) index = array.length-1;
    return array[index]
  }
  return [
    wrapped(i-1, outerCorners),
    wrapped(i, fifthPoints)[0],
    wrapped(i, fifthPoints)[1],
    wrapped(i-1, innerCorners),
    wrapped(i-1, fifthPoints)[1],
    wrapped(i-1, fifthPoints)[0]
  ]
}

export function frame({width, height, wallHeight, frameWidth}) {
  // const corners = [[150,50],[250,150],[250,250],[50,250],[50,150]]
  const corners = [
    [width / 2, 0],                 // top center
    [width, height - wallHeight],   // top right
    [width, height],                // bottom right
    [0, height],                    // bottom left
    [0, height - wallHeight]        // top left
  ]

  const outerCorners = Clipper.offset(corners, { DELTA: frameWidth })
  const innerCorners = Clipper.offset(corners, { DELTA: -frameWidth })

  let groupedPoints = []
  for (var i = 0; i < corners.length; i++) {
    groupedPoints.push(getPoints(corners[i], firstHalfPoints({POINTS: corners})[i], secondHalfPoints({POINTS: corners})[i]))
  }
  const allPoints = groupedPoints.reduce((accum, el) => accum.concat(el), [])
  const movePointOnAngle = ([x,y], angle, delta) => [x + (Math.sin(angle) * delta), y - (Math.cos(angle) * delta)]
  let fifthPoints = []
  groupedPoints.map(group => {
    const angle = Points.angle(group[0], group[1])
    group.map( (point, index) => {
      if (index === 5) {
        const [x,y] = point
        fifthPoints.push([movePointOnAngle(point, angle, 10), movePointOnAngle(point, angle, -10)])
      }
    })
  })

  const first = firstPoints(outerCorners, innerCorners, fifthPoints)
  const firstPath = compose(
    SVG.closedPath,
    firstPoints(outerCorners, innerCorners, fifthPoints)
  )

  // const bounds = compose(getBounds, firstPoints(outerCorners, innerCorners, fifthPoints))(0)
  // console.log(SVG.closedPath(firstPoints(outerCorners, innerCorners, fifthPoints)(4).map( ([x,y]) => [ (x-bounds.minX)/100, (y-bounds.minY)/100])))

  // const bounds2 = compose(getBounds, firstPoints(outerCorners, innerCorners, fifthPoints))(0)
  // console.log(SVG.closedPath(firstPoints(outerCorners, innerCorners, fifthPoints)(3).map( ([x,y]) => [ (x-bounds.minX)/100, (y-bounds.minY)/100])))

  return {
    viewBox: viewBoxFromPoints(outerCorners),
    firstPath,
    points: firstPoints(outerCorners, innerCorners, fifthPoints),
    bounds: compose(getBounds, firstPoints(outerCorners, innerCorners, fifthPoints)),
  }
}

export function floorArea(width, bayCount, config) {
    return width*(bayCount*config.BAY_LENGTH);
}

export function totalCosts(width, bayCount) {
    const frames = width*bayCount;
    const frameCost = 100; // XXX: bullshit number for now
    return frames*frameCost;
}
