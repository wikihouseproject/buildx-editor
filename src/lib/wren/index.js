const SVG = require('./outputs/svg')
const CSV = require('./outputs/csv')
const set = require('./utils/set')
const Points = require('./patterns/points')
const Clipper = require('./patterns/clipper')
const { finShape } = require('./steps/2_fin')
const { chassis } = require('./steps/3_chassis')

// const config = {
//   width: 5,
//   height: 3,
//   wallHeight: 2,
//   totalBays: 10,
//   bayLength: 1.2,
//   colors: [ 'yellow', 'green', 'pink', 'blue', 'orange'],
//   materialThickness: 0.018,
//   frameDepth: 0.15,
//   frameWidth: 0.264,

//   sheetWidth: 1.2,
//   sheetHeight: 2.4,

//   // only used in /src/lib/wren so far
//     pointDistanceCM: 15, // distance to propagate points by when dedicing grip positions. Half of grip+nongrip (300mm)
//     initialCameraPosition: { x: 0, y: 8, z: 8 },
//     extrusion: 0.25,
//     spacing: 1,

//   // only used in /vanilla so far
//     connectorWidth: 1.2,
//     connectorHeight: 0.25
// }

// All measurements in meters.
// Distances generally center-center
function getParameters() {

  // parameter declaration
  const keys = ['id', 'name', 'type', 'default', 'description'];
  const definitions = [
    // Commonly configured
    ['height', "Height", 'distance', 4.0, "Height to top of chassis"],
    ['width', "Width", 'distance', 5.2, "Width of chassis"],
    ['wallHeight', "Wall height", 'distance', 2.5, "Height of wall, where roof starts"],
    ['totalBays', "Bays #", 'number', 1, "Number of bays (blocks inbetween frames)"],

    // internal
    ['bayLength', "Bay length", 'distance', 1.2, "Distance between each of the frames"],
    ['frameWidth', "Frame width", 'distance', 0.264, "Width of frame body"],
    ['frameDepth', "Frame depth", 'distance', 0.150, "Depth of spacer+fins+reinforcers"],

    // sheet
    ['materialThickness', "Material thickness", 'distance', 0.018, "Nominal thickness of plywood sheet"],
    ['sheetWidth', "Sheet width", 'distance', 1.2, "Width of plywood sheet"],
    ['sheetLength', "Sheet height", 'distance', 2.4, "Length of plywood sheet"],

    ['pointDistanceCM', "Point distance", 'distance', 0.15, "Distance between wren fin points"],

    ['connectorWidth', "", 'distance', 1.2, ""],
    ['connectorHeight', "", 'distance', 0.25, ""]

    //['tolerance', "Fit tolerance", 'distance', 0.5/1000, "Tolerance for fitting parts"],
  ]

  const defaults = definitions.reduce((ob, def) => {
    // sanity check
    if (def.length != keys.length) {
      throw new Error('Invalid parameter definition for' + def[0]);
    }
    // add definition's name: defaultValue to object
    return Object.assign(ob, { [def[0]]: def[3] })
  }, {})

  return {
    definitions,
    keys,
    defaults,
  }
}

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

  // FIXME: don't use centimeters
  const endWallArea = points => Clipper.area(points)/(100*100)

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

  // FIXME: don't use centimeters
  const endWallArea = points => Clipper.area(points)/(100*100)

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

module.exports = {
  SVG,
  CSV,
  finShape,
  geometrics,
  chassis,
  getParameters,
  parameters: getParameters()
}
