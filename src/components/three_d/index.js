import '../../lib/aframe-components/aframe-extrude-svg-component'
import '../../lib/aframe-components/aframe-clone-component'
import '../../lib/aframe-components/aframe-arrow-helper-component'
import 'aframe-orbit-controls-component-2'

import {h, div} from '@cycle/dom'
import xs from 'xstream'

import {piece, renderFrames, renderArrowHelpers} from './extras'
import { intent, model, renderControls } from '../../extras/functions'
import { initialCameraPosition } from '../../extras/config'

import * as wren from '../../lib/wren'

export default function ThreeD(sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)
  const vtree$ = state$.map(([width, height, wallHeight, bayCount]) =>
    div([
      h('a-scene', {attrs: {stats: true}}, [

        ...renderArrowHelpers('0 0 0', 5),

        h('a-entity', [
          h('a-entity#cameraTarget',{ attrs: {position: '0 0 0' }}, ),
          h('a-entity#frames', {attrs:{position: `-${width/2} ${height} 0`, rotation: '180 0 0'}}, [
            h('a-entity#frame', {attrs:{position: '0 0 0'}}, [
              piece([width, height, wallHeight], 0, 'yellow'),
              piece([width, height, wallHeight], 1, 'green'),
              piece([width, height, wallHeight], 2, 'pink'),
              piece([width, height, wallHeight], 3, 'blue'),
              piece([width, height, wallHeight], 4, 'orange')
            ]),
            ...renderFrames(bayCount)
          ]),
        ]),

        h('a-entity#ground', {attrs:{
          geometry:{ primitive: 'plane', width: 20, height: 20},
          material: {color: '#CCC', side: 'double'},
          position: '0 -0.1 0', rotation: '-90 0 0'
        }}),

        h('a-entity#camera', {attrs:{
          camera: { fov: 90, zoom: 1 },
          position: initialCameraPosition,
          'orbit-controls': {
            invertZoom: true,
            target: '#cameraTarget',
            autoRotate: false,
            enableDamping: true,
            dampingFactor: 0.125,
            rotateSpeed:0.1,
            minDistance:3,
            maxDistance:100,
            maxPolarAngle: Math.PI/2
          }
        }})

      ]),
      ...renderControls(width, height, wallHeight, bayCount)
    ])
  )

  return { DOM: vtree$ }
}
