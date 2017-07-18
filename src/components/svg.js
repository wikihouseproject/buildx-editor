import {h, div} from '@cycle/dom'

import wren from '../lib/wren'
import {intent, model, renderControls} from '../extras/functions'

const SVG = require('../lib/wren/patterns/svg.js')

const cutPaths = (width, height, wallHeight) => {
  const out = wren({width: width*100, height: height*100, wallHeight: wallHeight*100, frameWidth: 10});

  // TODO: include naming and grouping
  var paths = [];
  for (var i=0; i<5; i++) {
    const p = out.close(out.points(i));
    paths.push(p);
  }

  return paths;
}

// SVG conventions
// origin = top-left, positive Y downwards, clockwise points
const rectangle = (width, height, o) => {
  o = o || {};
  o.x = o.x || 0;
  o.y = o.y || 0;
  return [
    [ o.x, o.y ],
    [ o.x+width, o.y ],
    [ o.x+width, o.y+height ],
    [ o.x, o.y+height ],
  ];
}

export default function renderCutsheets(sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map(([width, height, wallHeight, length]) => {

    var cuts = cutPaths(width, height, wallHeight).map( (p) =>
      h('path', {attrs: { fill: 'none', stroke: 'red', d: p }})
    )

    const cutsheet = { width: 1.2, height: 2.4 }; // TODO: pass as parameters
    const r = rectangle(cutsheet.width*100, cutsheet.height*100);
    const c = h('path', { attrs: { fill: 'none', stroke: 'grey', d: SVG.closedPath(r) }});
    const paths = cuts.concat([c]);

    return div([
      h('svg', {attrs:{ xmlns: 'http://www.w3.org/2000/svg', width: 600, height: 600 }}, paths),
      ...renderControls(width, height, wallHeight, length)
    ])
  })

  return { DOM: vtree$ }
}
