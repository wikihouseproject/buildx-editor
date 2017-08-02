const areas = dimensions => {
  return {
    internal: {
      floor: dimensions.internal.width * dimensions.internal.length,
      // roof: (r * dimensions.internal.length)*2,
      // wall: 88890,
    },
    external: {
      footprint: dimensions.external.width * dimensions.external.length,
    }
  }
}

module.exports = areas

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

//   const featureDistance = (points, name) => {
//     const indices = profile.sides[name];
//     const first = points[indices[0]];
//     const second = points[indices[1]];
//     const distance = Points.length(first, second)/100; // FIXME: don't use centimeters
//     return distance;
//   };
//   const area = (points, features, length) => {
//     return Array.from(features).reduce((sum, name) => {
//       const d = featureDistance(points, name);
//       const area = d * length;
//       return sum + area;
//     }, 0)
//   };

//   // FIXME: don't use centimeters
//   const endWallArea = points => Clipper.area(points)/(100*100)

//   const areas = {
//     'outerWallArea': area(profile.outer, walls, length.outer) + 2*endWallArea(profile.outer),
//     'innerWallArea': area(profile.inner, walls, length.inner) + 2*endWallArea(profile.inner),
//     'footprintArea': area(profile.outer, undersides, length.outer),
//     'roofArea': area(profile.outer, roofs, length.outer),
//     'ceilingArea': area(profile.inner, roofs, length.inner),
//     'floorArea': area(profile.inner, undersides, length.inner),
//   };

//   return areas;
// }
