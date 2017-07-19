import {h} from '@cycle/dom'
import * as wren from '../../lib/wren'

const piece = ([width, height, wallHeight, amount], index, material) => {

  var p = wren.parameters.defaults;
  p.width = width;
  p.height = height;
  p.wallHeight = wallHeight;

  // TODO: move wren geometry generation out of rendering function
  const {points, bounds} = wren.finPoints(p)
  const b = bounds(0)
  return h('a-entity', {attrs:{
    'extrude-svg': {
      path: wren.SVG.closedPath(points(index).map(([x,y]) => [(x-b.minX)/100, (y-b.minY)/100])),
      amount
    },
    material
    // position: '0 0 0',
    // rotation: '0 0 0',
  }})
}


const renderFrames = (count, spacing) => {
  let frames = []
  for (let i = 1; i < count; i++) {
    frames.push(
      h('a-entity', {attrs: { clone: {source: '#frame'}, position: {x: 0, y: 0, z: spacing * Math.floor(-i/2) }}})
    )
    frames.push(
      h('a-entity', {attrs: { clone: {source: '#frame'}, position: {x: 0, y: 0, z: spacing * Math.floor(i /2)}}})
    )
  }
  return frames
}

const renderArrowHelpers = (position, length) => {
  const directions = [['red', '1 0 0'],['green', '0 1 0'],['blue', '0 0 1']]
  return directions.map(([color, dir]) => h('a-entity', {attrs:{
      position,
      'arrow-helper': {
        length,
        color,
        dir
      }
    }}
  ))
}

module.exports = { piece, renderFrames, renderArrowHelpers }
