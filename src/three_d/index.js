import {h, div, span, input} from '@cycle/dom'

import {intent, model} from './includes'
import {renderControls} from './controls'

import S from '../lib/s'

export function App (sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map( ([width, height, wallHeight, bayCount]) =>
    h('div', [
      h('a-scene', {attrs: { stats: true }}, [

        h('a-entity', {attrs: { id: 'house', position: '0 0 -10' }}, [
          h('a-entity', {attrs: { id: 'cameraTarget', position: '0 2 0' }}),

          h('a-entity', {attrs:{
            geometry: {primitive: 'box', width, height, depth: bayCount },
            material: {color: 'red'}
          }}),

          h('a-entity', {attrs:{
            id: 'camera',
            camera: { fov: 90, zoom: 1 },
            position: {x: 6, y: 8, z: 10 },
            'orbit-controls': {
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

        h('a-entity', {attrs:{
          id: 'ground',
          geometry: {primitive: 'plane', width: 20, height: 20},
          material: {color: '#CCC', side: 'double'},
          position: '0 -0.01 -10', rotation: '-90 0 0'
        }}),

      ]),

      ...renderControls(width, height, wallHeight, bayCount)
    ])

  )
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
