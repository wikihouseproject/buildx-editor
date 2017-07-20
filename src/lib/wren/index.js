const {compose} = require('ramda')
export const SVG = require('./svg')
export const CSV = require('./csv')
const List = require('./patterns/list')
const Clipper = require('./patterns/clipper')
const Points = require('./patterns/points')

// Return bounding rectangle for a set of 2d points
const getBounds = (coords) => {
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

// Pad a bounding box
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
const GAP = 15 // distance to propagate points by when dedicing grip positions. Half of grip+nongrip (300mm)
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

// NOTE: Right now only for 5-sided fin shape, with equal wall heights and symmetrical roof
export function finShape(params) {
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

  return {
    center: corners,
    inner: innerCorners,
    outer: outerCorners,
  };
}

const movePointOnAngle = ([x,y], angle, delta) =>
  [x + (Math.sin(angle) * delta), y - (Math.cos(angle) * delta)]

// Takes into considerations
// TODO: take into consideratin maximum piece size
export function splitFinPieces(finPolygon, params) {
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
    groupedPoints.push(getPoints(corners[i], firstHalfPoints({POINTS: corners})[i], secondHalfPoints({POINTS: corners})[i]))
  }

  // Find points to cut at, by projecting outwards from corners
  let fifthPoints = []
  groupedPoints.map(group => {
    const angle = Points.angle(group[0], group[1])
    group.map( (point, index) => {
      if (index === 5) {
        const [x,y] = point
        fifthPoints.push([movePointOnAngle(point, angle, frameWidth/2), movePointOnAngle(point, angle, -(frameWidth/2))])
      }
    })
  })

  // Find the points belonging to the cut pieces
  const outPoints = firstPoints(outerCorners, innerCorners, fifthPoints);

  return {
    viewBox: viewBoxFromPoints(outerCorners),
    points: outPoints,
    bounds: compose(getBounds, outPoints),
  }
}

function times(n, iterator) {
  var accum = Array(Math.max(0, n));
  for (var i = 0; i < n; i++) accum[i] = iterator.call();
  return accum;
}

// Main entrypoint, generates all geometry of the chassis
export function chassis(params) {

  const makeFrame = () => {
    const s = finShape(params);
    return splitFinPieces(s, params);
  };

  return {
    frames: times(params.totalBays, makeFrame),
    parameters: params,
  }
}


// key metrics
//
// frame sizes
//
// volume (or area)
// frame
// connectors
// sheeting
// end walls
//
// divide by plywood sheet area
// nesting efficiency. 75%
// cost of plywood

// existing est, plywood
// per m2, 4 - 8


// 1300 GBP per m2 budget, incl labor
// possibly as low as 1000
// 15% chassis, 85% external

// cutting time
// cutting price
// 25 per sheet material
// 25 per sheet usage

// external surface areas
//
// roofArea
// wallArea
// guttering
// foundation

// Export as .CSV / .json

// All measurements in meters.
// Distances generally center-center
export function getParameters() {

  // parameter declaration
  const keys = ['id', 'name', 'type', 'default', 'description'];
  const definitions = [
    // Commonly configured
    ['totalBays', "Bays #", 'number', 6, "Number of frames"],
    ['height', "Height", 'distance', 3.0, "Height to top of frame"],
    ['width', "Width", 'distance', 1.2, "Width of frame"],
    ['wallHeight', "Wall height", 'distance', 2.5, "Height of wall, where roof starts"],

    // internal
    ['bayLength', "Bay length", 'distance', 1.2, "Distance between each of the frames"],
    ['frameWidth', "Frame width", 'distance', 0.264, "Width of frame body"],
    ['frameDepth', "Frame depth", 'distance', 0.150, "Depth of spacer+fins+reinforcers"],
    // sheet
    ['materialThickness', "Material thickness", 'distance', 18.0/1000, "Nominal thickness of plywood sheet"],
    ['sheetWidth', "Sheet width", 'distance', 1.2, "Width of plywood sheet"],
    ['sheetLength', "Sheet height", 'distance', 2.4, "Length of plywood sheet"],
    //['tolerance', "Fit tolerance", 'distance', 0.5/1000, "Tolerance for fitting parts"],
  ]
  // sanity check
  definitions.map((d) => {
    if (d.length != keys.length) {
      throw new Error('Invalid parameter definition for' + d[0]);
    }
  });

  // conveniences
  var keyIndex = {};
  for (var i=0; i<keys.length; i++) {
    const name = keys[i];
    keyIndex[name] = i;
  }
  var defaults = {};
  for (var i=0; i<definitions.length; i++) {
      const param = definitions[i];
      const id = param[keyIndex['id']];
      const d = param[keyIndex['default']];
      defaults[id] = d;
  }

  return {
    definitions,
    keys,
    defaults,
  }
}

export const parameters = getParameters();

export function geometrics(parameters) {

  const i = parameters;

  const length = i.totalBays * i.bayLength;
  const outerLength = length + i.bayLength; // 2x half a bay
  const outerWidth = i.width + i.frameWidth; // 2x half a frame

  const innerWidth = i.width - i.frameWidth;
  const innerLength = i.length - i.bayLength;

  const floorArea = innerWidth * innerHeight;

  // TODO: get wall and roofs from frame polygon
  const sideWallArea = 10;
  const endWallArea = 10;

  const outputs = {
      'footprintArea': outerLength * outerWidth,
      'floorArea': floorArea,
      'roofArea': 100, // outer
      //'wallAreaOuter': sideWallArea*2 + endWallArea*2, // outer
  }

  // check post-conditions
  const invalids = Object.keys(outputs).filter((key) => {
    const val = outputs[key];
    const valid = val >= 0 && !isNaN(val);
    return !valid;
  });
  if (invalids.length) {
    throw new Error("wren.geometrics() outputted invalid values: " + JSON.stringify(invalids));
  }

  return outputs;
}

export function estimateCosts(metrics) {
    // for pilots it ranged between 4-8 GBP per sqm.
    // multiple stories -> cheaper
    // thicker frame -> expensive
    // taller -> expensive
    const baseCostPerSqm = 8;
    const chassisCosts = baseCostPerSqm * metrics.footprintArea;
    return chassisCosts;
}
