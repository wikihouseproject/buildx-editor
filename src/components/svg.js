import {h, div} from '@cycle/dom'

import wren from '../lib/wren'
import {intent, model, renderControls} from '../extras/functions'

const cutPaths = (width, height, wallHeight) => {
  const out = wren({width: width*100, height: height*100, wallHeight: wallHeight*100, frameWidth: 10});

  // TODO: include naming and grouping
  var paths = [];
  for (var i=0; i<5; i++) {
    console.log('i', i);
    const p = out.close(out.points(i));
    paths.push(p);
  }

  return paths;
}

export default function renderCutsheets(sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map(([width, height, wallHeight, length]) => {

    const cuts = cutPaths(width, height, wallHeight).map( (p) =>
        h('path', {attrs: { fill: 'none', stroke: 'red', d: p }})
    )

    return div([
      h('svg', {attrs:{ xmlns: 'http://www.w3.org/2000/svg', width: 600, height: 600 }}, cuts),
      ...renderControls(width, height, wallHeight, length)
    ])
  })

  return { DOM: vtree$ }
}
