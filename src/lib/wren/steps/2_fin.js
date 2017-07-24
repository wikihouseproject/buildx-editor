/*

  Now that we have a set of points, we can begin to calculate the fin.

*/

const { compose } = require('ramda')
const { firstHalfPoints, secondHalfPoints, getPoints, firstPoints } = require('./points')
const List = require('../patterns/list')
const Clipper = require('../patterns/clipper')
const Points = require('../patterns/points')

// Returns object with named sides, and the indices of points
function finSides() {
  // NOTE: we could calculate these, just pairwise points in order
  return {
    'rightRoof': [0, 1],
    'rightWall': [1, 2],
    'underside': [2, 3],
    'leftWall': [3, 4],
    'leftRoof': [4 ,0],
  };
}

// NOTE: Right now only for 5-sided fin shape, with equal wall heights and symmetrical roof
function finShape(params) {
  var {width, height, wallHeight, frameWidth} = params;

  // Code below uses centimeters
  width *= 100;
  height *= 100;
  wallHeight *= 100;
  frameWidth *= 100;

  // const corners = [[150,50],[250,150],[250,250],[50,250],[50,150]]
  const corners = [
    [width / 2, 0],                 // top center
    [width, height - wallHeight],   // top right
    [width, height],                // bottom right
    [0, height],                    // bottom left
    [0, height - wallHeight]        // top left
  ]

  const outerCorners = Clipper.offset(corners, { DELTA: frameWidth/2 })
  const innerCorners = Clipper.offset(corners, { DELTA: -(frameWidth/2) })

  const clipperPointsToNormal = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 0 };

  return {
    center: corners,
    inner: List.remapArray(innerCorners, clipperPointsToNormal),
    outer: List.remapArray(outerCorners, clipperPointsToNormal),
    sides: finSides()
  };
}

// Takes into considerations
// TODO: take into consideratin maximum piece size
function splitFinPieces(finPolygon, params) {
  const fiveSided = (5 == finPolygon.center.length) && (5 == finPolygon.outer.length) && (5 == finPolygon.inner.length);
  if (!fiveSided) {
    throw new Error("piece splitter can only handle five-sided polygons");
  }

  const frameWidth = params.frameWidth*100;
  const corners = finPolygon.center;
  const innerCorners = finPolygon.inner;
  const outerCorners = finPolygon.outer;

  // Group points by which side they belong to
  let groupedPoints = []
  for (var i = 0; i < corners.length; i++) {
    groupedPoints.push(
      getPoints(
        corners[i],
        firstHalfPoints(params.pointDistanceCM, {POINTS: corners})[i],
        secondHalfPoints(params.pointDistanceCM, {POINTS: corners})[i],
        params.pointDistanceCM
      )
    )
  }

  // Find points to cut at, by projecting outwards from corners
  let fifthPoints = []
  groupedPoints.map(group => {
    const angle = Points.angle(group[0], group[1])
    group.map( (point, index) => {
      if (index === 5) {
        const [x,y] = point
        fifthPoints.push([
          Points.movePointOnAngle(point, angle, frameWidth/2), // outer
          Points.movePointOnAngle(point, angle, -(frameWidth/2)) // inner
        ])
      }
    })
  })

  // Find the points belonging to the cut pieces
  const outPoints = firstPoints(outerCorners, innerCorners, fifthPoints);

  return {
    viewBox: Points.viewBoxFromPoints(outerCorners),
    points: outPoints,
    bounds: compose(Points.getBounds, outPoints),
  }
}


module.exports = {
  finShape,
  splitFinPieces
}
