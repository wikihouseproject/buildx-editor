const Wren = require('../index')

const { defaultDimensions } = require('./fixtures')

it('has default dimensions', () => {
  const wren = Wren();
  expect(wren.inputs.dimensions).toEqual(defaultDimensions)
});

it('can override default dimensions', () => {
  const wren = Wren({ dimensions: {roofApexHeight: 3000} });
  expect(wren.inputs.dimensions.roofApexHeight).toEqual(3000)
});

describe('SVG export', () => {
  describe('when passed geometry', () => {
    it('renders an SVG string', () => {
      expect(Wren().toSVG()).toMatch('</svg>')
    });
  });
});

// describe.skip('with simple parameters', () => {
//   const wren = new Wren();
//   it('can generate points', () => {
//     expect(wren.chassis).toHaveProperty('frames')
//   });
// });

// describe.skip('CSV export', () => {
//   const wren = new Wren();
//   it('outputs CSV values', () => {
//     expect(wren.toCSV()).toEqual([1,2,3])
//   });
// });
