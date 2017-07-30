const SVG = require('../../outputs/svg')

it('outputs SVG path from points', () => {
  const points = [
    [0,0],
    [10,10],
    [4,10],
    [5.3,2]
  ]
  expect(SVG.path(points)).toEqual('<path d="M0,0 L10,10 4,10 5.3,2z"></path>')
})
