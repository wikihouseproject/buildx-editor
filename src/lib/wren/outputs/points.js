const Clipper = require('../utils/clipper')
const List = require('../utils/list')
const { curry, zipObject } = require('lodash')

/**
 * Returns the three sets of points that dictate the shape of a WREN chassis.
 * 0,0 is Top Left.
 * @param {Object}
 * @return {Array} points
 */
const points = ({ finDepth, width, leftWallHeight, rightWallHeight, roofApexHeight, roofApexOffset }) => {
  // NOTE: if these points are changed, it is likely that mapping below will break
  const _center = [
    [0, roofApexHeight], // bottom left
    [width, roofApexHeight], // bottom right
    [width, roofApexHeight-rightWallHeight], // top right
    [width/2+roofApexOffset, 0], // top
    [0, roofApexHeight-leftWallHeight] // top left
  ]

  // order all of the points consistently
  const center = Clipper.offset(_center, {DELTA: 0})
  const inner = Clipper.offset(center, {DELTA: -finDepth/2})
  const outer = Clipper.offset(center, {DELTA: finDepth/2})

  const mapToObject = curry(zipObject)(['TR', 'BR', 'BL', 'TL', 'T'])

  return {
    center: mapToObject(center),
    inner: mapToObject(inner),
    outer: mapToObject(outer)
  }
}

module.exports = points
