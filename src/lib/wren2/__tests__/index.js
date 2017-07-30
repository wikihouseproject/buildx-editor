const Wren = require('../index');
const SVG = require('../outputs/svg');
const { shuffle } = require('lodash')


it('has default dimensions', () => {
  const wren = Wren();
  expect(wren.inputs.dimensions).toEqual({"battenHeight": 21, "bayLength": 1200, "bays": 9, "beamWidth": 150, "finDepth": 250, "frame": {"width": 286}, "leftWallHeight": 2400, "length": 10800, "rightWallHeight": 2400, "roofApexHeight": 3900, "roofApexOffset": 0, "width": 3900})
});

it('can override default dimensions', () => {
  const wren = Wren({ dimensions: {roofApexHeight: 3000} });
  expect(wren.inputs.dimensions.roofApexHeight).toEqual(3000)
});

const wren = Wren();
// console.log(SVG.svg([SVG.g(Object.values(wren.outputs.pieces.sides).map(SVG.path))]))
// console.log(wren.outputs.pieces.fins.map(SVG.path))
// console.log(SVG.svg([SVG.g(Object.values(wren.outputs.pieces.fins[0]).map(SVG.path))]))
console.log( SVG.drawSVG(Object.values(wren.outputs.pieces.fins[0]))  )

// it('generates an clockwise, TL-first, 2D point shape', () => {
//   const wren = new Wren();
//   const { width, leftWallHeight, rightWallHeight, roofApexHeight, roofApexOffset } = wren.inputs.dimensions;
//   expect(wren.points.center).toEqual([
//     [0,0],
//     [width,0],
//     [width,rightWallHeight],
//     [width/2+roofApexOffset,roofApexHeight],
//     [0,leftWallHeight]
//   ])
// })

// describe.skip('with simple parameters', () => {
//   const wren = new Wren();
//   it('can generate points', () => {
//     expect(wren.chassis).toHaveProperty('frames')
//   });
// });

// describe.skip('SVG export', () => {
//   const wren = new Wren();
//   describe('when passed geometry', () => {
//     it('renders an SVG string', () => {
//       expect(wren.toSVG()).toMatch('</svg>')
//     });
//   });
// });

// describe.skip('CSV export', () => {
//   const wren = new Wren();
//   it('outputs CSV values', () => {
//     expect(wren.toCSV()).toEqual([1,2,3])
//   });
// });

describe('metrics', () => {
  const wren = new Wren();
  describe('when passed geometry', () => {

    it.skip('outputs dimensions in mm', () => {
      const { internal, external } = wren.outputs.dimensions;
      expect(internal.width).toEqual(3553)
      expect(external.width).toEqual(4486)
      expect(internal.length).toEqual(10603)
      expect(external.length).toEqual(11250)
    });

    it('outputs areas in mm²', () => {
      const { internal, external } = wren.outputs.areas;

      expect(external.footprint).toEqual(50467500)
      expect(internal.floor).toEqual(37676012)

      expect(internal.roof).toEqual(46942843.634104006) //49240

      // expect(outputs).toHaveProperty('areas.intRoof', 49240),
      // expect(outputs).toHaveProperty('areas.intWall', 88890),
      // expect(outputs).toHaveProperty('areas.openings', 14660),
      // expect(outputs).toHaveProperty('areas.surface', 185440)
    });

    it('outputs volumes in mm³', () => {
      const { volumes } = wren.outputs;
      expect(volumes.insulation).toEqual(420960)
    });
  });
});
