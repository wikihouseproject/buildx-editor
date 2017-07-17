import {h, div} from '@cycle/dom'
import {rails, bays, floor, frames, walls, connectors} from '../parts'
import {intent, model, renderControls} from '../extras/functions'

export default function SVG(sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map(([width, height, wallHeight, length]) =>
    div([
      h('svg', {attrs:{ xmlns: 'http://www.w3.org/2000/svg', width: 600, height: 600 }}, [
        h('path', {attrs: { fill: 'red', d: `M 0,0 L ${width*100},0 ${width*100},${height*100} 0,${height*100}z` }},)
      ]),
      ...renderControls(width, height, wallHeight, length)
    ])
  )

  return { DOM: vtree$ }
}
