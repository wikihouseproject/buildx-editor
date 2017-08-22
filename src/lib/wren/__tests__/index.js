const Wren = require('../index')
const cutsheet = require('../outputs/cutsheet');
const 3d = require('../outputs/3d')

const { defaultDimensions } = require('./fixtures')

it('has default dimensions', () => {
  const wren = Wren();
  expect(wren.inputs.dimensions).toEqual(defaultDimensions)
});

it('can override default dimensions', () => {
  const wren = Wren({ dimensions: {roofApexHeight: 3000} });
  expect(wren.inputs.dimensions.roofApexHeight).toEqual(3000)
});




it('output geometry is sane', () => {
  const wren = Wren({ dimensions: {roofApexHeight: 3000} });

  var parts = [];
  const addPart = (part, path) => {
    parts.push({ part, path })
  }
  cutsheet.traverseDepthFirst(wren.outputs.pieces, [], cutsheet.isPartGeometry, addPart);

  //console.log(parts.map((p) => p.path.join('-')).join('\n'))

  // Basic check of structure
  // TODO: check that number of parts of each type is as expected
  // F frames
  // N fins per frame
  // N reinforcers per frame
  // B bays
  // 
  expect(parts).toHaveLength(308)


  // Sanity check the geometry itself
//  const p = getPointsPosition3d(parts[0].part)
//  console.log(parts[0].path.join('-'), p)
  
  const points = parts.map((p) => getPointsPosition3d(p.part))
  const houseBoundingBox = [...] // FIXME: calculate from input dimensions

  const outsideHouseBounds = (point) => {
    // FIXME: check that point falls inside the cube that is the house bounding box
  }

  const insanePoints = points.filter(outsideHouseBounds)

  expect(insanePoints).toHaveLength(0)

});

describe('SVG export', () => {
  describe('when passed geometry', () => {
    it('renders an SVG string', () => {
      expect(Wren().toSVG()).toMatch('</svg>')
    });
  });
});
