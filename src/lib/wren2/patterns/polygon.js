const Clipper = require('./clipper');

// function moveLeft(array) {
//   const minMax = array.reduce( (ob, [X,Y]) => {
//     if (X < ob.minX) {
//       ob.minX = X
//     } else if (X > ob.maxX) {
//       ob.maxX = X
//     }
//     if (Y < ob.minY) {
//       ob.minY = Y
//     } else if (Y > ob.maxY) {
//       ob.maxY = Y
//     }
//     return ob
//   }, {
//     minX: Infinity,
//     maxX: -Infinity,
//     minY: Infinity,
//     maxY: -Infinity
//   })

//   const halfWidth = Math.abs(minMax.maxX-minMax.minX)/2
//   const halfHeight = Math.abs(minMax.maxY-minMax.minY)/2

//   return array.map( ([X,Y]) => [X-halfWidth, Y-halfHeight])
// }

function centroid(pts) {
   var first = pts[0], last = pts[pts.length-1];

   if (first[0] !== last[0] || first[1] !== last[1]) pts.push(first);
   var twicearea=0,
      x=0, y=0,
      nPts = pts.length,
      p1, p2, f;
   for ( let i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
      p1 = pts[i]; p2 = pts[j];
      f = p1[0]*p2[1] - p2[0]*p1[1];
      twicearea += f;
      x += ( p1[0] + p2[0] ) * f;
      y += ( p1[1] + p2[1] ) * f;
   }
   f = twicearea * 3;
   return [x/f, y/f];
}

function clockwiseSort(points, indexOfStartingPoint=0) {
  const base = Math.atan2(points[indexOfStartingPoint][1], points[indexOfStartingPoint][0]);
  // const _centroid = centroid(points)
  return points.sort(function(a, b) {
    return Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0]) + (Math.atan2(b[1], b[0]) > base ? - 2 * Math.PI : 0) + (Math.atan2(a[1], a[0]) > base ? 2 * Math.PI : 0);
  });
};

// Array.prototype.move = function (old_index, new_index) {
//   if (new_index >= this.length) {
//     var k = new_index - this.length;
//     while ((k--) + 1) {
//       this.push(undefined);
//     }
//   }
//   this.splice(new_index, 0, this.splice(old_index, 1)[0]);
//   return this; // for testing purposes
// };

function add1([x,y]) {
  return [x+1, y+1]
}
function sub1([x,y]) {
  return [x-1, y-1]
}

// return clockwise ordered array, bottom left first
function normalize(points) {

  return Clipper.normalize(points)

  // const firstItem = points.reduce( (prev, current) => {
  //   if (current[1] === 0 && current[0] < prev[0]) {
  //     return current
  //   } else {
  //     return prev
  //   }
  // }, [Infinity, 0])

  // const indexOfFirstPoint = points.indexOf(firstItem)

  // const sortedPoints = clockwiseSort(points.map(add1), indexOfFirstPoint).map(sub1).reverse()

  // const groundPoints = sortedPoints
  //   .filter( ([X,Y]) => Y === 0)
  //   .sort( (a, b) => a[0] > b[0] )

  // const raisedPoints = sortedPoints
  //   .filter( ([X,Y]) => Y > 0)

  // console.log(sortedPoints)

  // // // const sortedPoints = clockwiseSort(points, indexOfFirstPoint)

  // // const sortedPoints = clockwiseSort([...groundPoints, ...raisedPoints])

  // return [...groundPoints, ...raisedPoints]
}

module.exports = {
  normalize
}