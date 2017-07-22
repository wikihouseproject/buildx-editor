const {compose} = require('ramda')
const SVG = require('./outputs/svg')
const CSV = require('./outputs/csv')
const set = require('./utils/set');
const List = require('./patterns/list')
const Clipper = require('./patterns/clipper')
const Points = require('./patterns/points')
const Utils = require('../utils')

const { bayComponent, floorComponent, roofComponent } = require('./parts/components')

const firstHalfPoints = (pointDistanceCM, {POINTS, CIRCLE}, $) => {
  const _POINTS = List.wrapped(POINTS).map( ([startPoint, endPoint]) => {
    const distance = Points.length(startPoint, endPoint)
    let points = []
    for (let i = pointDistanceCM; i < distance/2; i += pointDistanceCM) {
      const [x,y] = Points.pointOnLine(i)(startPoint, endPoint)
      points.push([x+startPoint[0],y+startPoint[1]])
    }
    return points
  })
  return _POINTS
}

const secondHalfPoints = (pointDistanceCM, {POINTS, CIRCLE}, $) => {
  const _POINTS = List.wrapped(POINTS).map( ([endPoint, startPoint]) => {
    const distance = Points.length(startPoint, endPoint)
    let points = []
    for (let i = pointDistanceCM; i < distance/2; i += pointDistanceCM) {
      const [x,y] = Points.pointOnLine(i)(startPoint, endPoint)
      points.push([x+startPoint[0],y+startPoint[1]])
    }
    return points.reverse()
  })
  return _POINTS
}

//
const getPoints = (corner, firstHalf, secondHalf, pointDistanceCM) => {
  const ends = [firstHalf[firstHalf.length-1], secondHalf[0]]
  const distance = Points.length(...ends)
  if (distance < pointDistanceCM*1.2) {
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
    wrapped(i, outerCorners),
    wrapped(i, fifthPoints)[0],
    wrapped(i, fifthPoints)[1],
    wrapped(i, innerCorners),
    wrapped(i-1, fifthPoints)[1],
    wrapped(i-1, fifthPoints)[0]
  ]
}

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

// Main entrypoint, generates all geometry of the chassis
function chassis(params) {

  const s = finShape(params)

  const makeFrame = () => splitFinPieces(s, params)

  const bay = () => ({
    leftOuterWall: bayComponent(s, params, s.outer, s.sides.leftWall, {x: (params.width + params.frameWidth)/2 }, { y: Math.PI/2 }),
    leftInnerWall: bayComponent(s, params, s.inner, s.sides.leftWall, {x: (params.width - params.frameWidth)/2 - params.materialThickness, y: params.frameWidth }, { y: Math.PI/2 }),
    rightOuterWall: bayComponent(s, params, s.outer, s.sides.rightWall, {x: -(params.width + params.frameWidth)/2 - params.materialThickness }, { y: Math.PI/2 }),
    rightInnerWall: bayComponent(s, params, s.inner, s.sides.rightWall, {x: -(params.width- params.frameWidth)/2, y: params.frameWidth }, { y: Math.PI/2 }),
    // rightOuterRoof: roofComponent(s, params, s.sides.rightRoof),
    floor: floorComponent(s, params, s.inner, s.sides.underside, {y: params.frameWidth + params.materialThickness, z: -params.bayLength, x: params.width/2 - params.frameWidth/2 }, {x: Math.PI/2, z: Math.PI/2}),
    roofConnector: bayComponent(s, params, s.outer, s.sides.leftWall, {x: (params.width + params.frameWidth)/2 }, { y: Math.PI/2 }),
    // rightInnerRoof: bayComponent(s, params, s.sides.rightRoof),
    leftOuterRoof: roofComponent(s, params, s.outer, s.sides.leftRoof, {y: params.height - s.outer[0][1]/100 + params.frameWidth/2 }),
    leftInnerRoof: roofComponent(s, params, s.inner, s.sides.leftRoof, {y: params.height - s.inner[0][1]/100 + params.frameWidth/2 }),

    rightOuterRoof: roofComponent(s, params, s.outer, s.sides.rightRoof, {y: params.height - s.outer[0][1]/100 + params.frameWidth/2 }),
    rightInnerRoof: roofComponent(s, params, s.inner, s.sides.rightRoof, {y: params.height - s.inner[0][1]/100 + params.frameWidth/2 }),

    // rightOuterRoof: roofComponent(s, params, s.outer, s.sides.rightRoof, {y: params.height - s.outer[0][1]/100 + params.frameWidth/2 }),
    // leftInnerRoof: bayComponent(s, params, s.sides.leftRoof),
  })

  return {
    frames: Utils.times(params.totalBays, makeFrame),
    bays: Utils.times(params.totalBays, bay),
    parameters: params
  }
}

