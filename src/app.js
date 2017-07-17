import {h, div} from '@cycle/dom'
import xs from 'xstream'

export function App (sources) {

  const width$ = sources.DOM.select('input#width')
                    .events('input')
                    .map(ev => Number(ev.target.value))
                    .startWith(100)

  const height$ = sources.DOM.select('input#height')
                    .events('input')
                    .map(ev => Number(ev.target.value))
                    .startWith(50)

  const vtree$ = xs.combine(width$, height$).map( ([width, height]) =>
    h('div', [
      h('h1', width),
      h('input', {attrs: { id: 'width', value: width, type: 'range', min: 1, max: 200 }}),
      h('h1', height),
      h('input', {attrs: { id: 'height', value: height, type: 'range', min: 1, max: 200 }}),
      h('br'),
      h('svg', [
        h('path', {attrs: { d: `M0,0 L${width},0 ${width},${height}z`, fill: 'red'}})
      ])


    ])


  )
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
