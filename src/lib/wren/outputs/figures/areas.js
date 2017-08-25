const Clipper = require('../../utils/clipper')
const Point = require('../../utils/point')
const roof = require('../../outputs/pieces/bay/side')
const O = require('../../utils/object')

const featureDistance = (points, name) => {
  const indices = profile.sides[name];
  const first = points[indices[0]];
  const second = points[indices[1]];
  const distance = Points.length(first, second);
  return distance;
}

const area = (points, features, length) => {
  return Array.from(features).reduce((sum, name) => {
    const d = featureDistance( Object.values(points), name);
    const area = d * length;
    return sum + area;
  }, 0)
}
// function calculateAreas(profile, length) {
//   // Features we care about
//   const walls = new Set(['leftWall', 'rightWall']);
//   const undersides = new Set(['underside']);
//   const roofs = new Set(['leftRoof', 'rightRoof']);
//   const allSides = set.unionAll(walls, undersides, roofs);
//   // Pre-condition, all features must be known
//   const knownSides = new Set(Object.keys(profile.sides));
//   const diff = set.symmetricDifference(knownSides, allSides);
//   if (diff.size) {
//     throw new Error('frame profile has unknown sides: ' + diff.toString());
//   }
//   return areas;
// }

const roofArea = (start, end, length) => Point.distance(start, end) * length

const areas = (inputs, dimensions, points) => {

  const inputDimensions = inputs.dimensions
  const iEndWallArea = Clipper.area(Object.values(points.inner))
  const eEndWallArea = Clipper.area(Object.values(points.outer))

  const leftRoofArea = roofArea(points.inner.TL, points.inner.T, dimensions.internal.length)
  const rightRoofArea = roofArea(points.inner.TL, points.inner.T, dimensions.internal.length)

//   const innerArea = endWallArea(profile.inner);
//   const outerArea = endWallArea(profile.outer);

  const _areas = {
    internal: {
      floor: dimensions.internal.width * dimensions.internal.length, // area(profile.inner, undersides, length.inner),
      // roof: (roofLength * dimensions.internal.length)*2, // area(profile.outer, roofs, length.outer)

      walls: (inputDimensions.leftWallHeight + inputDimensions.rightWallHeight) * dimensions.internal.length + (2 * iEndWallArea),
              // area(profile.inner, walls, length.inner) + 2*endWallArea(profile.inner),

      roof: leftRoofArea + rightRoofArea,
      // openings: 10, //
      // endWalls: points => Clipper.area(points)/(100*100),
      // surface: 10,
      endWall: iEndWallArea
    },
    external: {
      footprint: dimensions.external.width * dimensions.external.length, // area(profile.outer, undersides, length.outer)
      // walls: area(profile.outer, walls, length.outer) + 2*endWallArea(profile.outer),
      // roof: area(profile.outer, roofs, length.outer)
      endWall: eEndWallArea
    },
    // openings: {
    //   // total: 100,
    // }
  }
  // console.log(unit(100000, 'mm^2').to('mm^2').value)

  return _areas
}

module.exports = areas
