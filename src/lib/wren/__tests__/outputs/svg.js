const SVG = require('../../outputs/svg')

it('outputs SVG <path /> from points', () => {
  const points = [
    [0,0],
    [10,10],
    [4,10],
    [5.3,2]
  ]
  expect(SVG.path(points)).toEqual('<path d="M0,0 L10,10 4,10 5.3,2z"></path>')
})

it('wraps elements with <svg>', () => {
  const elements = [
    '<a></a>',
    "<b></b>"
  ]
  const result = '<svg xmlns="http://www.w3.org/2000/svg"><a></a><b></b></svg>'
  expect(SVG.svg(elements)).toEqual(result)
})

it('wraps elements with <g>', () => {
  const elements = [
    "<a></a>",
    "<b></b>"
  ]
  const result = '<g><a></a><b></b></g>'
  expect(SVG.g(elements)).toEqual(result)
})

it('draws SVG from points', () => {
  const points = [
    [0,0],
    [1,1],
    [2,2]
  ]
  const result = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><g>' +
    '<path d="M0,0 L1,1 2,2z"></path></g></svg>'
  expect(SVG.drawSVG(points)).toEqual(result)
})
