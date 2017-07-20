const Shape = require('clipper-js').default

const offset = (POINTS, {DELTA=-1, JOINT_TYPE='jtMiter', END_TYPE='etClosedPolygon', MITER_LIMIT=Infinity, ROUND_PRECISION=0}) => {

  // needed to prevent rounding
  const multiplier = 1e6

  const newPoints = POINTS.reduce((chain, pair) => {
    chain.push({ X: pair[0] * multiplier, Y: pair[1] * multiplier })
    return chain
  }, [])

  const subject = new Shape([newPoints], true)
  const newShape = subject.offset(DELTA * multiplier, {
    jointType: JOINT_TYPE,
    endType: END_TYPE,
    miterLimit: MITER_LIMIT,
    roundPrecision: ROUND_PRECISION
  })

  const OFFSET_POINTS = newShape.paths[0].reduce((chain, pair) => {
    chain.push([pair.X / multiplier, pair.Y / multiplier])
    return chain
  }, [])

  return OFFSET_POINTS
}

module.exports = {
  offset
}
