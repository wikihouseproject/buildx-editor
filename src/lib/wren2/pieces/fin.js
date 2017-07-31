const _draw = points => (mapping, index) => points[mapping[index]]

const Point = require('../patterns/point')

const fin = points => {
  const m = points.mapping
  const o = _draw(points.outer)
  const i = _draw(points.inner)

  const roof = [
    o(m.leftRoof, 0),
    o(m.leftRoof, 1),
    o(m.rightRoof, 1),
    i(m.rightRoof, 1),
    i(m.rightRoof, 0),
    i(m.leftRoof, 0),
  ]

  return roof
}

module.exports = fin
