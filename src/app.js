import {h, div} from '@cycle/dom'
import xs from 'xstream'

const intent = domSource => {
  return {
    width$: domSource.select('input#width')
                    .events('input')
                    .map(ev => Number(ev.target.value))
                    .startWith(100),

    height$: domSource.select('input#height')
                    .events('input')
                    .map(ev => Number(ev.target.value))
                    .startWith(50)
  }
}

const model = actions => {
  return xs.combine(actions.width$, actions.height$)
}

export function App (sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map( ([width, height]) =>
    h('div', [

      h('a-scene', {attrs: { stats: true }}, [
        h('a-box', {attrs: { id: 'target', width: width/100, position: '-1 0.5 -3', rotation: "0 45 0", color: "#4CC3D9" }}),

        // h('a-entity', {attrs:{
        //   hello: { name: width }
        // }}),

        h('a-entity', {attrs:{
          id: 'camera',
          camera: { fov: 90, zoom: 1 },
          position: {x: 0, y: 5, z: 4 },
          'orbit-controls': {
            target: '#target',
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

      h('h1', width),
      h('input', {attrs: { id: 'width', value: width, type: 'range', min: 1, max: 200 }}),
      h('h1', height),
      h('input', {attrs: { id: 'height', value: height, type: 'range', min: 1, max: 200 }}),
    ])


  )
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
