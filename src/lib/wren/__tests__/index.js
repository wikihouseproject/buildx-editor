const Wren = require('../index')
const SVG = require('../outputs/svg')
const { shuffle } = require('lodash')

it('has default dimensions', () => {
  const wren = Wren();
  const result = {"battenHeight": 21, "bayLength": 1200, "bays": 9, "beamWidth": 150, "finDepth": 250, "frame": {"width": 286}, "leftWallHeight": 2400, "length": 10800, "rightWallHeight": 2400, "roofApexHeight": 3900, "roofApexOffset": 0, "width": 3900}
  expect(wren.inputs.dimensions).toEqual(result)
});

it('can override default dimensions', () => {
  const wren = Wren({ dimensions: {roofApexHeight: 3000} });
  expect(wren.inputs.dimensions.roofApexHeight).toEqual(3000)
});

describe('pieces', () => {
  const wren = Wren();
  it('generates fin pieces', () => {
    expect(wren.outputs.pieces.fins).toBeInstanceOf(Array)
  })
  it('generates side pieces', () => {
    expect(wren.outputs.pieces.fins).toBeInstanceOf(Array)
  })
  // console.log(SVG.svg([SVG.g(Object.values(wren.outputs.pieces.sides).map(SVG.path))]))
  // console.log(wren.outputs.pieces.fins.map(SVG.path))
  // console.log(SVG.svg([SVG.g(Object.values(wren.outputs.pieces.fins[0]).map(SVG.path))]))
  const finPoints = Object.values(wren.outputs.pieces.fins[0])
  // console.log(SVG.drawSVG(finPoints))
  // console.log(finPoints)
})

it('generates clockwise, TR-first set of points. 0,0 is the top left position.', () => {
  //   4
  // 3   0
  // 2   1
  const wren = new Wren({
    dimensions: {
      width: 5000,
      leftWallHeight: 6000,
      rightWallHeight: 3000,
      roofApexHeight: 9000,
      roofApexOffset: 1000
    }
  });

  expect(wren.points.center).toEqual([
    [5000, 6000], // top right
    [5000, 9000], // bottom right
    [0, 9000], // bottom left
    [0, 3000], // top left
    [3500, 0] // top
  ])
})

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