const Bay = require("./bay");
const Frame = require("./frame");
const { times } = require("lodash");

const pieces = (points, inputs) => {
  const numBays = inputs.dimensions.bays;
  const numFrames = numBays + 1;

  return {
    // Frames are the polygonal supports of the building (fins*2, reinforcers*2, spacers)
    frames: times(numFrames, i => Frame(points, inputs, i)),
    // Bays are the sections BETWEEN frames (roof, wall, floor, connectors)
    bays: times(numBays, i => Bay(points, inputs, i))
  };
};

pieces.Bay = Bay;
pieces.Frame = Frame;

module.exports = pieces;
