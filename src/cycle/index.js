import {run} from '@cycle/run'
import {div, label, input, hr, h1, makeDOMDriver, svg, h} from '@cycle/dom'

function main(sources) {
  const input$ = sources.DOM.select('.field').events('input')
  const name$ = input$.map(ev => ev.target.value).startWith('')
  const vdom$ = name$.map(name =>
    div([
      label('Name:'),
      input('.field', {attrs: {type: 'text'}}),
      hr(),
      h1('Hello ' + name),
      hr(),
      svg([
        // h('circle', {attrs: {cx: 50, cy: 50, r: 40, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}}),
        svg.circle({attrs: {cx: 50, cy: 50, r: 40, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}}),
        svg.path({attrs: {d: 'M0,0 L40,0 40,40 0,40z', fill: 'red'}})
      ])
    ])
  )

  return { DOM: vdom$ }
}

run(main, { DOM: makeDOMDriver('#container') })
