const svg = points => {
  const move = `M ${points[0]} L`
  const lines = points.slice(1).reduce((str, point) => {
    str += " " + point.join(",")
    return str
  }, "")
  return `<svg><path d="${move}${lines}z"></svg>`
}

const draw = points => mapping => {
  return [ points[mapping[1]], points[mapping[0]] ]
}

const fin = points => {
  const m = points.mapping
  const o = draw(points.center)
  const i = draw(points.center)

  const roof = [
    ...o(m.leftRoof),
    ...o(m.rightRoof),
    ...i(m.rightRoof),
    ...i(m.leftRoof)
  ]

  // console.log(roof)

  // const leftWall = [
  //   o(m.leftWall),
  //   i(m.leftWall),
  // ]

  // return {
  //   roof,
  //   // leftWall
  // }

  // return svg(roof)
  return points.outer
}

module.exports = fin
