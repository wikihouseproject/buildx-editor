const {compose} = require('ramda')
const SVG = require('./patterns/svg')
const List = require('./patterns/list')
const Clipper = require('./patterns/clipper')
const Points = require('./patterns/points')

const element = NAME => (ATTRS, CHILDREN=[]) => [NAME, ATTRS, CHILDREN]
const svg = element('svg')
const path = element('path')
const circle = element('circle')
const g = element('g')
//
const makeSVG = ({ELEMENTS, VIEWBOX}) => SVG.parse(svg({ xmlns: "http://www.w3.org/2000/svg", viewBox: VIEWBOX}, ELEMENTS))
const render = ({CONTAINER, SVG}) => document.getElementById(CONTAINER).innerHTML = SVG
//
const viewBoxFromPoints = compose(SVG.getViewBox, SVG.getBounds)
//
const point = p => circle({cx: p[0], cy: p[1], r: 1})
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

export default function S({width, height, wallHeight, frameWidth}) {
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

  // const bounds = compose(SVG.getBounds, firstPoints(outerCorners, innerCorners, fifthPoints))(0)
  // console.log(SVG.closedPath(firstPoints(outerCorners, innerCorners, fifthPoints)(4).map( ([x,y]) => [ (x-bounds.minX)/100, (y-bounds.minY)/100])))

  // const bounds2 = compose(SVG.getBounds, firstPoints(outerCorners, innerCorners, fifthPoints))(0)
  // console.log(SVG.closedPath(firstPoints(outerCorners, innerCorners, fifthPoints)(3).map( ([x,y]) => [ (x-bounds.minX)/100, (y-bounds.minY)/100])))

  return {
    viewBox: viewBoxFromPoints(outerCorners),
    firstPath,
    points: firstPoints(outerCorners, innerCorners, fifthPoints),
    bounds: compose(SVG.getBounds, firstPoints(outerCorners, innerCorners, fifthPoints)),
    close: SVG.closedPath
  }
}
