import '../lib/aframe-components/aframe-extrude-svg-component'
import '../lib/aframe-components/aframe-clone-component'

import {h, div} from '@cycle/dom'
import xs from 'xstream'

import { rails, bays, floor, frames, walls, connectors } from '../parts'
import { floorArea, intent, model, renderControls } from '../extras/functions'

import S from '../lib/s'

const piece = ([width, height, wallHeight], index, color) => {
  const {viewBox, points, bounds, close} = S({width: width*100, height: height*100, wallHeight: wallHeight*100, frameWidth: 10})
  const b = bounds(0)
  return h('a-entity', {attrs:{
    'extrude-svg': {
      path: close(points(index).map(([x,y]) => [(x-b.minX)/100, (y-b.minY)/100])),
      amount: 0.25
    },
    material: { color }
    // position: '0 0 0',
    // rotation: '0 0 0',
  }})
}

const renderFrames = count => {
  let frames = []
  for (let i = 1; i < count; i++) {
    frames.push(
      h('a-entity', {attrs: { clone: {id: '#frame'}, position: {x: 0, y: 0, z: i}}})
    )
  }
  return frames
}

export default function ThreeD(sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map(([width, height, wallHeight, bayCount]) =>
    div([
      h('a-scene', {attrs: {stats: true}}, [

        h('a-entity', {attrs: {id: 'frames', position: '-2.4 6 -10', rotation: '180 0 0'}}, [
          h('a-entity', {attrs: {id: 'frame', position: '0 0 0'}}, [
            piece([width, height, wallHeight], 0, 'yellow'),
            piece([width, height, wallHeight], 1, 'green'),
            piece([width, height, wallHeight], 2, 'pink'),
            piece([width, height, wallHeight], 3, 'blue'),
            piece([width, height, wallHeight], 4, 'orange')
          ]),
          ...renderFrames(bayCount)
        ]),

        h('a-entity', {attrs:{
          id: 'leftWall',
          geometry:{ primitive: 'box', width: 0.24, height: wallHeight },
          material: {color: 'red'},
          position: {x:-width/2-0.24, y: 0, z: -10}
        }}),

        h('a-entity', {attrs:{
          id: 'ground',
          geometry:{ primitive: 'plane', width: 20, height: 20},
          material: {color: '#CCC', side: 'double'},
          position: '0 -0.01 -10', rotation: '-90 0 0'
        }})

      ]),
      ...renderControls(width, height, wallHeight, bayCount)
    ])
  )

  return { DOM: vtree$ }
}

/*
<a-scene stats={true}>
  <a-entity id="frames" position="-2.4 6 -10" rotation="180 0 0">
    <a-entity id="frame" position="0 0 0">
      <a-entity extrude-svg={{path: path, amount: 0.25}} material={{ color: color }}></a-entity>
    </a-entity>
    <a-entity clone={{id: '#frame'}} position="0 0 3" />
    <a-entity clone={{id: '#frame'}} position="0 0 2" />
    <a-entity clone={{id: '#frame'}} position="0 0 1" />
  </a-entity>
</a-scene>
*/

/*
scene(attrs({stats: true}),[
  entity('#frames', attrs({position: '-2 6 10', rotation: '180 0 0'}), [
    entity('#frame', attrs({position: '0 0 0'}), [
      piece()
    ])
  ])
])
*/
