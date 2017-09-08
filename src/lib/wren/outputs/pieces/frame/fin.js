// The fin is the shape of the frame of a wikihouse.

const Point = require("../../../utils/point");
const List = require("../../../utils/list");

const draw = points => {
  const arrayLength = Object.values(points.outer).length;
  const si = List.safeIndex(arrayLength);

  let shapes = [];

  for (let i = 0; i < arrayLength; i++) {
    shapes.push([
      points.outer[si(i - 1)].MID,
      points.outer[i].START,
      points.outer[i].MID,
      points.inner[i].MID,
      points.inner[i].START,
      points.inner[si(i - 1)].MID
    ]);
  }

  return shapes;
};

function withMidpoints([start, end]) {
  const mid = Point.midpoint(start, end);
  return { START: start, END: end, MID: mid };
}

const fin = points => {
  const pointsWithMidPoints = {
    outer: List.loopifyInPairs(Object.values(points.outer)).map(withMidpoints),
    inner: List.loopifyInPairs(Object.values(points.inner)).map(withMidpoints)
  };

  return draw(pointsWithMidPoints);
};

module.exports = fin;
