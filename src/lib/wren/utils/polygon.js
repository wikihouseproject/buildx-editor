// NOTE: remove this file and its tests, merge with clipper

const Clipper = require('./clipper');

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

function add1([x,y]) {
  return [x+1, y+1]
}
function sub1([x,y]) {
  return [x-1, y-1]
}

// return clockwise ordered array, bottom left first
function normalize(points) {
  return Clipper.normalize(points)
}

module.exports = {
  normalize
}