// All measurements in meters.
// Distances generally center-center
function getParameters() {

  // parameter declaration
  const keys = ['id', 'name', 'type', 'default', 'description'];
  const definitions = [
    // Commonly configured
    ['totalBays', "Bays #", 'number', 6, "Number of bays (blocks inbetween frames)"],
    ['height', "Height", 'distance', 3.0, "Height to top of chassis"],
    ['width', "Width", 'distance', 1.2, "Width of chassis"],
    ['wallHeight', "Wall height", 'distance', 2.5, "Height of wall, where roof starts"],

    // internal
    ['bayLength', "Bay length", 'distance', 1.2, "Distance between each of the frames"],
    ['frameWidth', "Frame width", 'distance', 0.264, "Width of frame body"],
    ['frameDepth', "Frame depth", 'distance', 0.150, "Depth of spacer+fins+reinforcers"],
    // sheet
    ['materialThickness', "Material thickness", 'distance', 18.0/1000, "Nominal thickness of plywood sheet"],
    ['sheetWidth', "Sheet width", 'distance', 1.2, "Width of plywood sheet"],
    ['sheetLength', "Sheet height", 'distance', 2.4, "Length of plywood sheet"],

    ['pointDistanceCM', "Point distance", 'distance', 0.15, "Distance between wren fin points"],

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

const parameters = getParameters();

function calculateAreas(profile, length) {

  // Features we care about
  const walls = new Set(['leftWall', 'rightWall']);
  const undersides = new Set(['underside']);
  const roofs = new Set(['leftRoof', 'rightRoof']);
  const allSides = set.unionAll(walls, undersides, roofs);

  // Pre-condition, all features must be known
  const knownSides = new Set(Object.keys(profile.sides));
  const diff = set.symmetricDifference(knownSides, allSides);
  if (diff.size) {
    throw new Error('frame profile has unknown sides: ' + diff.toString());
  }

  const featureDistance = (points, name) => {
    const indices = profile.sides[name];
    const first = points[indices[0]];
    const second = points[indices[1]];
    const distance = Points.length(first, second)/100; // FIXME: don't use centimeters
    return distance;
  };
  const area = (points, features, length) => {
    return Array.from(features).reduce((sum, name) => {
      const d = featureDistance(points, name);
      const area = d * length;
      return sum + area;
    }, 0)
  };

  const endWallArea = (points) => {
    return Clipper.area(points)/(100*100); // FIXME: don't use centimeters
  }

  const areas = {
    'outerWallArea': area(profile.outer, walls, length.outer) + 2*endWallArea(profile.outer),
    'innerWallArea': area(profile.inner, walls, length.inner) + 2*endWallArea(profile.inner),
    'footprintArea': area(profile.outer, undersides, length.outer),
    'roofArea': area(profile.outer, roofs, length.outer),
    'ceilingArea': area(profile.inner, roofs, length.inner),
    'floorArea': area(profile.inner, undersides, length.inner),
  };

  return areas;
}

function calculateVolumes(profile, length, params) {

  const endWallArea = (points) => {
    return Clipper.area(points)/(100*100); // FIXME: don't use centimeters
  }

  const endWallThickness = params.frameDepth;

  const innerArea = endWallArea(profile.inner);
  const outerArea = endWallArea(profile.outer);
  const frameSection = outerArea - innerArea;
  const frameVolume = frameSection * length.outer;
  const endWallVolume = endWallThickness * innerArea; // endwall sits inside frame

  const volumes = {
    'insulationVolume': frameVolume + 2*endWallVolume, // rough est for insulation needed
    'innerVolume': length.inner * innerArea,
    'outerVolume': length.outer * outerArea,
  };
  return volumes;
}

function geometrics(parameters) {

  const i = parameters;

  const centerLength = i.totalBays * i.bayLength;
  const length = {
    center: centerLength,
    outer: centerLength + i.bayLength, // 2x half a bay
    inner: centerLength - i.bayLength,
  };

  const profile = finShape(parameters);
  const surfaceAreas = calculateAreas(profile, length);
  const volumes = calculateVolumes(profile, length, parameters);

  const outputs = Object.assign(surfaceAreas, volumes);

  // check post-conditions
  const invalids = Object.keys(outputs).filter((key) => {
    const val = outputs[key];
    const valid = typeof val == 'number' && val >= 0 && !isNaN(val);
    return !valid;
  });
  if (invalids.length) {
    console.error('geometrics()', outputs);
    throw new Error("wren.geometrics() outputted invalid values: " + JSON.stringify(invalids));
  }

  return outputs;
}

function estimateCosts(metrics) {
  // for pilots it ranged between 4-8 GBP per sqm.
  // multiple stories -> cheaper
  // thicker frame -> expensive
  // taller -> expensive
  const baseCostPerSqm = 8;
  const chassisCosts = baseCostPerSqm * metrics.footprintArea;
  return chassisCosts;
}

module.exports = {
  SVG,
  CSV,
  finShape,
  geometrics,
  estimateCosts,
  splitFinPieces,
  chassis,
  getParameters,
  parameters
}
